import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

const root = "/Users/javiperezz7/Documents/vpncostguide";
const reportPath = path.join(root, "local-preview-report.md");

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

const htmlFiles = (await walk(root)).filter((file) => file.endsWith(".html"));
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const report = {
  pagesChecked: htmlFiles.length,
  duplicateTitles: [],
  duplicateDescriptions: [],
  duplicateCanonicals: [],
  brokenLinks: [],
  missingHeader: [],
  missingFooter: [],
  missingAuthorBox: [],
  missingFaq: [],
};

for (const file of htmlFiles) {
  const content = await fs.readFile(file, "utf8");
  const fileRel = rel(file);
  const isTechnical404 = fileRel === "404.html" || fileRel === "404/index.html";
  const title = content.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
  const description = content.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
  const canonical = content.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";

  if (!isTechnical404 && titles.has(title)) report.duplicateTitles.push(`${titles.get(title)} and ${fileRel}: ${title}`);
  else if (!isTechnical404) titles.set(title, fileRel);

  if (!isTechnical404 && descriptions.has(description)) report.duplicateDescriptions.push(`${descriptions.get(description)} and ${fileRel}: ${description}`);
  else if (!isTechnical404) descriptions.set(description, fileRel);

  if (!isTechnical404 && canonicals.has(canonical)) report.duplicateCanonicals.push(`${canonicals.get(canonical)} and ${fileRel}: ${canonical}`);
  else if (!isTechnical404) canonicals.set(canonical, fileRel);

  if (!content.includes("<header class=\"site-header\">")) report.missingHeader.push(fileRel);
  if (!content.includes("<footer class=\"site-footer\">")) report.missingFooter.push(fileRel);
  if (content.includes("data-page-type=\"article\"") || content.includes("data-page-type=\"review\"") || content.includes("data-page-type=\"tool\"")) {
    if (!content.includes("class=\"author-box")) report.missingAuthorBox.push(fileRel);
    if (!content.includes("class=\"faq-section")) report.missingFaq.push(fileRel);
  }

  for (const match of content.matchAll(/<(a|link|script|img)\b[^>]*(href|src)="([^"]+)"/g)) {
    const value = match[3];
    const markup = match[0];
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(value)) continue;
    if (match[1] === "link" && !/rel="stylesheet"|rel="icon"|rel="manifest"/.test(markup)) continue;
    if (!resolveCandidates(file, value).some((candidate) => fsSync.existsSync(candidate))) {
      report.brokenLinks.push(`${fileRel}: ${value}`);
    }
  }
}

const totalIssues =
  report.duplicateTitles.length +
  report.duplicateDescriptions.length +
  report.duplicateCanonicals.length +
  report.brokenLinks.length +
  report.missingHeader.length +
  report.missingFooter.length +
  report.missingAuthorBox.length +
  report.missingFaq.length;

const markdown = `# Local Preview Report

- Pages checked: ${report.pagesChecked}
- Duplicate titles: ${report.duplicateTitles.length}
- Duplicate descriptions: ${report.duplicateDescriptions.length}
- Duplicate canonicals: ${report.duplicateCanonicals.length}
- Broken local links: ${report.brokenLinks.length}
- Missing headers: ${report.missingHeader.length}
- Missing footers: ${report.missingFooter.length}
- Missing author boxes on content pages: ${report.missingAuthorBox.length}
- Missing FAQ sections on content pages: ${report.missingFaq.length}

## Result

- ${totalIssues === 0 ? "PASS: local navigation and core page structure look clean." : "FAIL: issues detected and listed below."}

## Findings

${totalIssues === 0 ? "- None." : [
  ...report.duplicateTitles,
  ...report.duplicateDescriptions,
  ...report.duplicateCanonicals,
  ...report.brokenLinks,
  ...report.missingHeader,
  ...report.missingFooter,
  ...report.missingAuthorBox,
  ...report.missingFaq,
].map((item) => `- ${item}`).join("\n")}
`;

await fs.writeFile(reportPath, markdown);
console.log(JSON.stringify({ totalIssues, reportPath }, null, 2));
