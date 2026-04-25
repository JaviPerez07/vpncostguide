import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

const root = "/Users/javiperezz7/Documents/vpncostguide";
const domain = "https://vpncostguide.com";
const reportFile = path.join(root, "search_console_audit.md");

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

const htmlFiles = (await walk(root)).filter(
  (file) => file.endsWith(".html") && !file.includes("/assets/affiliate/"),
);
const report = {
  pagesScanned: htmlFiles.length,
  canonicalHtml: [],
  canonicalWww: [],
  canonicalHttp: [],
  canonicalQuery: [],
  internalHtml: [],
  internalIndexHtml: [],
  internalWww: [],
  internalHttp: [],
  internalQuery: [],
  brokenLinks: [],
  sitemapHtml: [],
  sitemapWww: [],
  sitemapHttp: [],
  redirectsIssues: [],
  headerIssues: [],
  searchActionIssues: [],
};

for (const file of htmlFiles) {
  const content = await fs.readFile(file, "utf8");
  const fileRel = rel(file);
  const canonical = content.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";

  if (canonical.includes(".html")) report.canonicalHtml.push(`${fileRel}: ${canonical}`);
  if (canonical.includes("www.")) report.canonicalWww.push(`${fileRel}: ${canonical}`);
  if (canonical.startsWith("http://")) report.canonicalHttp.push(`${fileRel}: ${canonical}`);
  if (canonical.includes("?")) report.canonicalQuery.push(`${fileRel}: ${canonical}`);

  for (const match of content.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const value = match[1];
    if (/index\.html(?:$|[?#])/i.test(value)) report.internalIndexHtml.push(`${fileRel}: ${value}`);
    if (/\.html(?:$|[?#])/i.test(value)) report.internalHtml.push(`${fileRel}: ${value}`);
    if (value.includes("www.vpncostguide.com")) report.internalWww.push(`${fileRel}: ${value}`);
    if (value.startsWith("http://")) report.internalHttp.push(`${fileRel}: ${value}`);
    if (value.includes("?q=")) report.internalQuery.push(`${fileRel}: ${value}`);
    if (!/^(https?:|mailto:|tel:|#|data:)/i.test(value)) {
      if (!resolveCandidates(file, value).some((candidate) => fsSync.existsSync(candidate))) {
        report.brokenLinks.push(`${fileRel}: ${value}`);
      }
    }
  }
}

const sitemap = await fs.readFile(path.join(root, "sitemap.xml"), "utf8");
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const url = match[1];
  if (url.includes(".html")) report.sitemapHtml.push(url);
  if (url.includes("www.")) report.sitemapWww.push(url);
  if (url.startsWith("http://")) report.sitemapHttp.push(url);
}

const redirects = await fs.readFile(path.join(root, "_redirects"), "utf8");
const headers = await fs.readFile(path.join(root, "_headers"), "utf8");
const mainJs = await fs.readFile(path.join(root, "assets/main.js"), "utf8");

if (!redirects.includes("http://vpncostguide.com/* https://vpncostguide.com/:splat 301")) report.redirectsIssues.push("Missing http non-www redirect.");
if (!redirects.includes("http://www.vpncostguide.com/* https://vpncostguide.com/:splat 301")) report.redirectsIssues.push("Missing http www redirect.");
if (!redirects.includes("https://www.vpncostguide.com/* https://vpncostguide.com/:splat 301")) report.redirectsIssues.push("Missing https www redirect.");
if (!redirects.includes("/index.html / 301")) report.redirectsIssues.push("Missing /index.html root redirect.");
if (!headers.includes("/*.html") || !headers.includes("X-Robots-Tag: noindex")) report.headerIssues.push("Missing HTML noindex header protection.");
if (mainJs.includes("SearchAction") || mainJs.includes("?q={search_term_string}")) report.searchActionIssues.push("SearchAction or indexable search schema detected.");

const totalIssues =
  report.canonicalHtml.length +
  report.canonicalWww.length +
  report.canonicalHttp.length +
  report.canonicalQuery.length +
  report.internalHtml.length +
  report.internalIndexHtml.length +
  report.internalWww.length +
  report.internalHttp.length +
  report.internalQuery.length +
  report.brokenLinks.length +
  report.sitemapHtml.length +
  report.sitemapWww.length +
  report.sitemapHttp.length +
  report.redirectsIssues.length +
  report.headerIssues.length +
  report.searchActionIssues.length;

const markdown = `# Search Console Audit

- Pages scanned: ${report.pagesScanned}
- Canonicals with .html: ${report.canonicalHtml.length}
- Canonicals with www: ${report.canonicalWww.length}
- Canonicals with http: ${report.canonicalHttp.length}
- Canonicals with query strings: ${report.canonicalQuery.length}
- Internal links with .html: ${report.internalHtml.length}
- Internal links to index.html: ${report.internalIndexHtml.length}
- Internal links with www: ${report.internalWww.length}
- Internal links with http: ${report.internalHttp.length}
- Internal links with ?q=: ${report.internalQuery.length}
- Broken links: ${report.brokenLinks.length}
- Sitemap URLs with .html: ${report.sitemapHtml.length}
- Sitemap URLs with www: ${report.sitemapWww.length}
- Sitemap URLs with http: ${report.sitemapHttp.length}
- Redirect rule issues: ${report.redirectsIssues.length}
- Header rule issues: ${report.headerIssues.length}
- SearchAction issues: ${report.searchActionIssues.length}

## Verdict

- ${totalIssues === 0 ? "PASS: the site is aligned with the clean canonical and indexing rules requested for Search Console." : "FAIL: issues detected and listed below."}

## Findings

${totalIssues === 0 ? "- None." : [
  ...report.canonicalHtml,
  ...report.canonicalWww,
  ...report.canonicalHttp,
  ...report.canonicalQuery,
  ...report.internalHtml,
  ...report.internalIndexHtml,
  ...report.internalWww,
  ...report.internalHttp,
  ...report.internalQuery,
  ...report.brokenLinks,
  ...report.sitemapHtml,
  ...report.sitemapWww,
  ...report.sitemapHttp,
  ...report.redirectsIssues,
  ...report.headerIssues,
  ...report.searchActionIssues,
].map((item) => `- ${item}`).join("\n")}
`;

await fs.writeFile(reportFile, markdown);
console.log(JSON.stringify({ totalIssues, reportFile }, null, 2));
