import fs from "node:fs/promises";
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

const htmlFiles = (await walk(root)).filter((file) => file.endsWith(".html"));
const report = { pagesChecked: htmlFiles.length, publicHtmlLinks: [], indexHtmlLinks: [], htmlMetadata: [] };

for (const file of htmlFiles) {
  const content = await fs.readFile(file, "utf8");
  const fileRel = rel(file);
  for (const match of content.matchAll(/<(a|meta|link)\b[^>]*(href|content)="([^"]+)"/g)) {
    const value = match[3];
    if (/index\.html(?:$|[?#])/i.test(value)) report.indexHtmlLinks.push(`${fileRel}: ${value}`);
    if (value.includes(".html") && !value.endsWith("404.html")) report.htmlMetadata.push(`${fileRel}: ${value}`);
    if (match[1] === "a" && /\.html(?:$|[?#])/i.test(value)) report.publicHtmlLinks.push(`${fileRel}: ${value}`);
  }
}

console.log(JSON.stringify(report, null, 2));
