#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const match = rawLine.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2] ?? "";

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function runPrismaMigration(mode) {
  const dotEnvPath = path.resolve(process.cwd(), ".env");
  loadDotEnv(dotEnvPath);

  const prodDatabaseUrl = process.env.PROD_DATABASE_URL;
  const prodDirectUrl = process.env.PROD_DIRECT_URL;

  if (!prodDatabaseUrl || !prodDirectUrl) {
    console.error(
      "Missing PROD_DATABASE_URL or PROD_DIRECT_URL in environment/.env."
    );
    process.exit(1);
  }

  const env = {
    ...process.env,
    DATABASE_URL: normalizeDatabaseUrl(prodDatabaseUrl, true),
    DIRECT_URL: normalizeDatabaseUrl(prodDirectUrl, false),
  };

  const prismaCliPath = require.resolve("prisma/build/index.js");
  const command = [prismaCliPath, "migrate", mode];

  console.log(`Running: node ${command.join(" ")} with PROD_* URLs`);
  const result = spawnSync(process.execPath, command, {
    stdio: "inherit",
    env,
    cwd: process.cwd(),
  });

  if (result.error) {
    console.error("Failed to launch Prisma CLI:", result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

function normalizeDatabaseUrl(rawUrl, isPooler) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (error) {
    console.error(`Invalid database URL: ${rawUrl}`);
    process.exit(1);
  }

  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }

  if (isPooler && !parsed.searchParams.has("pgbouncer")) {
    parsed.searchParams.set("pgbouncer", "true");
  }

  return parsed.toString();
}

const mode = process.argv[2] ?? "deploy";
if (mode !== "deploy" && mode !== "status") {
  console.error('Usage: node scripts/migrate-prod-supabase.js [deploy|status]');
  process.exit(1);
}

runPrismaMigration(mode);
