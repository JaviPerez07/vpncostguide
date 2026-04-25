import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const reportFile = path.join(root, "adsense_readiness.md");
const requiredPages = [
  "about/index.html",
  "contact/index.html",
  "privacy-policy/index.html",
  "terms/index.html",
  "disclaimer/index.html",
  "editorial-policy/index.html",
  "how-we-research/index.html",
  "cookie-policy/index.html",
];

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

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith(".html"));
const report = {
  pagesScanned: htmlFiles.length,
  missingPolicyPages: [],
  missingAdsenseScript: [],
  placeholders: [],
  missingCookieBanner: [],
  missingAuthorSignals: [],
  missingFooter: [],
  thinContent: [],
};

for (const required of requiredPages) {
  try {
    await fs.access(path.join(root, required));
  } catch {
    report.missingPolicyPages.push(required);
  }
}

for (const file of htmlFiles) {
  const content = await fs.readFile(file, "utf8");
  const fileRel = rel(file);
  const text = stripTags(content);
  const words = text ? text.split(/\s+/).length : 0;
  if (!content.includes("ca-pub-3733223915347669")) report.missingAdsenseScript.push(fileRel);
  if (/ADVERTISEMENT|Lorem ipsum|TODO|ad-slot placeholder|placeholder slot|class="ad-placeholder"/i.test(content)) report.placeholders.push(fileRel);
  if (!content.includes("data-cookie-banner")) report.missingCookieBanner.push(fileRel);
  if ((content.includes("data-page-type=\"article\"") || content.includes("data-page-type=\"review\"") || content.includes("data-page-type=\"tool\"")) && !content.includes("class=\"author-box")) {
    report.missingAuthorSignals.push(fileRel);
  }
  if (!content.includes("class=\"site-footer\"")) report.missingFooter.push(fileRel);
  if ((content.includes("data-page-type=\"article\"") || content.includes("data-page-type=\"review\"") || content.includes("data-page-type=\"tool\"")) && words < 850) {
    report.thinContent.push(`${fileRel}: ${words} words`);
  }
}

const totalIssues =
  report.missingPolicyPages.length +
  report.missingAdsenseScript.length +
  report.placeholders.length +
  report.missingCookieBanner.length +
  report.missingAuthorSignals.length +
  report.missingFooter.length +
  report.thinContent.length;

const markdown = `# AdSense Readiness

- Pages scanned: ${report.pagesScanned}
- Missing policy pages: ${report.missingPolicyPages.length}
- Missing AdSense script: ${report.missingAdsenseScript.length}
- Placeholder content detected: ${report.placeholders.length}
- Missing cookie banners: ${report.missingCookieBanner.length}
- Missing author signals on content pages: ${report.missingAuthorSignals.length}
- Missing footers: ${report.missingFooter.length}
- Thin content pages under 850 words: ${report.thinContent.length}

## Verdict

- ${totalIssues === 0 ? "PASS: the site clears the main structural readiness checks for an AdSense submission workflow." : "FAIL: issues detected and listed below."}

## Findings

${totalIssues === 0 ? "- None." : [
  ...report.missingPolicyPages,
  ...report.missingAdsenseScript,
  ...report.placeholders,
  ...report.missingCookieBanner,
  ...report.missingAuthorSignals,
  ...report.missingFooter,
  ...report.thinContent,
].map((item) => `- ${item}`).join("\n")}
`;

await fs.writeFile(reportFile, markdown);
console.log(JSON.stringify({ totalIssues, reportFile }, null, 2));
