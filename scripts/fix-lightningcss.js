const fs = require("fs");
const path = require("path");

if (process.platform !== "win32") {
  process.exit(0);
}

const fileName = "lightningcss.win32-x64-msvc.node";
const source = path.join(
  __dirname,
  "..",
  "node_modules",
  "lightningcss",
  "node_modules",
  "lightningcss-win32-x64-msvc",
  fileName
);
const dest = path.join(
  __dirname,
  "..",
  "node_modules",
  "lightningcss",
  fileName
);

try {
  if (!fs.existsSync(source)) {
    process.exit(0);
  }
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(source, dest);
  }
} catch {
  // Best-effort; don't fail install for a copy issue.
}
