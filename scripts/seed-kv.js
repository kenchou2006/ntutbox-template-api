#!/usr/bin/env node

/**
 * Seed KV from data/templates/*.json
 *
 * Usage:
 *   node scripts/seed-kv.js                     # seeds remote (production) KV
 *   node scripts/seed-kv.js --preview            # seeds local/preview KV
 *   node scripts/seed-kv.js --env production     # specific environment
 *
 * Requires: wrangler CLI authenticated (via CLOUDFLARE_API_TOKEN in env)
 */

import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "templates");
const PROJECT_ROOT = join(__dirname, "..");

const extraArgs = [];

if (process.argv.includes("--preview")) {
  extraArgs.push("--preview");
} else {
  extraArgs.push("--preview", "false", "--remote");
}

if (process.argv.includes("--env")) {
  extraArgs.push("--env", process.argv[process.argv.indexOf("--env") + 1]);
}

function wranglerPut(key, value) {
  const args = [
    "wrangler",
    "kv",
    "key",
    "put",
    "--binding",
    "SCHEDULE_TEMPLATES",
    key,
    value,
    ...extraArgs,
  ];
  console.log(`> npx ${args.join(" ").substring(0, 80)}...`);
  execFileSync("npx", args, { stdio: "inherit", cwd: PROJECT_ROOT });
}

// Upload index
const indexData = readFileSync(join(DATA_DIR, "index.json"), "utf-8");
JSON.parse(indexData); // validate
wranglerPut("index", indexData);

// Upload each template
const files = readdirSync(DATA_DIR).filter(
  (f) => f.endsWith(".json") && f !== "index.json"
);

for (const file of files) {
  const id = file.replace(".json", "");
  const data = readFileSync(join(DATA_DIR, file), "utf-8");
  JSON.parse(data); // validate
  wranglerPut(`tmpl:${id}`, data);
}

console.log(`\nSeeded ${files.length} templates + index to KV.`);
