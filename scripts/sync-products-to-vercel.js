/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const DEFAULT_STATE_FILE = path.join(__dirname, 'sync-state.json');
const DEFAULT_LOG_FILE = path.join(__dirname, 'sync.log');
const DEFAULT_BATCH_SIZE = 200;
const DEFAULT_LAST_SYNC = '1970-01-01T00:00:00.000Z';

function env(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : fallback;
}

function required(name) {
  const value = env(name);
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function nowIso() {
  return new Date().toISOString();
}

function appendLog(file, message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(file, line, 'utf8');
  console.log(message);
}

function readState(file) {
  if (!fs.existsSync(file)) {
    return { lastSync: DEFAULT_LAST_SYNC };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    const lastSync = typeof parsed.lastSync === 'string' ? parsed.lastSync : DEFAULT_LAST_SYNC;
    return { lastSync };
  } catch {
    return { lastSync: DEFAULT_LAST_SYNC };
  }
}

function writeState(file, state) {
  fs.writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function defaultProductsQuery() {
  return `
    SELECT
      sku,
      descripcion,
      referencia,
      texto_descripcion AS "textoDescripcion",
      image_url AS "imageUrl",
      categoria AS "categoryName",
      updated_at AS "sourceUpdatedAt",
      is_active AS "isActive"
    FROM products
    WHERE updated_at > $1
    ORDER BY updated_at ASC
  `;
}

function defaultDeactivateQuery() {
  return `
    SELECT sku
    FROM products
    WHERE updated_at > $1
      AND COALESCE(is_active, true) = false
      AND sku IS NOT NULL
  `;
}

function normalizeProduct(row) {
  const sku = String(row.sku || '').trim();
  const descripcion = String(
    row.descripcion || row.descripcion_corta || row.name || row.nombre || '',
  ).trim();

  if (!sku || !descripcion) {
    return null;
  }

  return {
    sku,
    descripcion,
    referencia: String(row.referencia || '').trim(),
    textoDescripcion: String(row.textoDescripcion || row.texto_descripcion || '').trim(),
    imageUrl: String(row.imageUrl || row.image_url || '').trim() || '/no-photo.avif',
    categoryName: String(row.categoryName || row.categoria || row.category || '').trim(),
    sourceUpdatedAt: row.sourceUpdatedAt || row.source_updated_at || row.updated_at || null,
    isActive: typeof row.isActive === 'boolean' ? row.isActive : true,
  };
}

async function postBatch({ apiUrl, token, products, deactivateSkus, retries, logFile }) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= retries) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-sync-token': token,
        },
        body: JSON.stringify({ products, deactivateSkus }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const json = await response.json();
      appendLog(logFile, `Batch synced: ${JSON.stringify(json.summary || json)}`);
      return;
    } catch (error) {
      lastError = error;
      attempt += 1;
      appendLog(logFile, `Batch failed (attempt ${attempt}/${retries + 1}): ${error.message}`);
      if (attempt <= retries) {
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
  }

  throw lastError;
}

async function main() {
  const sourceDbUrl = env('SOURCE_DB_URL') || required('SOURCE_DATABASE_URL');
  const syncApiUrl = required('SYNC_API_URL');
  const syncApiToken = required('SYNC_API_TOKEN');

  const stateFile = env('SYNC_STATE_FILE', DEFAULT_STATE_FILE);
  const logFile = env('SYNC_LOG_FILE', DEFAULT_LOG_FILE);
  const batchSize = Number(env('SYNC_BATCH_SIZE', String(DEFAULT_BATCH_SIZE))) || DEFAULT_BATCH_SIZE;
  const retries = Number(env('SYNC_RETRIES', '3')) || 3;

  const state = readState(stateFile);
  const lastSync = state.lastSync || DEFAULT_LAST_SYNC;
  appendLog(logFile, `Sync started. lastSync=${lastSync}`);

  const source = new PrismaClient({ datasources: { db: { url: sourceDbUrl } }, log: ['error'] });

  try {
    const productsQuery = env('SOURCE_PRODUCTS_QUERY') || defaultProductsQuery();
    const deactivateQuery = env('SOURCE_DEACTIVATE_QUERY') || defaultDeactivateQuery();

    const rawProducts = await source.$queryRawUnsafe(productsQuery, lastSync);
    const normalizedProducts = rawProducts.map(normalizeProduct).filter(Boolean);

    const rawDeactivateRows = await source.$queryRawUnsafe(deactivateQuery, lastSync);
    const deactivateSkus = rawDeactivateRows
      .map((row) => String(row.sku || '').trim())
      .filter(Boolean);

    appendLog(
      logFile,
      `Fetched ${normalizedProducts.length} changed products and ${deactivateSkus.length} deactivation candidates.`,
    );

    const productBatches = chunk(normalizedProducts, Math.max(1, batchSize));

    if (productBatches.length === 0 && deactivateSkus.length === 0) {
      const newState = { lastSync: nowIso() };
      writeState(stateFile, newState);
      appendLog(logFile, 'No changes found. State updated.');
      return;
    }

    for (const [index, batch] of productBatches.entries()) {
      appendLog(logFile, `Sending batch ${index + 1}/${productBatches.length} with ${batch.length} products...`);
      await postBatch({
        apiUrl: syncApiUrl,
        token: syncApiToken,
        products: batch,
        deactivateSkus: [],
        retries,
        logFile,
      });
    }

    if (deactivateSkus.length > 0) {
      const deactivateBatches = chunk(deactivateSkus, Math.max(1, batchSize));
      for (const [index, batch] of deactivateBatches.entries()) {
        appendLog(
          logFile,
          `Sending deactivation batch ${index + 1}/${deactivateBatches.length} with ${batch.length} SKUs...`,
        );
        await postBatch({
          apiUrl: syncApiUrl,
          token: syncApiToken,
          products: [],
          deactivateSkus: batch,
          retries,
          logFile,
        });
      }
    }

    let maxSourceUpdatedAt = parseDate(lastSync);
    for (const product of normalizedProducts) {
      const parsed = parseDate(product.sourceUpdatedAt);
      if (!parsed) continue;
      if (!maxSourceUpdatedAt || parsed.getTime() > maxSourceUpdatedAt.getTime()) {
        maxSourceUpdatedAt = parsed;
      }
    }

    const nextLastSync = maxSourceUpdatedAt
      ? new Date(maxSourceUpdatedAt.getTime() + 1).toISOString()
      : nowIso();

    writeState(stateFile, { lastSync: nextLastSync });
    appendLog(logFile, `Sync completed. nextLastSync=${nextLastSync}`);
  } finally {
    await source.$disconnect();
  }
}

main().catch((error) => {
  const logFile = env('SYNC_LOG_FILE', DEFAULT_LOG_FILE);
  appendLog(logFile, `Sync failed: ${error.message}`);
  process.exit(1);
});
