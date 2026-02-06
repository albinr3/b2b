/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const DEFAULT_PREFIX = 'fotos';
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
  const cleaned = prefix.replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/+$/, '');
  return cleaned ? `${cleaned}/` : '';
}

function toPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

async function collectFiles(rootDir) {
  const files = [];
  const stack = [rootDir];

  while (stack.length) {
    const current = stack.pop();
    const entries = await fsp.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        const stat = await fsp.stat(fullPath);
        files.push({
          fullPath,
          relPath: path.relative(rootDir, fullPath),
          size: stat.size,
        });
      }
    }
  }

  return files;
}

async function runPool(items, worker, limit) {
  let index = 0;
  const runners = new Array(limit).fill(0).map(async () => {
    while (true) {
      const i = index++;
      if (i >= items.length) break;
      await worker(items[i], i);
    }
  });
  await Promise.all(runners);
}

async function main() {
  const localDir = process.argv[2];
  const prefixArg = process.argv[3] || DEFAULT_PREFIX;
  const concurrency = Number(process.env.R2_UPLOAD_CONCURRENCY || DEFAULT_CONCURRENCY);

  if (!localDir) {
    console.error('Usage: node scripts/upload-r2.js <localDir> [prefix]');
    process.exit(1);
  }

  const envPath = path.resolve(process.cwd(), '.env');
  loadEnvFromFile(envPath);

  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_REGION,
  } = process.env;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    console.error('Missing R2_* environment variables. Check your .env.');
    process.exit(1);
  }

  const prefix = normalizePrefix(prefixArg);
  const rootDir = path.resolve(localDir);

  if (!fs.existsSync(rootDir)) {
    console.error(`Local folder not found: ${rootDir}`);
    process.exit(1);
  }

  const files = await collectFiles(rootDir);
  const totalFiles = files.length;
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  console.log(`Bucket: ${R2_BUCKET_NAME}`);
  console.log(`Prefix: ${prefix || '(none)'}`);
  console.log(`Files: ${totalFiles}, Total: ${formatBytes(totalBytes)}`);

  const client = new S3Client({
    region: R2_REGION || 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  let processedFiles = 0;
  let processedBytes = 0;
  let uploadedCount = 0;
  let skippedCount = 0;
  let lastName = '';

  function renderProgress() {
    const percent = totalBytes ? (processedBytes / totalBytes) * 100 : 100;
    const line = [
      `Files ${processedFiles}/${totalFiles}`,
      `Uploaded ${uploadedCount}`,
      `Skipped ${skippedCount}`,
      `${formatBytes(processedBytes)}/${formatBytes(totalBytes)} (${percent.toFixed(1)}%)`,
      lastName ? `Last: ${lastName}` : '',
    ]
      .filter(Boolean)
      .join(' | ');
    process.stdout.write(`\r${line.padEnd(120)}`);
  }

  async function uploadOne(file) {
    const key = `${prefix}${toPosix(file.relPath)}`;
    lastName = file.relPath;

    let exists = false;
    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        })
      );
      exists = true;
    } catch (err) {
      const status = err?.$metadata?.httpStatusCode;
      const name = err?.name;
      if (status !== 404 && name !== 'NotFound' && name !== 'NoSuchKey') {
        throw err;
      }
    }

    if (!exists) {
      await client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: fs.createReadStream(file.fullPath),
        })
      );
      uploadedCount += 1;
    } else {
      skippedCount += 1;
    }

    processedFiles += 1;
    processedBytes += file.size;
    renderProgress();
  }

  renderProgress();
  await runPool(files, uploadOne, concurrency);
  process.stdout.write('\n');
  console.log(`Done. Uploaded: ${uploadedCount}, Skipped: ${skippedCount}`);
}

main().catch((err) => {
  console.error('\nUpload failed:', err?.message || err);
  process.exit(1);
});
