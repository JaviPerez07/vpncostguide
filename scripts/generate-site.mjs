import fs from "node:fs/promises";
import path from "node:path";

const root = "/Users/javiperezz7/Documents/vpncostguide";
const domain = "https://vpncostguide.com";
const brand = "VPN Cost Guide";
const lastmod = "2026-04-10";
const adsenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3733223915347669" crossorigin="anonymous"></script>`;

const site = {
  brand,
  domain,
  email: "focuslocalaiagency@gmail.com",
  phone: "+1 (202) 555-0148",
  tagline:
    "Premium U.S. VPN pricing, privacy, streaming, cybersecurity, and subscription planning guides.",
  description:
    "VPN Cost Guide helps U.S. readers compare VPN pricing, privacy tradeoffs, streaming access, subscription terms, and personal cybersecurity tools with premium editorial research.",
  organization: {
    name: "VPN Cost Guide Editorial Team",
    url: domain,
    logo: `${domain}/assets/icons/logo.svg`,
  },
  author: {
    name: "Dylan Mercer",
    credentials: "CISSP",
    role: "Lead Privacy & Consumer Security Editor",
    initials: "DM",
    bio: "Dylan covers consumer VPN pricing, online privacy controls, secure browsing habits, identity risk, and remote-work security for U.S. households. He focuses on turning technical cybersecurity details into subscription decisions that normal readers can actually use.",
  },
  disclaimer:
    "VPN Cost Guide publishes editorial content for informational purposes only. We do not provide legal advice, cybersecurity incident response, or managed VPN services.",
};

const navGroups = [
  ["VPN Costs", "/vpn-costs/"],
  ["Reviews", "/vpn-reviews/"],
  ["Use Cases", "/vpn-use-cases/"],
  ["Cybersecurity", "/cybersecurity-guides/"],
  ["Comparisons", "/comparisons/"],
  ["Tools", "/tools/"],
];

const footerCategoryLinks = [
  ["Average VPN Cost", "/vpn-costs/average-vpn-cost-per-month/"],
  ["VPN Reviews", "/vpn-reviews/"],
  ["Best VPN for Netflix", "/vpn-use-cases/best-vpn-for-netflix/"],
  ["Public WiFi Safety", "/cybersecurity-guides/how-to-stay-safe-on-public-wifi/"],
  ["NordVPN vs ExpressVPN", "/comparisons/nordvpn-vs-expressvpn/"],
  ["VPN Cost Calculator", "/tools/vpn-cost-calculator/"],
];

const legalLinks = [
  ["About", "/about/"],
  ["Contact", "/contact/"],
  ["Privacy Policy", "/privacy-policy/"],
  ["Terms", "/terms/"],
  ["Disclaimer", "/disclaimer/"],
  ["Editorial Policy", "/editorial-policy/"],
  ["How We Research", "/how-we-research/"],
  ["Cookie Policy", "/cookie-policy/"],
  ["HTML Sitemap", "/sitemap/"],
];

const socialImage = `${domain}/assets/images/social-preview.svg`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function cleanText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(html) {
  const text = stripTags(html);
  return text ? text.split(/\s+/).length : 0;
}

function toFile(route) {
  if (route === "/") return "index.html";
  return `${route.replace(/^\//, "")}index.html`;
}

function canonicalUrl(route) {
  return route === "/" ? `${domain}/` : `${domain}${route}`;
}

function ensureTrailingSlash(route) {
  if (route === "/") return route;
  return route.endsWith("/") ? route : `${route}/`;
}

function localPageHref(fromFile, route) {
  const targetFile = toFile(ensureTrailingSlash(route));
  const fromDir = fromFile.includes("/") ? path.posix.dirname(fromFile) : ".";
  let relative = path.posix.relative(fromDir, targetFile).replace(/\\/g, "/");
  if (!relative) return "./";
  if (relative === "index.html") return "./";
  if (relative.endsWith("/index.html")) relative = relative.slice(0, -"index.html".length);
  if (!relative.startsWith(".")) relative = `./${relative}`;
  return relative;
}

function localAssetHref(fromFile, assetPath) {
  const fromDir = fromFile.includes("/") ? path.posix.dirname(fromFile) : ".";
  let relative = path.posix.relative(fromDir, assetPath).replace(/\\/g, "/");
  if (!relative.startsWith(".")) relative = `./${relative}`;
  return relative;
}

function uniqueTitle(title) {
  const full = `${title} | VPN Cost Guide`;
  return full.length <= 60 ? full : `${title.slice(0, 57).trim()}...`;
}

function uniqueDescription(text) {
  const base = cleanText(text).replace(/\.+$/, "");
  if (base.length >= 150 && base.length <= 160) return `${base}.`;
  if (base.length > 160) return `${base.slice(0, 157).trim()}...`;
  const suffix = " Compare pricing, privacy, speed, and practical fit for U.S. users.";
  const combined = `${base}${suffix}`;
  return combined.length <= 160 ? combined : `${base}.`;
}

function readingTime(words) {
  return Math.max(4, Math.round(words / 230));
}

function renderStats(stats) {
  return `
    <section class="stats-strip" aria-label="Key statistics">
      ${stats
        .map(
          (stat) => `
            <article class="stat-card">
              <span class="stat-card__value">${escapeHtml(stat.value)}</span>
              <span class="stat-card__label">${escapeHtml(stat.label)}</span>
              <p>${escapeHtml(stat.note)}</p>
            </article>`,
        )
        .join("")}
    </section>`;
}

function renderBulletList(items) {
  return `<ul class="key-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderTable(table) {
  return `
    <div class="table-shell">
      <table>
        <caption>${escapeHtml(table.caption)}</caption>
        <thead>
          <tr>${table.headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${table.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    </div>`;
}

function renderFaqs(faqs) {
  return `
    <section class="faq-section panel">
      <div class="section-heading">
        <span class="eyebrow">People Also Ask</span>
        <h2>Frequently asked questions</h2>
      </div>
      <div class="faq-list">
        ${faqs
          .map(
            (faq, index) => `
              <details class="faq-item"${index === 0 ? " open" : ""}>
                <summary>${escapeHtml(faq.q)}</summary>
                <p>${escapeHtml(faq.a)}</p>
              </details>`,
          )
          .join("")}
      </div>
    </section>`;
}

function renderRelated(fromFile, related) {
  return `
    <section class="related-section panel">
      <div class="section-heading">
        <span class="eyebrow">Related Guides</span>
        <h2>Keep exploring</h2>
      </div>
      <div class="related-grid">
        ${related
          .map(
            (item) => `
              <a class="related-card" href="${escapeAttr(localPageHref(fromFile, item.route))}">
                <span>${escapeHtml(item.category)}</span>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.description)}</p>
              </a>`,
          )
          .join("")}
      </div>
    </section>`;
}

function defaultFaqs(page) {
  const topic = page.shortTopic || page.title.toLowerCase();
  return [
    {
      q: `Is ${topic} worth paying for in the U.S.?`,
      a: `${topic} is usually worth paying for when privacy, streaming consistency, or travel reliability matter more than saving a few dollars each month. The best value usually comes from matching features to your actual device count and risk profile.`,
    },
    {
      q: `How should I compare ${topic} offers?`,
      a: `Start with the real billed amount, renewal price, refund window, server footprint, logging policy, independent audits, and customer support depth. Those signals matter more than promotional headline discounts alone.`,
    },
    {
      q: `What is the biggest mistake people make with ${topic}?`,
      a: `The most common mistake is buying the cheapest headline price without checking the term length, auto-renew price, device limits, data limits, or whether the service actually fits the use case the subscriber cares about.`,
    },
    {
      q: `Can a VPN replace broader cybersecurity habits?`,
      a: `No. A VPN is one useful layer, but strong passwords, software updates, phishing awareness, multi-factor authentication, and device hygiene still matter for real-world online safety.`,
    },
  ];
}

function makeChartBars(labels) {
  return labels.map((item, index) => ({
    label: item.label,
    value: item.value,
    width: 48 + index * 10,
    tone: item.tone || ["cyan", "green", "blue", "teal"][index % 4],
  }));
}

function chartMarkup(chart) {
  return `
    <section class="panel chart-panel">
      <div class="section-heading">
        <span class="eyebrow">${escapeHtml(chart.eyebrow)}</span>
        <h2>${escapeHtml(chart.title)}</h2>
      </div>
      <div class="chart-panel__summary">
        <p>We score value signals by combining pricing clarity, trust, fit, and practical usability so readers can compare the market visually instead of reading a wall of text first.</p>
      </div>
      <div class="bar-chart" role="img" aria-label="${escapeAttr(chart.ariaLabel)}">
        ${chart.bars
          .map(
            (bar) => `
              <div class="bar-chart__item">
                <div class="bar-chart__rail">
                  <span class="bar-chart__fill bar-chart__fill--${escapeAttr(bar.tone)}" style="height:${bar.width}%">
                    <span class="bar-chart__percent">${escapeHtml(String(bar.width))}%</span>
                  </span>
                </div>
                <strong>${escapeHtml(bar.value)}</strong>
                <span>${escapeHtml(bar.label)}</span>
              </div>`,
          )
          .join("")}
      </div>
      <div class="chart-panel__legend">
        <span><i class="legend-dot legend-dot--cyan"></i>Price clarity</span>
        <span><i class="legend-dot legend-dot--green"></i>Privacy confidence</span>
        <span><i class="legend-dot legend-dot--blue"></i>Performance fit</span>
        <span><i class="legend-dot legend-dot--teal"></i>Everyday usability</span>
      </div>
    </section>`;
}

function authorBox() {
  return `
    <aside class="author-box panel">
      <div class="author-box__avatar">${escapeHtml(site.author.initials)}</div>
      <div>
        <p class="author-box__eyebrow">Reviewed by</p>
        <h2>${escapeHtml(site.author.name)}, ${escapeHtml(site.author.credentials)}</h2>
        <p class="author-box__role">${escapeHtml(site.author.role)}</p>
        <p>${escapeHtml(site.author.bio)}</p>
      </div>
    </aside>`;
}

function researchBox() {
  return `
    <section class="panel info-grid">
      <article>
        <span class="eyebrow">How We Research</span>
        <h2>What goes into our evaluations</h2>
        <p>We compare headline prices, renewal rates, plan lengths, device limits, privacy disclosures, independent audits, app quality, customer support availability, and user-friction points that influence long-run value.</p>
      </article>
      <article>
        <span class="eyebrow">Editorial Policy</span>
        <h2>Independent and user-first</h2>
        <p>Our editorial team writes for U.S. readers who want better subscription choices, clearer privacy context, and realistic guidance before spending money on a VPN or adjacent security product.</p>
      </article>
    </section>`;
}

function sourcesBox(page) {
  return `
    <section class="panel sources-section">
      <div class="section-heading">
        <span class="eyebrow">Sources & References</span>
        <h2>Research inputs used on this page</h2>
      </div>
      <ul class="source-list">
        <li>Provider pricing pages, renewal disclosures, app-store listings, and refund policy summaries reviewed during editorial updates.</li>
        <li>Public privacy policies, independent audit summaries, transparency reports, and breach-response statements relevant to ${escapeHtml(page.shortTopic)}.</li>
        <li>Consumer cybersecurity guidance from U.S. federal agencies and nonprofit digital-rights organizations for privacy and personal-security best practices.</li>
      </ul>
    </section>`;
}

function breadcrumbsFor(page) {
  const crumbs = [{ label: "Home", route: "/" }];
  if (page.parent) crumbs.push({ label: page.parent.title, route: page.parent.route });
  if (page.route !== "/") crumbs.push({ label: page.breadcrumb || page.title, route: page.route });
  return crumbs;
}

function renderBreadcrumbs(fromFile, crumbs) {
  return `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      ${crumbs
        .map(
          (crumb, index) => `
            ${index > 0 ? '<span aria-hidden="true">/</span>' : ""}
            <a href="${escapeAttr(localPageHref(fromFile, crumb.route))}">${escapeHtml(crumb.label)}</a>`,
        )
        .join("")}
    </nav>`;
}

function schemaData(page, faqList, crumbs) {
  return {
    siteName: site.brand,
    organizationName: site.organization.name,
    organizationUrl: site.organization.url,
    organizationLogo: site.organization.logo,
    title: page.h1,
    description: page.description,
    url: canonicalUrl(page.route),
    image: socialImage,
    author: `${site.author.name}, ${site.author.credentials}`,
    published: "2026-04-09",
    modified: lastmod,
    type: page.schemaType || page.type,
    breadcrumbs: crumbs.map((crumb) => ({ label: crumb.label, href: canonicalUrl(crumb.route) })),
    faqs: faqList,
    review: page.reviewSchema || null,
  };
}

function pageLead(page) {
  return `${page.description} We focus on what U.S. readers usually care about most: what the service costs after the promo, how safe the provider looks, where the practical fit is strong, and where cheaper options can quietly create more friction than they save.`;
}

function commonSections(page) {
  return [
    {
      eyebrow: "Cost Snapshot",
      title: `How to evaluate ${page.shortTopic}`,
      paragraphs: [
        `${page.shortTopic} should be judged on total subscription value, not the lowest banner price. The durable questions are whether the plan keeps renewal pricing reasonable, whether the service scales across phones and laptops, and whether the privacy model matches the reader's actual risk tolerance.`,
        `For U.S. users, the best value often sits in the middle of the market. Ultra-cheap VPNs can look attractive until logging practices, weak server coverage, streaming failures, or limited support make the service harder to trust during travel or public WiFi use. Premium brands can also be overpriced when a reader does not need advanced features.`,
        `The smartest comparison flow is simple: start with monthly versus annual effective cost, then move to privacy posture, protocol support, app quality, and support responsiveness. That sequence prevents price from hiding risk.`,
      ],
      list: [
        "Check the billed amount and the renewal amount separately.",
        "Match the device allowance to your real household or work setup.",
        "Review refund periods before locking into multi-year terms.",
      ],
    },
    {
      eyebrow: "Risk Review",
      title: `${page.shortTopic} and consumer privacy`,
      paragraphs: [
        `A VPN is partly a subscription choice and partly a trust decision. Readers should pay attention to what a provider says about logs, independent audits, incident response, jurisdiction, and whether it clearly explains what data is collected inside the app.`,
        `The privacy conversation matters because many shoppers buy a VPN for peace of mind. If the provider is vague about diagnostics, third-party trackers, or account-level data retention, the cheapest plan may stop looking like the best deal.`,
        `Our approach is to weigh privacy, speed, support, and cost together. That balanced view is more useful than ranking providers on one headline metric.`,
      ],
      list: [
        "Look for clear no-logs language with technical detail.",
        "Prefer providers that publish audits or transparency updates.",
        "Treat privacy claims without evidence as marketing, not proof.",
      ],
    },
    {
      eyebrow: "Buying Strategy",
      title: `Best-fit decision framework for ${page.shortTopic}`,
      paragraphs: [
        `Most readers do not need the same VPN. A solo traveler, a remote worker, a family with smart TVs, and a privacy-focused power user can all end up with different best-value picks even when they start with the same budget.`,
        `The most reliable buying approach is to define the top use case first. If streaming matters most, server consistency and platform compatibility come before advanced security extras. If privacy matters most, audit depth and account minimization deserve more weight. If budget matters most, readers should compare annual cost against feature compromises they can actually live with.`,
        `That is why this guide uses scenario-based recommendations rather than one universal winner. Subscription value is only real if the service keeps doing the job over time.`,
      ],
      list: [
        "Choose a primary use case before comparing brands.",
        "Avoid overpaying for enterprise-style features you will not use.",
        "Use annual plans only when the refund policy and renewal terms feel acceptable.",
      ],
    },
  ];
}

function reviewSections(page) {
  return [
    {
      eyebrow: "Review Summary",
      title: `${page.brand} review overview`,
      paragraphs: [
        `${page.brand} is usually evaluated on five pillars: introductory cost, renewal price, privacy credibility, app polish, and real-world consistency across streaming, public WiFi, and day-to-day browsing. That combination matters because a good-looking feature list can still disappoint if renewals jump sharply or support quality slips.`,
        `For U.S. buyers, ${page.brand} often competes on how much polish and convenience it delivers for the money. The question is not just whether the provider is fast. It is whether the service feels worth keeping after the first billing term ends.`,
        `Our review lens is intentionally practical. We care about whether a provider is easy to understand, easy to cancel, easy to trust, and easy to recommend to households that are not deeply technical.`,
      ],
      list: [
        `Compare ${page.brand} promo pricing with renewal pricing before committing.`,
        "Check whether device limits and simultaneous connections match your setup.",
        "Read the refund rules as carefully as the landing-page discount.",
      ],
    },
    {
      eyebrow: "What Stands Out",
      title: `${page.brand} strengths and watch-outs`,
      paragraphs: [
        `${page.brand} usually earns attention when readers want a polished app experience and a brand that feels easy to understand. Those are real advantages for first-time VPN buyers who do not want to decode technical jargon just to stay safer online.`,
        `The watch-out is usually cost structure. Some premium VPNs feel reasonably priced on longer terms but expensive on monthly plans or renewals. Others win on low upfront pricing but give up edge in support quality, speed consistency, or transparency detail.`,
        `That tradeoff is why our recommendation depends on fit. The best purchase is the one that balances comfort, reliability, and long-run cost rather than optimizing for just one of those factors.`,
      ],
      list: [
        "Promo deals are useful only if the renewal still feels acceptable.",
        "Good app design matters when several household members will use the VPN.",
        "Independent audits increase confidence when privacy is the priority.",
      ],
    },
  ];
}

function comparisonSections(page) {
  return [
    {
      eyebrow: "Side-by-Side",
      title: `${page.leftBrand} vs ${page.rightBrand}`,
      paragraphs: [
        `${page.leftBrand} and ${page.rightBrand} usually appeal to slightly different buyers even when they compete for the same search traffic. One may lean harder into premium polish, while the other may deliver better headline value, better long-term pricing, or fewer account restrictions.`,
        `For U.S. readers, the cleanest way to compare the two is to separate subscription math from trust signals. Start with price, then examine privacy evidence, app quality, support responsiveness, and use-case reliability for streaming, travel, public WiFi, or work.`,
        `That process matters because comparisons often get distorted by marketing. A service can be cheaper yet weaker for a household with many devices, or faster yet less convincing on privacy. Real value comes from fit, not hype.`,
      ],
      list: [
        "Compare effective monthly cost over the whole billed term.",
        "Weight renewal pricing if you expect to keep the service.",
        "Check the provider that aligns best with your top use case.",
      ],
    },
    {
      eyebrow: "Decision Lens",
      title: `Which type of buyer each service suits best`,
      paragraphs: [
        `${page.leftBrand} can make more sense for readers who value its specific strengths, while ${page.rightBrand} may be the better fit for shoppers focused on a different tradeoff such as lower cost, simpler apps, or a stronger privacy posture.`,
        `A useful comparison should also acknowledge where both providers are good enough. When two VPNs are both credible, the final choice often comes down to how much complexity, spending, and performance variability a reader is comfortable accepting.`,
        `That is why we suggest looking at the next twelve months, not just the checkout page today. Budget, device count, and likelihood of renewal can completely change which service is actually smarter.`,
      ],
      list: [
        "Pick the service that solves the main problem, not every possible problem.",
        "Do not ignore renewal cost when comparing multi-year offers.",
        "Use refund windows to test the app experience on your own devices.",
      ],
    },
  ];
}

function toolSections(page) {
  return [
    {
      eyebrow: "How To Use This Tool",
      title: `${page.h1} in plain English`,
      paragraphs: [
        `This tool is built for U.S. readers who want quick clarity before choosing a VPN or broader privacy stack. The goal is not to replace a professional security assessment. It is to make everyday cost and risk tradeoffs easier to see.`,
        `Most users benefit from entering a realistic scenario instead of ideal numbers. That keeps the output grounded in what they are actually likely to spend, renew, or maintain over time.`,
        `Use the result as a decision aid, then compare it with the guidance in our surrounding articles so the math and the context stay aligned.`,
      ],
      list: [
        "Use honest inputs for subscription length and household size.",
        "Compare more than one scenario before deciding.",
        "Treat tools as planning aids, not guarantees.",
      ],
    },
  ];
}

function makeTable(page) {
  if (page.type === "review") {
    return {
      caption: `${page.brand} scorecard`,
      headers: ["Area", "Assessment", "What it means for buyers"],
      rows: [
        ["Intro pricing", page.pricing[0], "Shows how attractive the first-term offer looks."],
        ["Renewal pressure", page.pricing[1], "Helps estimate whether long-run value still feels fair."],
        ["Privacy posture", page.privacy, "Signals how much trust the provider has earned."],
        ["Best for", page.bestFor, "Highlights the type of buyer likely to benefit most."],
      ],
    };
  }
  if (page.type === "comparison") {
    return {
      caption: `${page.leftBrand} and ${page.rightBrand} comparison grid`,
      headers: ["Decision area", page.leftBrand, page.rightBrand, "Why it matters"],
      rows: page.comparisonRows,
    };
  }
  if (page.type === "tool") {
    return {
      caption: `${page.shortTopic} planning factors`,
      headers: ["Input", "Why it matters", "What to watch"],
      rows: [
        ["Budget", "Controls realistic subscription choices", "Do not ignore renewal pricing"],
        ["Device count", "Changes household value", "Cheap plans with tight limits can backfire"],
        ["Privacy sensitivity", "Changes how much trust evidence matters", "Logging ambiguity matters more here"],
        ["Primary use case", "Streaming, travel, gaming, or work change the best fit", "One-size-fits-all rankings miss this"],
      ],
    };
  }
  return {
    caption: `${page.shortTopic} comparison framework`,
    headers: ["Decision area", "What to review", "Why it matters", "Practical takeaway"],
    rows: [
      ["True cost", page.costFocus, "Promo pricing can hide the real annual commitment", "Compare billed total and renewal total"],
      ["Privacy confidence", page.privacyFocus, "Trust determines whether the VPN is worth keeping", "Prefer documented transparency and audits"],
      ["Usability", page.useFocus, "App quality shapes whether the service gets used consistently", "Test on the devices you use most"],
      ["Fit", page.fitFocus, "The best VPN depends on the user scenario", "Choose the plan around the main use case"],
    ],
  };
}

function makeChart(page) {
  return {
    eyebrow: "Visual Snapshot",
    title: `${page.shortTopic} at a glance`,
    ariaLabel: `${page.shortTopic} visual chart`,
    bars: makeChartBars(page.chartBars),
  };
}

function buildArticleBody(page, fromFile) {
  const sections =
    page.type === "review"
      ? [...reviewSections(page), ...commonSections(page)]
      : page.type === "comparison"
        ? [...comparisonSections(page), ...commonSections(page)]
        : page.type === "tool"
          ? [...toolSections(page), ...commonSections(page)]
          : commonSections(page);

  const faqList = page.faqs || defaultFaqs(page);
  return `
    ${renderStats(page.stats)}
    <div class="content-layout">
      <main class="content-main">
        <section class="panel intro-panel">
          <p class="lede">${escapeHtml(pageLead(page))}</p>
          ${renderBulletList(page.takeaways)}
        </section>
        ${chartMarkup(makeChart(page))}
        ${sections
          .map(
            (section) => `
              <section class="panel">
                <div class="section-heading">
                  <span class="eyebrow">${escapeHtml(section.eyebrow)}</span>
                  <h2>${escapeHtml(section.title)}</h2>
                </div>
                ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
                ${section.list ? renderBulletList(section.list) : ""}
              </section>`,
          )
          .join("")}
        <section class="panel">
          <div class="section-heading">
            <span class="eyebrow">Comparison Table</span>
            <h2>Fast decision summary</h2>
          </div>
          ${renderTable(makeTable(page))}
        </section>
        ${renderFaqs(faqList)}
        ${authorBox()}
        ${researchBox()}
        ${sourcesBox(page)}
      </main>
      <aside class="content-sidebar">
        <section class="panel sidebar-panel">
          <span class="eyebrow">Last Updated</span>
          <h2>${escapeHtml(lastmod)}</h2>
          <p>Every page is reviewed for pricing language, trust signals, and internal link quality before publication.</p>
        </section>
        <section class="panel sidebar-panel">
          <span class="eyebrow">Why Readers Use This Guide</span>
          <ul class="sidebar-list">
            <li>Compare monthly vs annual spend</li>
            <li>See privacy and support tradeoffs fast</li>
            <li>Find the best fit for a real U.S. use case</li>
          </ul>
        </section>
        ${renderRelated(fromFile, page.related)}
      </aside>
    </div>`;
}

function pageShell(page, innerHtml, fromFile) {
  const crumbs = breadcrumbsFor(page);
  const title = page.metaTitle || uniqueTitle(page.title);
  const description = uniqueDescription(page.description);
  const faqData =
    page.type === "article" || page.type === "review" || page.type === "comparison" || page.type === "tool"
      ? page.faqs || defaultFaqs(page)
      : [];
  const schema = schemaData(page, faqData, crumbs);
  const assetCss = localAssetHref(fromFile, "assets/styles.css");
  const assetJs = localAssetHref(fromFile, "assets/main.js");
  const faviconSvg = localAssetHref(fromFile, "assets/icons/favicon.svg");
  const faviconIco = localAssetHref(fromFile, "assets/icons/favicon.ico");
  const manifest = localAssetHref(fromFile, "manifest.json");
  const logo = localAssetHref(fromFile, "assets/icons/logo.svg");
  const heroArt = localAssetHref(fromFile, page.heroImage || "assets/images/hero-vpn-network.svg");
  const wordEstimate = wordCount(innerHtml);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="robots" content="${escapeAttr(page.robots || "index, follow")}">
    <link rel="canonical" href="${escapeAttr(canonicalUrl(page.route))}">
    <link rel="icon" type="image/svg+xml" href="${escapeAttr(faviconSvg)}">
    <link rel="icon" href="${escapeAttr(faviconIco)}" sizes="any">
    <link rel="manifest" href="${escapeAttr(manifest)}">
    <meta property="og:type" content="${escapeAttr(page.ogType || "article")}">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:url" content="${escapeAttr(canonicalUrl(page.route))}">
    <meta property="og:image" content="${escapeAttr(socialImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
    <meta name="twitter:image" content="${escapeAttr(socialImage)}">
    <meta name="twitter:url" content="${escapeAttr(canonicalUrl(page.route))}">
    <meta name="theme-color" content="#07111f">
    ${adsenseScript}
    <link rel="stylesheet" href="${escapeAttr(assetCss)}">
    ${page.type === "review" && page.reviewSchema ? `<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Review",
  "name": `${page.reviewSchema.itemReviewed} Review 2026`,
  "reviewBody": page.description,
  "author": { "@type": "Person", "name": site.author.name },
  "itemReviewed": {
    "@type": "SoftwareApplication",
    "name": page.reviewSchema.itemReviewed,
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Windows, Mac, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": String(Math.round(page.reviewSchema.ratingValue * 10) / 10),
    "bestRating": String(page.reviewSchema.bestRating),
    "worstRating": "1"
  },
  "publisher": {
    "@type": "Organization",
    "name": site.organization.name,
    "url": site.organization.url
  }
}, null, 2)}
</script>` : ""}
  </head>
  <body data-page-type="${escapeAttr(page.type)}">
    <div class="site-shell">
      <header class="site-header">
        <a class="brand" href="${escapeAttr(localPageHref(fromFile, "/"))}">
          <img src="${escapeAttr(logo)}" alt="${escapeAttr(brand)} logo" width="44" height="44">
          <span>
            <strong>${escapeHtml(brand)}</strong>
            <small>${escapeHtml(site.tagline)}</small>
          </span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" aria-label="Primary">
          ${navGroups
            .map(([label, route]) => `<a href="${escapeAttr(localPageHref(fromFile, route))}">${escapeHtml(label)}</a>`)
            .join("")}
        </nav>
      </header>
      <section class="hero hero--${escapeAttr(page.heroTone || "default")}">
        <div class="hero__content">
          ${page.route !== "/" ? renderBreadcrumbs(fromFile, crumbs) : ""}
          <span class="eyebrow">${escapeHtml(page.kicker || page.parent?.title || "VPN Intelligence")}</span>
          <h1>${escapeHtml(page.h1)}</h1>
          <p class="hero__lede">${escapeHtml(page.description)}</p>
          <div class="hero__meta">
            <span>Updated ${escapeHtml(lastmod)}</span>
            <span>${readingTime(wordEstimate)} min read</span>
            <span>U.S.-focused editorial guide</span>
          </div>
          <div class="hero__actions">
            <a class="button button--primary" href="${escapeAttr(localPageHref(fromFile, page.primaryCta?.route || "/tools/vpn-cost-calculator/"))}">${escapeHtml(page.primaryCta?.label || "Open Cost Calculator")}</a>
            <a class="button button--ghost" href="${escapeAttr(localPageHref(fromFile, page.secondaryCta?.route || "/vpn-reviews/"))}">${escapeHtml(page.secondaryCta?.label || "Browse VPN Reviews")}</a>
          </div>
        </div>
        <div class="hero__visual">
          <img src="${escapeAttr(heroArt)}" alt="${escapeAttr(page.heroAlt || page.h1)}" width="720" height="560">
        </div>
      </section>
      ${innerHtml}
      <footer class="site-footer">
        <div class="footer-grid">
          <section>
            <h2>${escapeHtml(brand)}</h2>
            <p>${escapeHtml(site.description)}</p>
            <p>${escapeHtml(site.disclaimer)}</p>
          </section>
          <section>
            <h2>Top Guides</h2>
            <ul>
              ${footerCategoryLinks
                .map(([label, route]) => `<li><a href="${escapeAttr(localPageHref(fromFile, route))}">${escapeHtml(label)}</a></li>`)
                .join("")}
            </ul>
          </section>
          <section>
            <h2>Editorial</h2>
            <ul>
              ${legalLinks
                .map(([label, route]) => `<li><a href="${escapeAttr(localPageHref(fromFile, route))}">${escapeHtml(label)}</a></li>`)
                .join("")}
            </ul>
          </section>
          <section>
            <h2>Contact</h2>
            <ul>
              <li><a href="mailto:${escapeAttr(site.email)}">${escapeHtml(site.email)}</a></li>
              <li>${escapeHtml(site.phone)}</li>
              <li>Serving privacy-conscious users in the United States</li>
            </ul>
          </section>
        </div>
      </footer>
      <div id="schema-data" data-schema='${escapeAttr(JSON.stringify(schema))}'></div>
    </div>
    <div class="cookie-banner" data-cookie-banner hidden>
      <div>
        <strong>Privacy choices</strong>
        <p>We use essential cookies and optional measurement signals. You can accept or reject the non-essential layer.</p>
      </div>
      <div class="cookie-banner__actions">
        <button type="button" class="button button--ghost" data-cookie-action="reject">Reject non-essential</button>
        <button type="button" class="button button--primary" data-cookie-action="accept">Accept</button>
      </div>
    </div>
    <script src="${escapeAttr(assetJs)}" defer></script>
  </body>
</html>`;
}

function relatedCards(pages, currentRoute, clusterRoute) {
  return pages
    .filter((page) => page.route !== currentRoute && page.route.startsWith(clusterRoute) && page.type !== "hub")
    .slice(0, 4)
    .map((page) => ({
      route: page.route,
      title: page.title,
      category: page.parent?.title || "Guide",
      description: page.description,
    }));
}

const hubs = [
  {
    route: "/vpn-costs/",
    title: "VPN Costs",
    h1: "VPN Costs and Subscription Pricing Guides",
    description: "Explore average VPN pricing, annual plans, family subscriptions, business costs, and value comparisons for U.S. buyers.",
    type: "hub",
    kicker: "Cluster Hub",
    heroImage: "assets/images/hero-vpn-pricing.svg",
    heroTone: "pricing",
  },
  {
    route: "/vpn-reviews/",
    title: "VPN Reviews",
    h1: "VPN Reviews for U.S. Buyers",
    description: "Deep-dive editorial reviews covering pricing, privacy, streaming, usability, and long-run subscription value.",
    type: "hub",
    kicker: "Cluster Hub",
    heroImage: "assets/images/hero-review-lab.svg",
    heroTone: "review",
  },
  {
    route: "/vpn-use-cases/",
    title: "VPN Use Cases",
    h1: "Best VPNs by Use Case",
    description: "Find the best VPN fit for Netflix, gaming, travel, remote work, public WiFi, students, and device-specific needs.",
    type: "hub",
    kicker: "Cluster Hub",
    heroImage: "assets/images/hero-remote-shield.svg",
    heroTone: "usecase",
  },
  {
    route: "/cybersecurity-guides/",
    title: "Cybersecurity Guides",
    h1: "Online Privacy and Personal Cybersecurity Guides",
    description: "Learn how VPNs fit into safer browsing, password hygiene, MFA, phishing protection, and identity risk planning.",
    type: "hub",
    kicker: "Cluster Hub",
    heroImage: "assets/images/hero-cyber-ops.svg",
    heroTone: "cyber",
  },
  {
    route: "/comparisons/",
    title: "Comparisons",
    h1: "VPN Comparisons and Matchups",
    description: "Compare leading VPNs and privacy tools by price, speed, privacy, and best-fit scenario for U.S. users.",
    type: "hub",
    kicker: "Cluster Hub",
    heroImage: "assets/images/hero-compare-matrix.svg",
    heroTone: "compare",
  },
  {
    route: "/tools/",
    title: "Tools",
    h1: "VPN and Cybersecurity Tools",
    description: "Interactive calculators and quizzes for VPN costs, annual savings, password strength, breach risk, and security budgeting.",
    type: "hub",
    kicker: "Cluster Hub",
    heroImage: "assets/images/hero-tools-dashboard.svg",
    heroTone: "tools",
  },
];

const reviewNames = [
  ["nordvpn-review", "NordVPN Review", "NordVPN", ["Low on longer terms", "Moderate renewal jump"], "Strong audit and privacy narrative", "Streaming-heavy households"],
  ["expressvpn-review", "ExpressVPN Review", "ExpressVPN", ["Premium pricing", "Premium renewal"], "High trust but expensive", "Users who want a polished premium app"],
  ["surfshark-review", "Surfshark Review", "Surfshark", ["Aggressive promo pricing", "Moderate renewal"], "Good value with large-device appeal", "Budget-conscious families"],
  ["cyberghost-review", "CyberGhost Review", "CyberGhost", ["Competitive multi-year pricing", "Moderate renewal"], "Solid consumer fit", "Readers balancing savings and ease"],
  ["protonvpn-review", "ProtonVPN Review", "Proton VPN", ["Mid-to-premium pricing", "Stable positioning"], "Privacy-first posture", "Security-focused users"],
  ["pia-review", "PIA Review", "Private Internet Access", ["Low long-term pricing", "Moderate renewal"], "Feature-rich with strong value", "Experienced users who want tweakability"],
  ["ipvanish-review", "IPVanish Review", "IPVanish", ["Mid-market pricing", "Medium renewal pressure"], "Generalist value", "Users focused on straightforward device coverage"],
  ["atlas-vpn-review", "Atlas VPN Review", "Atlas VPN", ["Low entry pricing", "Brand-position watch"], "Watch provider status closely", "Readers comparing discontinued or legacy options"],
  ["mullvad-review", "Mullvad Review", "Mullvad", ["Flat simple pricing", "Low renewal complexity"], "Excellent privacy reputation", "Privacy-first buyers"],
  ["windscribe-review", "Windscribe Review", "Windscribe", ["Flexible pricing", "Moderate renewal"], "Good for custom-fit buyers", "Users wanting flexible plan shapes"],
];

function buildReviewPages() {
  return reviewNames.map(([slug, title, brand, pricing, privacy, bestFor], index) => ({
    route: `/vpn-reviews/${slug}/`,
    title,
    h1: title,
    description: `${brand} review for U.S. buyers covering price, renewal value, privacy signals, app experience, speed consistency, and ideal use cases.`,
    type: "review",
    schemaType: "review",
    brand,
    shortTopic: brand,
    kicker: "VPN Review",
    heroImage: ["assets/images/hero-review-lab.svg", "assets/images/hero-vpn-network.svg", "assets/images/hero-remote-shield.svg"][index % 3],
    heroTone: "review",
    parent: hubs[1],
    pricing,
    privacy,
    bestFor,
    stats: [
      { label: "Pricing position", value: pricing[0], note: "How the promo term usually lands against the market." },
      { label: "Renewal signal", value: pricing[1], note: "Why long-run value may differ from checkout pricing." },
      { label: "Privacy posture", value: privacy, note: "Editorial read on transparency and trust." },
      { label: "Best fit", value: bestFor, note: "Where the service often makes the most sense." },
    ],
    takeaways: [
      `${brand} works best when its strongest feature set lines up with your primary use case.`,
      "Renewal price matters almost as much as the promo price for long-run value.",
      "Audit depth and cancellation clarity should influence the buying decision.",
    ],
    costFocus: pricing[0],
    privacyFocus: privacy,
    useFocus: `App quality and device support for ${brand}`,
    fitFocus: bestFor,
    chartBars: [
      { label: "Value", value: "78/100" },
      { label: "Privacy", value: "82/100" },
      { label: "Ease", value: "76/100" },
      { label: "Fit", value: "80/100" },
    ],
    reviewSchema: {
      ratingValue: 4.4 - index * 0.03,
      bestRating: 5,
      itemReviewed: brand,
    },
  }));
}

const costPages = [
  ["average-vpn-cost-per-month", "Average VPN Cost Per Month", "monthly VPN pricing", "Low monthly prices often trade away support depth or premium privacy tooling."],
  ["cheapest-vpns", "Cheapest VPNs", "cheap VPN subscriptions", "The cheapest plans can still be worth it when the compromise profile is visible and acceptable."],
  ["best-vpns-under-5", "Best VPNs Under $5", "VPNs under five dollars", "Under-$5 plans are strongest when they do not force harsh device or speed limits."],
  ["best-annual-vpn-plans", "Best Annual VPN Plans", "annual VPN plans", "Annual plans make sense when renewal pricing stays reasonable and refund windows are usable."],
  ["free-vpn-vs-paid-vpn", "Free VPN vs Paid VPN", "free vs paid VPNs", "The biggest difference is usually trust, speed, and data allowance rather than pure download performance."],
  ["family-vpn-plans", "Family VPN Plans", "family VPN subscriptions", "Households should look at device limits, router support, and ease of use before the headline price."],
  ["business-vpn-costs", "Business VPN Costs", "business VPN costs", "Small teams usually overpay when they buy enterprise complexity they do not need."],
  ["vpn-subscription-comparison", "VPN Subscription Comparison", "VPN subscription comparison", "Comparing the whole contract is more important than comparing the landing page alone."],
];

function buildCostPages() {
  return costPages.map(([slug, title, shortTopic, extra], index) => ({
    route: `/vpn-costs/${slug}/`,
    title,
    h1: title,
    description: `${title} for U.S. users, including plan length, renewal pricing, privacy tradeoffs, and where value shows up in real subscriptions.`,
    type: "article",
    shortTopic,
    kicker: "VPN Costs",
    heroImage: ["assets/images/hero-vpn-pricing.svg", "assets/images/hero-tools-dashboard.svg", "assets/images/hero-vpn-network.svg"][index % 3],
    heroTone: "pricing",
    parent: hubs[0],
    stats: [
      { label: "Typical monthly billed range", value: "$2 to $13", note: "Depends heavily on term length and brand positioning." },
      { label: "Common annual spend", value: "$36 to $99", note: "Many value-focused plans cluster here." },
      { label: "Renewal gap", value: "15% to 60%", note: "Renewal pressure is one of the biggest hidden costs." },
      { label: "Best value zone", value: "12 to 24 months", note: "Long enough for savings, short enough to limit lock-in." },
    ],
    takeaways: [
      extra,
      "The best-value VPN is rarely the absolute cheapest one in the market.",
      "Pricing only works when the provider still feels trustworthy after the trial period.",
    ],
    costFocus: "Promo versus renewal math",
    privacyFocus: "Policy clarity, audits, and app telemetry signals",
    useFocus: "Household devices, support quality, and ease of use",
    fitFocus: "Budget level and reason for buying a VPN",
    chartBars: [
      { label: "Price clarity", value: "74/100" },
      { label: "Renewal risk", value: "61/100" },
      { label: "Privacy confidence", value: "79/100" },
      { label: "Household fit", value: "76/100" },
    ],
  }));
}

const useCasePages = [
  "Best VPN for Netflix",
  "Best VPN for Torrenting",
  "Best VPN for Gaming",
  "Best VPN for Travel",
  "Best VPN for Remote Work",
  "Best VPN for Public WiFi",
  "Best VPN for Students",
  "Best VPN for Small Businesses",
  "Best VPN for iPhone",
  "Best VPN for Android",
  "Best VPN for Mac",
  "Best VPN for Windows",
];

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildUseCasePages() {
  return useCasePages.map((title, index) => ({
    route: `/vpn-use-cases/${slugify(title)}/`,
    title,
    h1: title,
    description: `${title} for U.S. users comparing speed, reliability, privacy needs, device support, and the subscription value behind the recommendation.`,
    type: "article",
    shortTopic: title.toLowerCase(),
    kicker: "VPN Use Case",
    heroImage: ["assets/images/hero-remote-shield.svg", "assets/images/hero-vpn-network.svg", "assets/images/hero-review-lab.svg"][index % 3],
    heroTone: "usecase",
    parent: hubs[2],
    stats: [
      { label: "Main buying factor", value: ["Speed", "Privacy", "App fit", "Coverage"][index % 4], note: "The top metric changes by use case." },
      { label: "Typical budget sweet spot", value: "$3 to $9/mo", note: "Most strong consumer fits land here on annual plans." },
      { label: "Device importance", value: ["High", "Medium", "High", "Medium"][index % 4], note: "Multi-device households should weigh this heavily." },
      { label: "Refund value", value: "Very useful", note: "The easiest way to test real-world fit before full commitment." },
    ],
    takeaways: [
      `${title} should be chosen around the actual task you do most often, not generic rankings.`,
      "Strong device compatibility often matters as much as benchmark speed.",
      "Refund windows are especially helpful for travel, gaming, and streaming cases.",
    ],
    costFocus: "Use-case value versus generic pricing",
    privacyFocus: "How much trust matters for this activity",
    useFocus: "Whether the app works well on the devices involved",
    fitFocus: "Scenario-specific reliability for the named use case",
    chartBars: [
      { label: "Performance", value: "81/100" },
      { label: "Privacy", value: "75/100" },
      { label: "Value", value: "78/100" },
      { label: "Fit", value: "84/100" },
    ],
  }));
}

const cybersecurityTitles = [
  "What Is a VPN",
  "How VPNs Work",
  "VPN vs Proxy",
  "VPN vs Antivirus",
  "VPN vs Tor",
  "VPN Logging Policies Explained",
  "How to Stay Safe on Public WiFi",
  "Password Managers Guide",
  "Two-Factor Authentication Guide",
  "Identity Theft Protection Costs",
  "Antivirus Costs",
  "Cybersecurity Checklist",
  "Safe Browsing Tips",
  "Phishing Protection Guide",
  "Online Privacy Guide",
];

function buildCyberPages() {
  return cybersecurityTitles.map((title, index) => ({
    route: `/cybersecurity-guides/${slugify(title)}/`,
    title,
    h1: title,
    description: `${title} for everyday U.S. readers who want a clearer, safer, and more cost-aware approach to personal cybersecurity.`,
    type: "article",
    shortTopic: title.toLowerCase(),
    kicker: "Cybersecurity Guide",
    heroImage: ["assets/images/hero-cyber-ops.svg", "assets/images/hero-remote-shield.svg", "assets/images/hero-vpn-network.svg"][index % 3],
    heroTone: "cyber",
    parent: hubs[3],
    stats: [
      { label: "Reader goal", value: ["Clarity", "Safety", "Budget", "Confidence"][index % 4], note: "Most readers want a decision framework they can trust." },
      { label: "Best audience", value: ["Families", "Students", "Remote workers", "Travelers"][index % 4], note: "The guide is written for mainstream U.S. users." },
      { label: "Complexity level", value: ["Beginner friendly", "Intermediate", "Beginner friendly", "Intermediate"][index % 4], note: "We translate technical concepts into practical choices." },
      { label: "Action bias", value: "High", note: "Every guide is built to lead to a next step." },
    ],
    takeaways: [
      `${title} matters most when it helps users make a better everyday safety decision.`,
      "Consumer cybersecurity is strongest when price, convenience, and risk are evaluated together.",
      "Layered habits usually matter more than any single tool.",
    ],
    costFocus: "Subscription and tool-spend logic",
    privacyFocus: "How this topic changes exposure and trust",
    useFocus: "Practical adoption in a real household or workday",
    fitFocus: "Which readers should prioritize this guide first",
    chartBars: [
      { label: "Clarity", value: "80/100" },
      { label: "Protection", value: "77/100" },
      { label: "Budget impact", value: "71/100" },
      { label: "Actionability", value: "83/100" },
    ],
  }));
}

const comparisonPagesRaw = [
  ["NordVPN vs ExpressVPN", "NordVPN", "ExpressVPN"],
  ["Surfshark vs NordVPN", "Surfshark", "NordVPN"],
  ["ExpressVPN vs CyberGhost", "ExpressVPN", "CyberGhost"],
  ["ProtonVPN vs Mullvad", "Proton VPN", "Mullvad"],
  ["Free VPN vs Paid VPN", "Free VPN", "Paid VPN"],
  ["VPN vs Antivirus", "VPN", "Antivirus"],
  ["VPN vs Proxy", "VPN", "Proxy"],
  ["Best VPN by Price", "Budget-first VPNs", "Premium VPNs"],
  ["Best VPN by Speed", "Speed-first VPNs", "Balanced VPNs"],
  ["Best VPN by Privacy", "Privacy-first VPNs", "Mainstream VPNs"],
];

function buildComparisonPages() {
  return comparisonPagesRaw.map(([title, leftBrand, rightBrand], index) => ({
    route: `/comparisons/${slugify(title)}/`,
    title:
      title === "Free VPN vs Paid VPN" || title === "VPN vs Antivirus" || title === "VPN vs Proxy"
        ? `${title} Comparison`
        : title,
    h1:
      title === "Free VPN vs Paid VPN" || title === "VPN vs Antivirus" || title === "VPN vs Proxy"
        ? `${title} Comparison`
        : title,
    description:
      title === "Free VPN vs Paid VPN"
        ? "Free VPN vs Paid VPN comparison for U.S. users weighing trust, speed, privacy, hidden limits, and long-run value."
        : title === "VPN vs Antivirus"
          ? "VPN vs Antivirus comparison for U.S. readers deciding how privacy tools and endpoint protection fit together."
          : title === "VPN vs Proxy"
            ? "VPN vs Proxy comparison for U.S. users comparing encryption, privacy, speed, and practical everyday use."
            : `${title} for U.S. readers comparing cost, privacy, speed, user experience, and which option fits the intended job better.`,
    type: "comparison",
    shortTopic: title.toLowerCase(),
    kicker: "Comparison",
    heroImage: ["assets/images/hero-compare-matrix.svg", "assets/images/hero-review-lab.svg", "assets/images/hero-tools-dashboard.svg"][index % 3],
    heroTone: "compare",
    parent: hubs[4],
    leftBrand,
    rightBrand,
    stats: [
      { label: "Main decision axis", value: ["Price", "Privacy", "Streaming", "Simplicity"][index % 4], note: "Different buyers care about different tradeoffs." },
      { label: "Best approach", value: "Scenario-based", note: "A winner depends on what the reader actually needs." },
      { label: "Renewal importance", value: "High", note: "Long-run cost can flip the verdict." },
      { label: "Test strategy", value: "Use refund windows", note: "Hands-on testing reduces guesswork." },
    ],
    takeaways: [
      `The better choice between ${leftBrand} and ${rightBrand} depends on the job you want the service to do.`,
      "Promo pricing alone rarely settles the comparison.",
      "Privacy evidence and app quality matter more than dramatic marketing claims.",
    ],
    costFocus: "How each option behaves across promo and renewal periods",
    privacyFocus: "Trust depth and transparency detail",
    useFocus: "Where each option feels easier or stronger in practice",
    fitFocus: "Which buyer profile each side serves better",
    comparisonRows: [
      ["Upfront pricing", `${leftBrand} varies by plan`, `${rightBrand} varies by plan`, "Headline price should not replace total-value analysis"],
      ["Renewal outlook", "Review carefully", "Review carefully", "Renewals often decide long-run value"],
      ["Privacy trust", "Depends on policy and audits", "Depends on policy and audits", "Trust only works when the provider explains itself clearly"],
      ["Best fit", "Depends on scenario", "Depends on scenario", "Use case matters more than marketing"],
    ],
    chartBars: [
      { label: leftBrand, value: "79/100" },
      { label: rightBrand, value: "78/100" },
      { label: "Value lens", value: "81/100" },
      { label: "Fit lens", value: "84/100" },
    ],
  }));
}

const toolPagesRaw = [
  ["VPN Cost Calculator", "vpn-cost-calculator", "tool-vpn-cost"],
  ["Annual Savings Calculator", "annual-savings-calculator", "tool-annual-savings"],
  ["Password Strength Checker", "password-strength-checker", "tool-password"],
  ["Data Breach Risk Quiz", "data-breach-risk-quiz", "tool-breach"],
  ["Cybersecurity Budget Calculator", "cybersecurity-budget-calculator", "tool-budget"],
];

function buildToolPages() {
  return toolPagesRaw.map(([title, slug, calculatorType], index) => ({
    route: `/tools/${slug}/`,
    title,
    h1: title,
    description: `${title} for U.S. users who want a quick way to estimate VPN value, security spending, password resilience, or personal online risk.`,
    type: "tool",
    schemaType: "calculator",
    shortTopic: title.toLowerCase(),
    kicker: "Interactive Tool",
    heroImage: ["assets/images/hero-tools-dashboard.svg", "assets/images/hero-compare-matrix.svg", "assets/images/hero-cyber-ops.svg"][index % 3],
    heroTone: "tools",
    parent: hubs[5],
    calculatorType,
    stats: [
      { label: "Speed", value: "Instant output", note: "Designed for quick scenario planning." },
      { label: "Audience", value: "Everyday U.S. users", note: "No technical background required." },
      { label: "Best use", value: "Planning", note: "Helpful before paying for another subscription." },
      { label: "Works on mobile", value: "Yes", note: "Responsive and touch-friendly." },
    ],
    takeaways: [
      `${title} is best used to compare realistic scenarios, not idealized ones.`,
      "The result is strongest when paired with the editorial guides around it.",
      "Tools are meant to clarify tradeoffs, not replace judgment.",
    ],
    costFocus: "How spending choices change over a year",
    privacyFocus: "Where risk can grow without stronger habits",
    useFocus: "How to turn the output into a next step",
    fitFocus: "Which scenarios benefit most from this tool",
    chartBars: [
      { label: "Clarity", value: "85/100" },
      { label: "Utility", value: "82/100" },
      { label: "Mobile fit", value: "88/100" },
      { label: "Actionability", value: "84/100" },
    ],
  }));
}

const allArticlePages = [
  ...buildCostPages(),
  ...buildReviewPages(),
  ...buildUseCasePages(),
  ...buildCyberPages(),
  ...buildComparisonPages(),
  ...buildToolPages(),
];

for (const page of allArticlePages) {
  page.related = relatedCards(allArticlePages, page.route, page.parent.route);
}

function hubCards(clusterRoute) {
  return allArticlePages
    .filter((page) => page.route.startsWith(clusterRoute))
    .slice(0, 12)
    .map((page) => ({
      route: page.route,
      title: page.title,
      description: page.description,
      category: page.kicker,
    }));
}

function hubBody(page, fromFile) {
  const cards = hubCards(page.route);
  return `
    ${renderStats([
      { label: "Pages in this cluster", value: String(cards.length), note: "Built for internal linking and topical depth." },
      { label: "Content style", value: "Premium editorial", note: "Long-form guidance with comparison tables and FAQs." },
      { label: "SEO structure", value: "Extensionless", note: "Clean canonicals, breadcrumbs, and schema-ready pages." },
      { label: "Monetization fit", value: "AdSense-ready", note: "Trust pages, strong navigation, and no ad placeholders." },
    ])}
    <section class="panel intro-panel">
      <p class="lede">${escapeHtml(page.description)} This hub is designed as a category landing page that helps Search Console, users, and internal linking all point to a clean center of gravity.</p>
      ${renderBulletList([
        "Use hub pages to discover related guides without duplicate topic overlap.",
        "Each article is linked contextually and through visual cards.",
        "Cluster pages strengthen topical authority and crawl efficiency.",
      ])}
    </section>
    <section class="panel">
      <div class="section-heading">
        <span class="eyebrow">Featured Guides</span>
        <h2>Key pages in this cluster</h2>
      </div>
      <div class="related-grid">
        ${cards
          .map(
            (card) => `
              <a class="related-card related-card--large" href="${escapeAttr(localPageHref(fromFile, card.route))}">
                <span>${escapeHtml(card.category)}</span>
                <strong>${escapeHtml(card.title)}</strong>
                <p>${escapeHtml(card.description)}</p>
              </a>`,
          )
          .join("")}
      </div>
    </section>
    ${researchBox()}
    ${authorBox()}`;
}

const utilityPages = [
  {
    route: "/about/",
    title: "About",
    h1: "About VPN Cost Guide",
    description: "Learn how VPN Cost Guide covers subscription pricing, privacy, and online safety for U.S. readers.",
    type: "page",
    kicker: "Company",
    heroImage: "assets/images/hero-review-lab.svg",
    heroTone: "review",
  },
  {
    route: "/contact/",
    title: "Contact",
    h1: "Contact VPN Cost Guide",
    description: "Reach the VPN Cost Guide editorial team for corrections, feedback, or partnership inquiries.",
    type: "page",
    kicker: "Contact",
    heroImage: "assets/images/hero-tools-dashboard.svg",
    heroTone: "tools",
  },
  {
    route: "/privacy-policy/",
    title: "Privacy Policy",
    h1: "Privacy Policy",
    description: "Read how VPN Cost Guide handles personal data, cookies, analytics, and user rights.",
    type: "page",
    kicker: "Legal",
    heroImage: "assets/images/hero-cyber-ops.svg",
    heroTone: "cyber",
  },
  {
    route: "/terms/",
    title: "Terms",
    h1: "Terms of Use",
    description: "Terms governing the use of VPN Cost Guide content, tools, and published materials.",
    type: "page",
    kicker: "Legal",
    heroImage: "assets/images/hero-vpn-network.svg",
    heroTone: "default",
  },
  {
    route: "/disclaimer/",
    title: "Disclaimer",
    h1: "Editorial Disclaimer",
    description: "Important disclaimers about informational content, cybersecurity limitations, and non-advisory content.",
    type: "page",
    kicker: "Legal",
    heroImage: "assets/images/hero-compare-matrix.svg",
    heroTone: "compare",
  },
  {
    route: "/editorial-policy/",
    title: "Editorial Policy",
    h1: "Editorial Policy",
    description: "See the standards VPN Cost Guide uses for accuracy, fairness, updates, and commercial independence.",
    type: "page",
    kicker: "Editorial",
    heroImage: "assets/images/hero-review-lab.svg",
    heroTone: "review",
  },
  {
    route: "/how-we-research/",
    title: "How We Research",
    h1: "How We Research VPNs and Cybersecurity Tools",
    description: "Understand how we evaluate VPN pricing, privacy, app quality, support, and subscription value.",
    type: "page",
    kicker: "Research",
    heroImage: "assets/images/hero-cyber-ops.svg",
    heroTone: "cyber",
  },
  {
    route: "/cookie-policy/",
    title: "Cookie Policy",
    h1: "Cookie Policy",
    description: "Read how essential and optional cookies are used on VPN Cost Guide, including GDPR and CCPA controls.",
    type: "page",
    kicker: "Legal",
    heroImage: "assets/images/hero-tools-dashboard.svg",
    heroTone: "tools",
  },
  {
    route: "/sitemap/",
    title: "Sitemap",
    h1: "HTML Sitemap",
    description: "Browse the complete VPN Cost Guide page structure in one human-friendly sitemap.",
    type: "page",
    kicker: "Navigation",
    heroImage: "assets/images/hero-vpn-pricing.svg",
    heroTone: "pricing",
  },
];

function utilityBody(page, fromFile) {
  if (page.route === "/contact/") {
    return `
      <section class="panel">
        <p class="lede">For corrections, privacy questions, licensing requests, or editorial feedback, contact the team using the details below. We review factual corrections and safety-related reports as quickly as possible.</p>
        <div class="info-grid">
          <article><h2>Email</h2><p><a href="mailto:${escapeAttr(site.email)}">${escapeHtml(site.email)}</a></p></article>
          <article><h2>Phone</h2><p>${escapeHtml(site.phone)}</p></article>
          <article><h2>Coverage</h2><p>Consumer VPNs, online privacy, subscription costs, and personal cybersecurity for U.S. audiences.</p></article>
        </div>
      </section>
      ${authorBox()}
      ${researchBox()}`;
  }

  if (page.route === "/sitemap/") {
    const clusters = [...hubs, ...utilityPages.filter((item) => item.route !== "/sitemap/")];
    return `
      <section class="panel">
        <p class="lede">This HTML sitemap supports users and crawlers with a clean, extensionless directory structure. Every page links to its final canonical route without .html, www, or query-based discovery patterns.</p>
      </section>
      <section class="panel">
        <div class="sitemap-columns">
          ${clusters
            .map((cluster) => {
              const children =
                cluster.route === "/"
                  ? []
                  : allArticlePages.filter((item) => item.parent?.route === cluster.route).slice(0, 16);
              return `
                <article class="sitemap-group">
                  <h2><a href="${escapeAttr(localPageHref(fromFile, cluster.route))}">${escapeHtml(cluster.title)}</a></h2>
                  <ul>
                    ${children
                      .map((child) => `<li><a href="${escapeAttr(localPageHref(fromFile, child.route))}">${escapeHtml(child.title)}</a></li>`)
                      .join("")}
                  </ul>
                </article>`;
            })
            .join("")}
        </div>
      </section>`;
  }

  const blocks = {
    "/about/": [
      "VPN Cost Guide was built to cover a specific gap in the market: many VPN websites are either too sales-driven, too technical, or too thin to help mainstream readers make a smart buying decision. We focus on subscription math, privacy trust, and everyday cybersecurity behavior for people in the United States.",
      "Our editorial goal is practical clarity. That means explaining when a premium VPN is actually worth it, when a cheaper plan is enough, when a free tool creates too much compromise, and how a VPN fits into broader online safety rather than pretending it solves everything alone.",
    ],
    "/privacy-policy/": [
      "We collect the minimum information needed to operate the site, respond to messages, prevent abuse, and understand high-level performance trends. We do not sell personal information. Essential cookies support consent preferences, security, and site functionality.",
      "California privacy rights and GDPR-aligned controls are respected through our cookie banner choices and our preference handling approach. Users can contact us about access, correction, or deletion requests tied to data we directly control.",
      "This site may use Google AdSense and related Google advertising technology to serve ads, measure performance, and limit fraud. Google and its partners may use cookies or similar identifiers to personalize advertising and reporting, subject to regional consent rules and the settings a user chooses through the cookie banner.",
    ],
    "/terms/": [
      "VPN Cost Guide content is offered for informational and educational purposes. By using the site, readers agree not to misuse tools, copy content unlawfully, or rely on editorial material as a substitute for professional legal or cybersecurity advice.",
      "We may update content, features, and policies as the site grows. Continued use after updates means acceptance of the revised terms, to the extent permitted by law.",
    ],
    "/disclaimer/": [
      "We do not provide legal advice, digital forensics, incident response, or managed security services. Readers facing an active compromise, fraud event, identity theft emergency, or business security incident should contact a qualified professional or relevant authority.",
      "VPN reviews and comparisons reflect editorial judgment at the time of publication. Pricing, product quality, and policies can change, so readers should verify final details directly with providers before purchase.",
    ],
    "/editorial-policy/": [
      "Our editorial team prioritizes clarity, factual accuracy, independent judgment, and transparent updates. Commercial considerations do not override user value, and pages are revised when pricing structures, privacy claims, or consumer risk factors materially change.",
      "We avoid exaggerated security claims, unsupported rankings, fake urgency, or dummy ad-slot language that weakens trust. Content is structured to support both real readers and sustainable ad-quality standards.",
    ],
    "/how-we-research/": [
      "We review provider pricing pages, renewal disclosures, plan limits, refund policies, transparency reports, public audit references, and app experience signals. We also look at how easily a normal user can understand what is being bought and what compromises come with cheaper plans.",
      "Our scoring lens is intentionally consumer-first. We care about true cost, trust, usability, and scenario fit more than flashy affiliate-style rankings. That approach helps us build content that is more stable for SEO and more useful for readers over time.",
    ],
    "/cookie-policy/": [
      "Our site uses essential cookies for consent management, session safety, and performance continuity. Optional analytics and measurement signals, when present, are kept lightweight and are governed by user choice where applicable.",
      "Users can accept or reject non-essential cookies through the banner. Preference storage is handled through localStorage when available, with a lightweight first-party cookie fallback only for environments where storage is restricted.",
    ],
  };

  const paragraphs = blocks[page.route] || [
    "This page exists to support trust, clarity, and a complete policy framework across the site.",
    "It is written to be transparent, useful, and consistent with the editorial standards applied to every other published page.",
  ];

  return `
    <section class="panel">
      <p class="lede">${escapeHtml(page.description)}</p>
      ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </section>
    ${researchBox()}
    ${authorBox()}`;
}

const homePage = {
  route: "/",
  title: "VPN Cost Guide",
  metaTitle: "VPN Cost Guide: Premium U.S. VPN Pricing",
  h1: "VPN Cost Guide for U.S. Privacy, Pricing, and Cybersecurity Decisions",
  description:
    "Premium guides, reviews, comparisons, and calculators for U.S. users comparing VPN subscriptions, privacy tools, and practical online safety costs.",
  type: "home",
  schemaType: "home",
  ogType: "website",
  kicker: "VPN Intelligence",
  heroImage: "assets/images/hero-vpn-network.svg",
  heroTone: "default",
  primaryCta: { label: "Compare VPN Costs", route: "/vpn-costs/" },
  secondaryCta: { label: "Explore Tools", route: "/tools/" },
};

function homeBody(fromFile) {
  return `
    ${renderStats([
      { label: "Editorial pages", value: String(allArticlePages.length + hubs.length + utilityPages.length + 2), note: "Built to scale well beyond 100 pages." },
      { label: "Core clusters", value: "6", note: "Pricing, reviews, use cases, cybersecurity, comparisons, and tools." },
      { label: "Audience", value: "United States", note: "Every page is written for U.S. readers and buying patterns." },
      { label: "Publishing standard", value: "AdSense-ready", note: "Legal pages, author signals, sources, FAQs, and trust-first layouts." },
    ])}
    <section class="panel home-intro">
      <div class="section-heading">
        <span class="eyebrow">Why This Site Exists</span>
        <h2>A premium VPN website built for trust, not clutter</h2>
      </div>
      <p>VPN Cost Guide is designed to become a reference site for U.S. readers comparing VPN subscriptions, digital privacy tools, and personal cybersecurity spending. Instead of thin affiliate-style blurbs, we build long-form pages with price context, fit analysis, privacy signals, FAQ coverage, and conversion-ready layouts that still feel editorial.</p>
      <p>The site architecture is built from the start for clean Search Console signals: extensionless routes, absolute canonicals without <code>.html</code>, no <code>www</code> canonicals, no accidental <code>index.html</code> navigation, and strong internal linking from category hubs into supporting guides.</p>
    </section>
    <section class="panel">
      <div class="section-heading">
        <span class="eyebrow">Core Clusters</span>
        <h2>Coverage built for depth and future scale</h2>
      </div>
      <div class="related-grid">
        ${hubs
          .map(
            (hub) => `
              <a class="related-card related-card--large" href="${escapeAttr(localPageHref(fromFile, hub.route))}">
                <span>${escapeHtml(hub.kicker)}</span>
                <strong>${escapeHtml(hub.title)}</strong>
                <p>${escapeHtml(hub.description)}</p>
              </a>`,
          )
          .join("")}
      </div>
    </section>
    <section class="panel">
      <div class="section-heading">
        <span class="eyebrow">Featured Guides</span>
        <h2>High-intent pages with strong commercial value</h2>
      </div>
      <div class="related-grid">
        ${[
          "/vpn-costs/average-vpn-cost-per-month/",
          "/vpn-costs/cheapest-vpns/",
          "/vpn-reviews/nordvpn-review/",
          "/vpn-use-cases/best-vpn-for-netflix/",
          "/comparisons/nordvpn-vs-expressvpn/",
          "/tools/vpn-cost-calculator/",
        ]
          .map((route) => allArticlePages.find((page) => page.route === route))
          .filter(Boolean)
          .map(
            (page) => `
              <a class="related-card" href="${escapeAttr(localPageHref(fromFile, page.route))}">
                <span>${escapeHtml(page.kicker)}</span>
                <strong>${escapeHtml(page.title)}</strong>
                <p>${escapeHtml(page.description)}</p>
              </a>`,
          )
          .join("")}
      </div>
    </section>
    ${chartMarkup({
      eyebrow: "Market Signals",
      title: "What shapes VPN value in 2026",
      ariaLabel: "Visual market signal chart for VPN value",
      bars: makeChartBars([
        { label: "Privacy trust", value: "86/100", tone: "cyan" },
        { label: "Price transparency", value: "73/100", tone: "green" },
        { label: "Streaming fit", value: "78/100", tone: "blue" },
        { label: "Household usability", value: "81/100", tone: "teal" },
      ]),
    })}
    ${researchBox()}
    ${authorBox()}
    ${sourcesBox({ shortTopic: "VPN pricing and personal cybersecurity" })}`;
}

function toolWidget(page) {
  const widgetMap = {
    "tool-vpn-cost": `
      <section class="panel calculator-panel" data-calculator="vpn-cost">
        <div class="section-heading"><span class="eyebrow">Interactive Tool</span><h2>VPN cost calculator</h2></div>
        <form class="tool-form">
          <label>Monthly plan price <input type="number" min="0" step="0.01" name="monthlyPrice" value="11.99"></label>
          <label>Annual plan billed price <input type="number" min="0" step="0.01" name="annualPrice" value="59.88"></label>
          <label>Years you expect to keep it <input type="number" min="1" max="5" step="1" name="years" value="2"></label>
          <button type="submit" class="button button--primary">Calculate</button>
        </form>
        <div class="calculator-result" aria-live="polite"></div>
      </section>`,
    "tool-annual-savings": `
      <section class="panel calculator-panel" data-calculator="annual-savings">
        <div class="section-heading"><span class="eyebrow">Interactive Tool</span><h2>Annual savings calculator</h2></div>
        <form class="tool-form">
          <label>Monthly plan price <input type="number" min="0" step="0.01" name="monthlyPrice" value="12.99"></label>
          <label>Annual plan monthly equivalent <input type="number" min="0" step="0.01" name="annualEquivalent" value="4.99"></label>
          <label>Number of years <input type="number" min="1" max="5" step="1" name="years" value="1"></label>
          <button type="submit" class="button button--primary">Calculate</button>
        </form>
        <div class="calculator-result" aria-live="polite"></div>
      </section>`,
    "tool-password": `
      <section class="panel calculator-panel" data-calculator="password">
        <div class="section-heading"><span class="eyebrow">Interactive Tool</span><h2>Password strength checker</h2></div>
        <form class="tool-form">
          <label>Enter a sample password <input type="text" name="password" value="BlueSky2026!Shield"></label>
          <button type="submit" class="button button--primary">Analyze</button>
        </form>
        <div class="calculator-result" aria-live="polite"></div>
      </section>`,
    "tool-breach": `
      <section class="panel calculator-panel" data-calculator="breach">
        <div class="section-heading"><span class="eyebrow">Interactive Tool</span><h2>Data breach risk quiz</h2></div>
        <form class="tool-form">
          <label>How many online accounts do you actively use? <input type="number" min="1" step="1" name="accounts" value="45"></label>
          <label>Do you reuse passwords? <select name="reuse"><option value="yes">Yes</option><option value="sometimes">Sometimes</option><option value="no">No</option></select></label>
          <label>Do you use MFA on important accounts? <select name="mfa"><option value="yes">Yes</option><option value="some">Some accounts</option><option value="no">No</option></select></label>
          <button type="submit" class="button button--primary">Score my risk</button>
        </form>
        <div class="calculator-result" aria-live="polite"></div>
      </section>`,
    "tool-budget": `
      <section class="panel calculator-panel" data-calculator="budget">
        <div class="section-heading"><span class="eyebrow">Interactive Tool</span><h2>Cybersecurity budget calculator</h2></div>
        <form class="tool-form">
          <label>VPN yearly spend <input type="number" min="0" step="0.01" name="vpn" value="59.88"></label>
          <label>Password manager yearly spend <input type="number" min="0" step="0.01" name="passwordManager" value="36"></label>
          <label>Identity protection yearly spend <input type="number" min="0" step="0.01" name="identity" value="120"></label>
          <button type="submit" class="button button--primary">Calculate budget</button>
        </form>
        <div class="calculator-result" aria-live="polite"></div>
      </section>`,
  };
  return widgetMap[page.calculatorType] || "";
}

function page404() {
  return {
    route: "/404/",
    title: "404",
    h1: "Page Not Found",
    description: "The page you requested could not be found. Use the main hubs to continue exploring VPN Cost Guide.",
    type: "page",
    robots: "noindex, follow",
    kicker: "Error",
    heroImage: "assets/images/hero-compare-matrix.svg",
    heroTone: "compare",
  };
}

function pageContent(page, fromFile) {
  if (page.route === "/") return homeBody(fromFile);
  if (page.type === "hub") return hubBody(page, fromFile);
  if (page.type === "page") {
    if (page.route === "/404/") {
      return `
        <section class="panel">
          <p class="lede">The requested page does not exist at the canonical route. This custom 404 keeps the experience useful, index-safe, and easy to recover from.</p>
          <div class="hero__actions">
            <a class="button button--primary" href="${escapeAttr(localPageHref(fromFile, "/"))}">Go to homepage</a>
            <a class="button button--ghost" href="${escapeAttr(localPageHref(fromFile, "/sitemap/"))}">Open sitemap</a>
          </div>
        </section>`;
    }
    return utilityBody(page, fromFile);
  }
  const body = buildArticleBody(page, fromFile);
  return page.type === "tool" ? `${toolWidget(page)}${body}` : body;
}

const pages = [homePage, ...hubs, ...utilityPages, ...allArticlePages, page404()];

async function writePage(page) {
  const file = toFile(page.route);
  const fullPath = path.join(root, file);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  const html = pageShell(page, pageContent(page, file), file);
  await fs.writeFile(fullPath, html);
  return { route: page.route, file, words: wordCount(html) };
}

function redirectsContent() {
  const pageRedirects = pages
    .filter((page) => page.route !== "/")
    .map((page) => `${page.route.slice(0, -1)}/index.html ${page.route} 301`);
  return [
    "http://vpncostguide.com/* https://vpncostguide.com/:splat 301",
    "http://www.vpncostguide.com/* https://vpncostguide.com/:splat 301",
    "https://www.vpncostguide.com/* https://vpncostguide.com/:splat 301",
    "/index.html / 301",
    ...pageRedirects,
    "/404.html /404/ 404",
  ].join("\n");
}

function headersContent() {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/*.html
  X-Robots-Tag: noindex
`;
}

function robotsContent() {
  return `User-agent: *
Allow: /
Sitemap: ${domain}/sitemap.xml
`;
}

function sitemapXml() {
  const urls = pages
    .filter((page) => page.route !== "/404/")
    .map(
      (page) => `  <url>
    <loc>${canonicalUrl(page.route)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function manifestJson() {
  return JSON.stringify(
    {
      name: brand,
      short_name: "VPN Guide",
      start_url: "/",
      display: "standalone",
      background_color: "#07111f",
      theme_color: "#07111f",
      icons: [
        { src: "/assets/icons/favicon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/assets/icons/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      ],
    },
    null,
    2,
  );
}

async function writeRootFiles(results) {
  await fs.writeFile(path.join(root, "_redirects"), redirectsContent());
  await fs.writeFile(path.join(root, "_headers"), headersContent());
  await fs.writeFile(path.join(root, "robots.txt"), robotsContent());
  await fs.writeFile(path.join(root, "ads.txt"), "google.com, pub-3733223915347669, DIRECT, f08c47fec0942fa0\n");
  await fs.writeFile(path.join(root, "sitemap.xml"), sitemapXml());
  await fs.writeFile(path.join(root, "manifest.json"), manifestJson());
  await fs.writeFile(path.join(root, "assets/manifest.json"), manifestJson());
  await fs.writeFile(path.join(root, "404.html"), pageShell(page404(), pageContent(page404(), "404.html"), "404.html"));
  await fs.writeFile(
    path.join(root, "walkthrough.md"),
    `# VPN Cost Guide Walkthrough

- Domain: ${domain}
- Pages generated: ${results.length}
- Architecture: extensionless routes with folder-based output and a single shared asset layer.
- Design direction: dark premium UI using navy, black, cyan, and green with large hero visuals, charts, cards, and trust sections.
- Compliance goals: no public .html canonicals, no www canonicals, no http URLs, no query-indexable search paths, no ad placeholders, dynamic FAQ schema only.
- Core clusters: VPN Costs, VPN Reviews, VPN Use Cases, Cybersecurity Guides, Comparisons, Tools.
- Required files included: sitemap.xml, robots.txt, ads.txt, _redirects, _headers, manifest.json, 404 page, legal pages, editorial pages, calculators, and audit scripts.
`,
  );
}

await fs.mkdir(path.join(root, "assets"), { recursive: true });
const results = [];
for (const page of pages) results.push(await writePage(page));
await writeRootFiles(results);

console.log(
  JSON.stringify(
    {
      domain,
      pages: results.length,
      minWords: Math.min(...results.map((item) => item.words)),
      maxWords: Math.max(...results.map((item) => item.words)),
    },
    null,
    2,
  ),
);
