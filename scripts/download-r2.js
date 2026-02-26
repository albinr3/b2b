/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');
const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');

const DEFAULT_PREFIX = 'fotos';
const DEFAULT_OUTPUT_DIR = path.join('r2-downloads', 'fotos');
const DEFAULT_CONCURRENCY = 4;

function loadEnvFromFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalizePrefix(prefix) {
  if (!prefix) return '';
  const cleaned = String(prefix).replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
  return cleaned ? `${cleaned}/` : '';
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function toSafeRelativePath(key, prefix) {
  const rel = prefix && key.startsWith(prefix) ? key.slice(prefix.length) : key;
  const normalized = rel.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized || normalized.endsWith('/')) return null;

  const parts = normalized.split('/').filter(Boolean);
  if (parts.some((part) => part === '.' || part === '..')) {
    throw new Error(`Unsafe key path detected: ${key}`);
  }

  return path.join(...parts);
}

async function listObjects(client, bucket, prefix) {
  const objects = [];
  let continuationToken;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const item of response.Contents || []) {
      if (!item.Key) continue;
      if (item.Key.endsWith('/')) continue;
      objects.push({
        key: item.Key,
        size: Number(item.Size || 0),
        lastModified: item.LastModified || null,
      });
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects;
}

async function writeBodyToFile(body, destination) {
  await fsp.mkdir(path.dirname(destination), { recursive: true });

  if (body && typeof body.pipe === 'function') {
    await pipeline(body, fs.createWriteStream(destination));
    return;
  }

  if (body && typeof body.transformToByteArray === 'function') {
    const bytes = await body.transformToByteArray();
    await fsp.writeFile(destination, Buffer.from(bytes));
    return;
  }

  throw new Error('Unsupported response body stream from S3 client');
}

async function runPool(items, worker, limit) {
  let index = 0;
  const safeLimit = Math.max(1, limit);
  const runners = new Array(safeLimit).fill(0).map(async () => {
    while (true) {
      const i = index++;
      if (i >= items.length) break;
      await worker(items[i], i);
    }
  });
  await Promise.all(runners);
}

async function main() {
  const outputDirArg = process.argv[2] || DEFAULT_OUTPUT_DIR;
  const prefixArg = process.argv[3] || DEFAULT_PREFIX;

  loadEnvFromFile(path.resolve(process.cwd(), '.env'));
  loadEnvFromFile(path.resolve(process.cwd(), '.env.local'));

  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_REGION,
  } = process.env;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    console.error('Missing R2_* environment variables. Check your .env / .env.local.');
    process.exit(1);
  }

  const prefix = normalizePrefix(prefixArg);
  const outputDir = path.resolve(outputDirArg);
  const concurrency = Number(process.env.R2_DOWNLOAD_CONCURRENCY || DEFAULT_CONCURRENCY);
  const skipExisting = process.env.R2_DOWNLOAD_SKIP_EXISTING !== 'false';

  await fsp.mkdir(outputDir, { recursive: true });

  const client = new S3Client({
    region: R2_REGION || 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  console.log(`Bucket: ${R2_BUCKET_NAME}`);
  console.log(`Prefix: ${prefix || '(none)'}`);
  console.log(`Output: ${outputDir}`);

  const listed = await listObjects(client, R2_BUCKET_NAME, prefix);
  const objects = listed
    .map((item) => ({
      ...item,
      relPath: toSafeRelativePath(item.key, prefix),
    }))
    .filter((item) => item.relPath);

  if (!objects.length) {
    console.log('No files found for that prefix.');
    return;
  }

  const totalBytes = objects.reduce((sum, obj) => sum + obj.size, 0);
  console.log(`Files: ${objects.length}, Total: ${formatBytes(totalBytes)}`);

  let done = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  let bytesDownloaded = 0;
  let lastName = '';

  function renderProgress() {
    const percent = objects.length ? (done / objects.length) * 100 : 100;
    const line = [
      `Done ${done}/${objects.length} (${percent.toFixed(1)}%)`,
      `Downloaded ${downloaded}`,
      `Skipped ${skipped}`,
      `Failed ${failed}`,
      `${formatBytes(bytesDownloaded)}/${formatBytes(totalBytes)}`,
      lastName ? `Last: ${lastName}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    process.stdout.write(`\r${line.padEnd(140)}`);
  }

  async function downloadOne(item) {
    const destination = path.join(outputDir, item.relPath);
    lastName = item.relPath;

    if (skipExisting) {
      try {
        const stat = await fsp.stat(destination);
        if (stat.isFile() && stat.size === item.size) {
          skipped += 1;
          done += 1;
          renderProgress();
          return;
        }
      } catch {
        // File does not exist; continue.
      }
    }

    const response = await client.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: item.key,
      })
    );

    await writeBodyToFile(response.Body, destination);

    downloaded += 1;
    done += 1;
    bytesDownloaded += item.size;
    renderProgress();
  }

  renderProgress();
  await runPool(
    objects,
    async (item) => {
      try {
        await downloadOne(item);
      } catch (err) {
        failed += 1;
        done += 1;
        renderProgress();
        process.stdout.write('\n');
        console.error(`Failed ${item.relPath}:`, err?.message || err);
      }
    },
    concurrency
  );
  process.stdout.write('\n');

  console.log(
    `Done. Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}, Bytes downloaded: ${formatBytes(bytesDownloaded)}`
  );

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Download failed:', err?.message || err);
  process.exit(1);
});
