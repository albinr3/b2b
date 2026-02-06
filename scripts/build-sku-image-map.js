/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const SUPPORTED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const EXT_PRIORITY = {
  '.jpg': 1,
  '.jpeg': 2,
  '.webp': 3,
  '.png': 4,
};

async function walk(dir, files = []) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function main() {
  const imagesDir = process.argv[2];
  const outPath =
    process.argv[3] ||
    path.join(process.cwd(), 'data', 'sku-image-map.json');

  if (!imagesDir) {
    console.log('Usage: node scripts/build-sku-image-map.js <imagesDir> [outPath]');
    process.exit(1);
  }

  const baseDir = path.resolve(imagesDir);
  if (!fs.existsSync(baseDir)) {
    console.error(`Folder not found: ${baseDir}`);
    process.exit(1);
  }

  const allFiles = await walk(baseDir);
  const map = {};
  const conflicts = [];

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (!SUPPORTED_EXTS.has(ext)) continue;

    const rel = toPosix(path.relative(baseDir, file));
    const base = path.basename(file, ext);
    const tokens = base.split('_').map((t) => t.trim()).filter(Boolean);

    for (const token of tokens) {
      const sku = token;
      const existing = map[sku];
      const isExact = base === sku;
      const candidate = {
        rel,
        exact: isExact,
        extPriority: EXT_PRIORITY[ext] || 99,
      };

      if (!existing) {
        map[sku] = candidate;
        continue;
      }

      if (existing.rel !== rel) {
        conflicts.push({ sku, existing: existing.rel, rel });
      }

      // Prefer exact filename match (SKU.ext) over combined filenames
      if (!existing.exact && candidate.exact) {
        map[sku] = candidate;
        continue;
      }
      if (existing.exact && !candidate.exact) {
        continue;
      }

      // If both are same exactness, prefer extension priority
      if (candidate.extPriority < existing.extPriority) {
        map[sku] = candidate;
      }
    }
  }

  const sorted = Object.keys(map)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = map[key].rel;
      return acc;
    }, {});

  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, JSON.stringify(sorted, null, 2), 'utf8');

  console.log(`Mapped SKUs: ${Object.keys(sorted).length}`);
  console.log(`Output: ${outPath}`);
  if (conflicts.length) {
    console.log(`Conflicts: ${conflicts.length}`);
    console.log('First 10 conflicts:');
    conflicts.slice(0, 10).forEach((c) => {
      console.log(`- ${c.sku}: ${c.existing} <> ${c.rel}`);
    });
  }
}

main().catch((err) => {
  console.error('Failed:', err?.message || err);
  process.exit(1);
});
