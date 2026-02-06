import fs from 'fs';
import path from 'path';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from './s3';

type SkuImageMap = Record<string, string>;
type SkuImageCandidate = {
  rel: string;
  exact: boolean;
  extPriority: number;
};

const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const EXT_PRIORITY: Record<string, number> = {
  '.jpg': 1,
  '.jpeg': 2,
  '.webp': 3,
  '.png': 4,
};
const PLACEHOLDER_IMAGE_URLS = new Set([
  '',
  '/sin-imagen.webp',
  '/logo.svg',
]);

const DEFAULT_PREFIX = 'fotos/';
const DEFAULT_TTL_MINUTES = 60;

let cachedMap: SkuImageMap | null = null;
let lastRefresh = 0;
let refreshPromise: Promise<SkuImageMap> | null = null;

function getPrefix() {
  const raw = process.env.R2_IMAGE_PREFIX || DEFAULT_PREFIX;
  const normalized = raw.replace(/\\/g, '/').replace(/^\/+/, '');
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function loadMapFromFile(): SkuImageMap {
  const mapPath = path.join(process.cwd(), 'data', 'sku-image-map.json');
  try {
    const raw = fs.readFileSync(mapPath, 'utf8');
    return JSON.parse(raw) as SkuImageMap;
  } catch {
    return {};
  }
}

function normalizeSku(sku: string) {
  return sku.trim();
}

function encodePath(value: string) {
  return value
    .replace(/\\/g, '/')
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function canRefreshFromR2() {
  return Boolean(
    process.env.R2_BUCKET_NAME &&
      process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY,
  );
}

function getMapTtlMs() {
  const minutes = Number(
    process.env.R2_IMAGE_MAP_TTL_MINUTES || DEFAULT_TTL_MINUTES,
  );
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return DEFAULT_TTL_MINUTES * 60 * 1000;
  }
  return minutes * 60 * 1000;
}

async function buildMapFromR2(): Promise<SkuImageMap> {
  const bucket = process.env.R2_BUCKET_NAME!;
  const prefix = getPrefix();
  const candidates: Record<string, SkuImageCandidate> = {};

  let continuationToken: string | undefined;
  do {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const entry of response.Contents || []) {
      if (!entry.Key) continue;
      const key = entry.Key;
      const ext = path.posix.extname(key).toLowerCase();
      if (!SUPPORTED_EXTS.has(ext)) continue;

      const rel = key.startsWith(prefix) ? key.slice(prefix.length) : key;
      const base = path.posix.basename(rel, ext);
      const tokens = base.split('_').map((t) => t.trim()).filter(Boolean);

      for (const token of tokens) {
        const sku = token;
        const existing = candidates[sku];
        const isExact = base === sku;
        const candidate: SkuImageCandidate = {
          rel,
          exact: isExact,
          extPriority: EXT_PRIORITY[ext] || 99,
        };

        if (!existing) {
          candidates[sku] = candidate;
          continue;
        }

        if (!existing.exact && candidate.exact) {
          candidates[sku] = candidate;
          continue;
        }
        if (existing.exact && !candidate.exact) {
          continue;
        }

        if (candidate.extPriority < existing.extPriority) {
          candidates[sku] = candidate;
        }
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  const result: SkuImageMap = {};
  for (const [sku, info] of Object.entries(candidates)) {
    result[sku] = info.rel;
  }
  return result;
}

async function loadMap(): Promise<SkuImageMap> {
  const now = Date.now();
  const ttl = getMapTtlMs();

  if (!cachedMap) {
    cachedMap = loadMapFromFile();
  }

  const isStale = now - lastRefresh >= ttl;

  if (!canRefreshFromR2()) {
    if (!lastRefresh) lastRefresh = now;
    return cachedMap;
  }

  if (isStale && !refreshPromise) {
    // Refresh in background so we don't block the first request.
    refreshPromise = (async () => {
      try {
        const fromR2 = await buildMapFromR2();
        cachedMap = fromR2;
      } catch {
        // Keep the last cached map on failure.
      } finally {
        lastRefresh = Date.now();
        refreshPromise = null;
      }
      return cachedMap;
    })();
  }

  return cachedMap;
}

export async function getImageUrlForSku(sku?: string | null) {
  if (!sku) return null;
  const baseUrl =
    process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
  if (!baseUrl) return null;

  const map = await loadMap();
  const directKey = normalizeSku(sku);
  const fallbackKey = directKey.toUpperCase();
  const filename = map[directKey] || map[fallbackKey];

  if (!filename) return null;

  const base = baseUrl.replace(/\/+$/, '');
  const rel = encodePath(filename.replace(/^\/+/, ''));
  return `${base}/${getPrefix()}${rel}`;
}

export async function resolveProductImageUrl(input: {
  sku?: string | null;
  imageUrl?: string | null;
}) {
  const imageUrl = input.imageUrl?.trim() || '';
  if (imageUrl && !PLACEHOLDER_IMAGE_URLS.has(imageUrl)) return imageUrl;
  return (await getImageUrlForSku(input.sku)) || null;
}
