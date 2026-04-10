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

const scanFiles = (await walk(root)).filter((file) => /\.(html|xml|txt|md|js|json)$/.test(file));
const report = { filesChecked: scanFiles.length, httpRefs: [], wwwRefs: [] };

for (const file of scanFiles) {
  const text = await fs.readFile(file, "utf8");
  if (/http:\/\/vpncostguide\.com|http:\/\/www\.vpncostguide\.com/.test(text)) report.httpRefs.push(rel(file));
  if (/www\.vpncostguide\.com/.test(text)) report.wwwRefs.push(rel(file));
}

console.log(JSON.stringify(report, null, 2));
