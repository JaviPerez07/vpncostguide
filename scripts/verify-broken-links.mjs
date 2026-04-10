import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

const root = "/Users/javiperezz7/Documents/vpncostguide";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files.sort();
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function resolveCandidates(file, ref) {
  const clean = ref.split("#")[0].split("?")[0];
  if (!clean) return [];
  const absolute = path.resolve(path.dirname(file), clean);
  if (path.extname(absolute)) return [absolute];
  return [path.join(absolute, "index.html"), `${absolute}.html`, absolute];
}

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const issues = [];

for (const file of htmlFiles) {
  const content = await fs.readFile(file, "utf8");
  for (const match of content.matchAll(/<(a|link|script|img)\b[^>]*(href|src)="([^"]+)"/g)) {
    const tag = match[1];
    const value = match[3];
    const markup = match[0];
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(value)) continue;
    if (tag === "link" && !/rel="stylesheet"|rel="icon"|rel="manifest"/.test(markup)) continue;
    const candidates = resolveCandidates(file, value);
    if (!candidates.some((candidate) => fsSync.existsSync(candidate))) {
      issues.push(`${rel(file)} -> ${value}`);
    }
  }
}

console.log(JSON.stringify({ pagesChecked: htmlFiles.length, brokenLinks: issues }, null, 2));
