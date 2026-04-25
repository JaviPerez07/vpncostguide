import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const scripts = [
  "verify-broken-links.mjs",
  "verify-canonicals.mjs",
  "detect-public-html.mjs",
  "detect-host-issues.mjs",
  "verify-local-nav.mjs",
  "search-console-audit.mjs",
  "adsense-readiness.mjs",
];

const missing = [];
for (const script of scripts) {
  try {
    await fs.access(path.join(root, "scripts", script));
  } catch {
    missing.push(script);
  }
}

console.log(JSON.stringify({ scriptsExpected: scripts.length, missing }, null, 2));
