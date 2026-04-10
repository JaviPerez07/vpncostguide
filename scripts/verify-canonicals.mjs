import fs from "node:fs/promises";
import path from "node:path";

const root = "/Users/javiperezz7/Documents/vpncostguide";
const domain = "https://vpncostguide.com";

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
const report = {
  pagesChecked: htmlFiles.length,
  missing: [],
  invalidDomain: [],
  htmlCanonicals: [],
  httpCanonicals: [],
  wwwCanonicals: [],
  queryCanonicals: [],
  duplicates: [],
};
const seen = new Map();

for (const file of htmlFiles) {
  const content = await fs.readFile(file, "utf8");
  const canonical = content.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  const fileRel = rel(file);
  const isTechnical404 = fileRel === "404.html" || fileRel === "404/index.html";
  if (!canonical) report.missing.push(fileRel);
  if (canonical && !canonical.startsWith(domain)) report.invalidDomain.push(`${fileRel}: ${canonical}`);
  if (canonical.includes(".html")) report.htmlCanonicals.push(`${fileRel}: ${canonical}`);
  if (canonical.startsWith("http://")) report.httpCanonicals.push(`${fileRel}: ${canonical}`);
  if (canonical.includes("www.")) report.wwwCanonicals.push(`${fileRel}: ${canonical}`);
  if (canonical.includes("?")) report.queryCanonicals.push(`${fileRel}: ${canonical}`);
  if (canonical) {
    if (!isTechnical404 && seen.has(canonical)) report.duplicates.push(`${seen.get(canonical)} and ${fileRel}: ${canonical}`);
    else if (!isTechnical404) seen.set(canonical, fileRel);
  }
}

console.log(JSON.stringify(report, null, 2));
