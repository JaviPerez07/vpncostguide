import fs from "node:fs/promises";
import path from "node:path";

const root = "/Users/javiperezz7/Documents/vpncostguide";
const domain = "https://vpncostguide.com";
const brand = "VPN Cost Guide";
const lastmod = "2026-04-18";
const adsenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3733223915347669" crossorigin="anonymous"></script>`;

const site = {
  brand,
  domain,
  email: "focuslocalaiagency@gmail.com",
  phone: "+1 (202) 555-0148",
  tagline:
    "Premium VPN pricing, privacy, streaming, cybersecurity, and subscription planning guides for U.S. and U.K. readers.",
  description:
    "VPN Cost Guide helps readers in the United States and the United Kingdom compare VPN pricing, privacy tradeoffs, streaming access, subscription terms, and personal cybersecurity tools with premium editorial research.",
  organization: {
    name: "VPN Cost Guide Editorial Team",
    url: domain,
    logo: `${domain}/assets/icons/logo.svg`,
  },
  author: {
    name: "Alex Turner",
    credentials: "VPN Security Researcher",
    role: "Lead VPN Security Researcher",
    initials: "AT",
    bio: "Alex covers consumer and business VPN pricing, online privacy controls, secure browsing habits, and remote-work security for readers in the United States and the United Kingdom. He focuses on translating pricing pages, renewal terms, and privacy claims into practical subscription decisions.",
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
  if (route === "/") return `${domain}/`;
  return `${domain}${route.replace(/\/$/, "")}`;
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
  if (relative.endsWith("/index.html")) relative = relative.slice(0, -"/index.html".length);
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
      a: `${topic} is usually worth paying for when privacy, streaming consistency, or travel reliability matter more than saving a few dollars each month. In most cases, the strongest value comes from matching the plan to your device count, your renewal tolerance, and the main reason you want a VPN in the first place. Readers who only look at the promo number often miss how much support quality, speed consistency, and refund rules shape the real value of the subscription.`,
    },
    {
      q: `How should I compare ${topic} offers?`,
      a: `Start with the real billed amount, the renewal price, the refund window, the server footprint, the logging policy, any independent audit evidence, and the quality of customer support. That comparison framework matters more than the promo banner because it shows whether the VPN still looks sensible after the first term ends. A good offer is not just cheap on day one, it also stays understandable and usable over time.`,
    },
    {
      q: `What is the biggest mistake people make with ${topic}?`,
      a: `The most common mistake is buying the cheapest headline price without checking the term length, the auto-renew price, the device limits, or whether the service actually fits the use case that matters most. A second common mistake is assuming every premium VPN is automatically worth the premium, even when the buyer only needs a simple streaming or travel setup. The better approach is to define the use case first and then compare price against the smallest set of features that solve it well.`,
    },
    {
      q: `Can a VPN replace broader cybersecurity habits?`,
      a: `No. A VPN is one useful layer, but strong passwords, software updates, phishing awareness, multi-factor authentication, and device hygiene still matter for real-world online safety. A VPN helps most with connection privacy, IP masking, and safer browsing on untrusted networks, but it does not stop every scam, malware infection, or account takeover on its own. The strongest results come from pairing a VPN with smarter account security habits.`,
    },
    {
      q: `Do U.S. and U.K. buyers need to compare VPN pricing differently?`,
      a: `Yes, at least slightly. U.S. shoppers often see cleaner pre-tax pricing, while U.K. readers may need to account for VAT, currency conversion, and occasional regional promo differences that change the effective billed total. Even when the provider is the same, the checkout math and renewal picture can look different by country, so it is worth checking the final cart before buying.`,
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

function buildArticleSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    author: {
      "@type": "Person",
      name: site.author.name,
      jobTitle: site.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: brand,
      logo: {
        "@type": "ImageObject",
        url: site.organization.logo,
      },
    },
    mainEntityOfPage: canonicalUrl(page.route),
    image: socialImage,
    url: canonicalUrl(page.route),
    datePublished: "2026-04-09",
    dateModified: lastmod,
  };
}

function buildBreadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: canonicalUrl(crumb.route),
    })),
  };
}

function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

function headSchemas(page, faqList, crumbs) {
  if (!faqList.length) return "";
  return [
    buildArticleSchema(page),
    buildBreadcrumbSchema(crumbs),
    buildFaqSchema(faqList),
  ]
    .map((schema) => `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
    .join("\n    ");
}

function pageLead(page) {
  return `${page.description} We focus on what readers in the United States and the United Kingdom usually care about most: what the service costs after the promo, how safe the provider looks, where the practical fit is strong, and where cheaper options can quietly create more friction than they save.`;
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

function renderContextLinks(fromFile, links) {
  if (!Array.isArray(links) || !links.length) return "";
  return `
    <section class="panel">
      <div class="section-heading">
        <span class="eyebrow">Related Reading</span>
        <h2>Helpful next steps</h2>
      </div>
      <ul class="key-list">
        ${links
          .map(
            (link) =>
              `<li><a href="${escapeAttr(localPageHref(fromFile, link.route))}">${escapeHtml(link.label)}</a> — ${escapeHtml(link.note)}</li>`,
          )
          .join("")}
      </ul>
    </section>`;
}

function buildArticleBody(page, fromFile) {
  const sections =
    Array.isArray(page.longSections) && page.longSections.length
      ? page.longSections
      : page.type === "review"
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
        ${renderContextLinks(fromFile, page.contextLinks)}
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
          ${renderTable(page.tableData || makeTable(page))}
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
  const assetCss = localAssetHref(fromFile, "styles.css");
  const assetJs = localAssetHref(fromFile, "main.js");
  const faviconIco = localAssetHref(fromFile, "favicon.ico");
  const manifest = localAssetHref(fromFile, "manifest.json");
  const logo = localAssetHref(fromFile, "assets/icons/logo.svg");
  const heroArt = localAssetHref(fromFile, page.heroImage || "assets/images/hero-vpn-network.svg");
  const wordEstimate = wordCount(innerHtml);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <link rel="canonical" href="${escapeAttr(canonicalUrl(page.route))}">
    <link rel="icon" href="${escapeAttr(faviconIco)}">
    <link rel="stylesheet" href="${escapeAttr(assetCss)}">
    ${adsenseScript}
    ${headSchemas(page, faqData, crumbs)}
    <meta name="robots" content="${escapeAttr(page.robots || "index, follow")}">
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
    <link rel="manifest" href="${escapeAttr(manifest)}">
    <script src="${escapeAttr(assetJs)}" defer></script>
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
            <span>U.S. & U.K. editorial guide</span>
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
  </body>
</html>`;
}

function relatedCards(pages, currentRoute, clusterRoute) {
  return pages
    .filter(
      (page) =>
        page.route !== currentRoute &&
        page.type !== "hub" &&
        (page.route.startsWith(clusterRoute) || page.parent?.route === clusterRoute),
    )
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

const providerPricing = {
  NordVPN: {
    monthly: "$12.99/mo",
    annual: "$68.85 yearly ($4.59/mo equivalent)",
    longTerm: "$80.73 for 27 months ($2.99/mo equivalent)",
    devices: "10 devices",
    refund: "30-day refund window",
    note: "Official NordVPN pricing and pricing explainer checked in late 2025 and reviewed for April 18, 2026 copy.",
  },
  ExpressVPN: {
    monthly: "$12.99/mo Basic",
    annual: "Yearly renewal varies by tier",
    longTerm: "$97.72 for 28 months ($3.49/mo equivalent) on Basic",
    devices: "10 devices",
    refund: "30-day refund window",
    note: "Official ExpressVPN order page snapshot indexed in 2026 shows Basic, Advanced, and Pro pricing.",
  },
  Surfshark: {
    monthly: "$15.45/mo Starter",
    annual: "12-month plans available by bundle",
    longTerm: "$1.99/mo on the 24-month Starter plan",
    devices: "Unlimited devices",
    refund: "30-day refund window",
    note: "Official Surfshark pricing and Surfshark pricing blog snapshot referenced in 2026.",
  },
  CyberGhost: {
    monthly: "$12.99/mo",
    annual: "$41.94 every 6 months ($6.99/mo equivalent)",
    longTerm: "$56.94 for 28 months ($2.03/mo equivalent)",
    devices: "7 devices",
    refund: "45-day refund window",
    note: "Official CyberGhost pricing pages and deal pages checked in April 2026.",
  },
  IPVanish: {
    monthly: "$12.99/mo",
    annual: "$39.99 yearly ($3.33/mo equivalent)",
    longTerm: "$52.56 for 24 months ($2.19/mo equivalent)",
    devices: "Unlimited devices",
    refund: "30-day refund window",
    note: "Public 2026 pricing checks align around $12.99 monthly, $3.33 annual, and $2.19 on the two-year term.",
  },
};

function providerRows(names) {
  return names.map((name) => {
    const item = providerPricing[name];
    return [name, item.monthly, item.longTerm, item.devices, item.refund];
  });
}

function pricingOverviewTable(title, names) {
  return {
    caption: title,
    headers: ["Provider", "Monthly plan", "Best long-term rate", "Device allowance", "Refund policy"],
    rows: providerRows(names),
  };
}

function contextLinksFor(kind) {
  const sets = {
    vpnCosts: [
      { route: "/vpn-costs/average-vpn-cost-per-month/", label: "Average VPN Cost Per Month", note: "Baseline pricing context for mainstream buyers." },
      { route: "/vpn-costs/cheapest-vpns/", label: "Cheapest VPNs", note: "See where low-cost plans still hold up." },
      { route: "/vpn-costs/best-annual-vpn-plans/", label: "Best Annual VPN Plans", note: "Useful when long-term value matters more than month-to-month flexibility." },
      { route: "/vpn-costs/vpn-subscription-comparison/", label: "VPN Subscription Comparison", note: "Compare billing structures, renewals, and fit." },
      { route: "/tools/vpn-cost-calculator/", label: "VPN Cost Calculator", note: "Model the annual math with your own budget assumptions." },
    ],
    business: [
      { route: "/vpn-costs/business-vpn-costs/", label: "Business VPN Costs", note: "The existing hub page for team-level budgeting." },
      { route: "/vpn-use-cases/best-vpn-for-small-businesses/", label: "Best VPN for Small Businesses", note: "Use-case guidance for smaller teams." },
      { route: "/vpn-use-cases/best-vpn-for-remote-work/", label: "Best VPN for Remote Work", note: "Helpful when staff work from home or travel." },
      { route: "/cybersecurity-guides/online-privacy-guide/", label: "Online Privacy Guide", note: "Good context for policy and data-handling concerns." },
      { route: "/tools/cybersecurity-budget-calculator/", label: "Cybersecurity Budget Calculator", note: "Useful when VPN spend is only one line item." },
    ],
    comparisons: [
      { route: "/comparisons/nordvpn-vs-expressvpn/", label: "NordVPN vs ExpressVPN", note: "The broader editorial matchup page." },
      { route: "/comparisons/surfshark-vs-nordvpn/", label: "Surfshark vs NordVPN", note: "Helpful when value and device count matter." },
      { route: "/comparisons/expressvpn-vs-cyberghost/", label: "ExpressVPN vs CyberGhost", note: "Useful for premium-versus-value thinking." },
      { route: "/comparisons/free-vpn-vs-paid-vpn/", label: "Free VPN vs Paid VPN", note: "The trust and risk angle behind pricing." },
      { route: "/comparisons/best-vpn-by-price/", label: "Best VPN by Price", note: "A wider price-led comparison set." },
    ],
    useCases: [
      { route: "/vpn-use-cases/best-vpn-for-netflix/", label: "Best VPN for Netflix", note: "Streaming reliability context." },
      { route: "/vpn-use-cases/best-vpn-for-gaming/", label: "Best VPN for Gaming", note: "Latency and stability tradeoffs." },
      { route: "/vpn-use-cases/best-vpn-for-travel/", label: "Best VPN for Travel", note: "Useful for roaming and public Wi-Fi scenarios." },
      { route: "/vpn-use-cases/best-vpn-for-remote-work/", label: "Best VPN for Remote Work", note: "Helpful when productivity and security overlap." },
      { route: "/vpn-use-cases/best-vpn-for-public-wifi/", label: "Best VPN for Public WiFi", note: "Good context for threat reduction on the move." },
    ],
    support: [
      { route: "/cybersecurity-guides/what-is-a-vpn/", label: "What Is a VPN", note: "Start here if the reader needs the basics first." },
      { route: "/cybersecurity-guides/how-vpns-work/", label: "How VPNs Work", note: "Useful context before comparing paid offers." },
      { route: "/cybersecurity-guides/vpn-logging-policies-explained/", label: "VPN Logging Policies Explained", note: "Important when trust matters more than raw speed." },
      { route: "/cybersecurity-guides/how-to-stay-safe-on-public-wifi/", label: "How to Stay Safe on Public WiFi", note: "A practical safety guide readers often need next." },
      { route: "/cybersecurity-guides/online-privacy-guide/", label: "Online Privacy Guide", note: "Broader privacy habits beyond the VPN purchase." },
    ],
  };
  return sets[kind] || sets.support;
}

function opportunityFaqs(page) {
  return [
    {
      q: `What is the short answer on ${page.shortTopic}?`,
      a: `${page.shortAnswer} The practical answer is that shoppers should compare both the billed total and the renewal expectation before treating any promo as a bargain. That is especially important on multi-year VPN plans, where the monthly headline number looks tiny but the first payment can still be meaningful. A good decision balances cost, trust, and whether the service actually fits the problem the buyer wants to solve.`,
    },
    {
      q: `Which VPN pricing detail matters most on ${page.shortTopic}?`,
      a: `The renewal structure usually matters most because it decides whether the service still feels fair after the first term. Buyers should also check device limits, refund length, and whether the provider adds extra security tools that justify a higher price. When those details are unclear, the cheapest headline rate can become an expensive mistake in practice.`,
    },
    {
      q: `Are there differences between U.S. and U.K. shoppers on ${page.shortTopic}?`,
      a: `Yes. U.S. buyers often compare pre-tax checkout pricing, while U.K. buyers may also need to account for VAT, localized payment options, and exchange-rate shifts when a provider bills in dollars. The product may be the same, but the effective first charge and renewal comfort level can feel different once currency and tax are added back in.`,
    },
    {
      q: `Should readers use the monthly plan first when researching ${page.shortTopic}?`,
      a: `Only when flexibility matters more than savings. Monthly plans are useful for testing an app, verifying streaming access, or covering a short travel window, but they are almost always the most expensive way to stay subscribed. If the provider offers a real refund policy, the lower-risk way to test value is usually a discounted annual or long-term term plus the money-back window.`,
    },
    {
      q: `What is the safest way to buy after reading about ${page.shortTopic}?`,
      a: `Use the guide to narrow the field to one or two credible providers, then verify the live checkout page before paying. Make note of the total billed amount, the device allowance, and what the renewal language says. That final check is the step that protects shoppers from buying a plan that looked cheap in a headline but turns out to be poor value in the cart.`,
    },
  ];
}

function opportunitySections(page) {
  return [
    {
      eyebrow: "Direct Answer",
      title: `${page.h1} in plain English`,
      paragraphs: [
        `${page.shortAnswer} In the current U.S. and U.K. consumer market, the strongest-value plans usually come from longer terms offered by mainstream providers rather than from sketchy ultra-cheap brands. That means a sensible buyer should look at billed totals, device limits, and refund policies together instead of treating the lowest effective monthly price as the whole story.`,
        `${page.marketView} A shopper comparing NordVPN, ExpressVPN, Surfshark, CyberGhost, and IPVanish will notice that the market usually clusters around roughly $12.99 to $15.45 on monthly plans, then drops sharply on annual or multi-year subscriptions. That spread is exactly why intent matters: a short-term traveler might rationally pay monthly, while a household that needs year-round protection should usually avoid month-to-month pricing.`,
        `${page.angle} Readers also need to account for the fact that many providers now bundle privacy extras, password tools, or identity services into higher tiers. Those bundles can create real value, but only if the buyer would otherwise pay for those services separately.`,
      ],
      list: page.takeaways,
    },
    {
      eyebrow: "2026 Pricing Snapshot",
      title: "What the mainstream market looks like right now",
      paragraphs: [
        `NordVPN currently sits around ${providerPricing.NordVPN.monthly} on its monthly Basic plan, with a much lower long-term rate at ${providerPricing.NordVPN.longTerm}. ExpressVPN positions itself as a premium option, with its Basic tier showing ${providerPricing.ExpressVPN.monthly} and a long-term deal around ${providerPricing.ExpressVPN.longTerm}. Those two brands are useful anchor points because they show how the market separates premium branding from promo-led value.`,
        `Surfshark continues to compete aggressively on price, with official 2026 pricing references showing ${providerPricing.Surfshark.monthly} month-to-month and a very low ${providerPricing.Surfshark.longTerm} on its long-term Starter offer. CyberGhost also stays highly competitive, with ${providerPricing.CyberGhost.monthly} monthly pricing and ${providerPricing.CyberGhost.longTerm} on its strongest long-term term. For pure headline savings, those two brands tend to sit near the value end of the mainstream market.`,
        `IPVanish remains relevant because public 2026 pricing checks place it around ${providerPricing.IPVanish.monthly} monthly, ${providerPricing.IPVanish.annual}, and ${providerPricing.IPVanish.longTerm}. That makes it a good example of a provider that can look expensive on monthly billing but much more attractive when the shopper is comfortable with a longer term. Taken together, these five providers establish the pricing band most readers should treat as normal in 2026.`,
      ],
    },
    {
      eyebrow: "How To Compare",
      title: `How to evaluate ${page.shortTopic} without getting distracted by promo banners`,
      paragraphs: [
        `${page.comparisonView} The right way to compare a VPN is to separate three questions: what it costs on day one, what it costs if you stay, and whether the product quality justifies either number. Too many comparison pages stop after the first question, which is why shoppers regularly end up buying plans that looked like bargains but feel annoying or overpriced a few months later.`,
        `For most readers, device coverage and ease of use are not side issues. A slightly more expensive VPN can still be the better value if it supports more devices, handles streaming and travel more reliably, or gives less technical users a cleaner app experience. That is especially true in households where one subscription will be shared across phones, laptops, tablets, and smart TVs.`,
        `Privacy still matters in a pricing guide because a cheap service with weak transparency can carry a hidden cost of its own. If a provider is vague about logging, diagnostics, or audits, the reader is effectively accepting more uncertainty in exchange for a lower promo rate. That may be acceptable for some buyers, but it should always be a conscious tradeoff rather than an accidental one.`,
      ],
    },
    {
      eyebrow: "Hidden Costs",
      title: "Where VPN pricing gets more expensive than it first appears",
      paragraphs: [
        `${page.hiddenCost} Renewal inflation is the biggest issue, but it is not the only one. A provider can also seem inexpensive until the buyer realizes that the cheapest plan excludes features they actually need, or that the service works well on a laptop but feels awkward on streaming devices, hotel Wi-Fi, or work machines.`,
        `Billing shape matters too. A plan advertised at two or three dollars per month can still require a meaningful upfront payment, and that can be uncomfortable for shoppers who only wanted a short test period. In business settings, the same issue shows up as per-user multiplication, where a fair-looking seat price becomes a much larger annual commitment once the whole team is counted.`,
        `U.K. readers may also see slightly different effective totals because VAT and currency conversion can change the billed figure at checkout. That does not always make the plan bad value, but it does mean the sensible decision is based on the final cart total, not on the lowest dollar amount repeated across affiliate-style pages.`,
      ],
    },
    {
      eyebrow: "Best-Fit Guidance",
      title: `Who should prioritize ${page.shortTopic}`,
      paragraphs: [
        `${page.bestFit} Readers who care most about flexibility should normally keep monthly pricing in view, but readers who expect to stay subscribed for a year or more should usually evaluate annual or multi-year offers first. That is where the mainstream market still delivers the biggest savings, especially when the provider also offers a real 30-day or 45-day refund period.`,
        `A second group that benefits from this topic is shoppers who are comparing a premium provider against a value-focused one. In those situations, the right answer is rarely about which brand is “best” in the abstract. It is about whether the extra cost buys a meaningful improvement in usability, privacy confidence, support, or travel and streaming reliability for the exact scenario the user cares about.`,
        `Businesses and freelancers should also treat pricing as one part of operational risk. A VPN that fails during remote-work sessions, blocks common SaaS tools, or confuses non-technical staff is not actually cheap, even if its per-user rate looks attractive. Reliability and support have a financial value of their own.`,
      ],
    },
    {
      eyebrow: "Bottom Line",
      title: "What a smart purchase looks like from here",
      paragraphs: [
        `${page.bottomLine} In practical terms, the strongest shortlist for most readers starts with one premium brand, one value brand, and one middle-ground option. That gives enough contrast to see whether the extra money buys something real or whether a cheaper plan already covers the job well enough.`,
        `The safest final move is to verify the live checkout page, confirm the refund window, and test the apps on the devices that matter most during the first days of the subscription. That process is more reliable than relying on any single ranking because it lets the buyer see whether the value promised in the pricing table holds up in real use.`,
        `That is why this guide treats VPN cost as a decision framework rather than a coupon list. Price matters, but price only becomes value when the service is trustworthy, usable, and appropriately matched to the user’s real-world needs.`,
      ],
    },
  ];
}

const searchConsolePagesRaw = [
  {
    slug: "vpn-pricing-guide",
    title: "VPN Pricing Guide 2025-2026",
    description: "VPN pricing guide for 2025-2026 covering monthly plans, annual deals, renewals, and which mainstream VPN tiers offer the best real value.",
    parent: hubs[0],
    shortTopic: "vpn pricing",
    shortAnswer: "VPN pricing in 2026 generally ranges from about $12.99 to $15.45 on monthly plans and roughly $1.99 to $4.59 per month on the strongest long-term deals from mainstream providers.",
    marketView: "That pricing spread explains why search interest around VPN pricing is so commercially strong: the market looks simple at first, but the checkout math changes dramatically once plan length and renewals enter the picture.",
    angle: "For readers who want a broad market overview, the goal is not to find the single cheapest row in a table. It is to understand where premium pricing is justified and where it mostly reflects branding or bundled extras.",
    comparisonView: "On a broad pricing page, the key is to compare category anchors rather than isolated coupon numbers.",
    hiddenCost: "The hidden cost on a general pricing page is often false equivalence, where shoppers assume every low monthly-equivalent rate is equally safe, flexible, or usable.",
    bestFit: "This topic is ideal for readers at the very start of the buying journey who want to understand what counts as a normal price before narrowing the field.",
    bottomLine: "A sensible VPN pricing guide should leave the reader with a pricing range, a shortlist, and a clearer sense of when paying more is justified.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "vpnCosts",
  },
  {
    slug: "vpn-price-comparison",
    title: "VPN Price Comparison",
    description: "VPN price comparison page with side-by-side plan math for NordVPN, ExpressVPN, Surfshark, CyberGhost, and IPVanish across monthly and long-term tiers.",
    parent: hubs[0],
    shortTopic: "vpn price comparison",
    shortAnswer: "A good VPN price comparison shows that mainstream monthly plans cluster around $12.99 to $15.45, while the strongest long-term offers fall between roughly $1.99 and $3.49 per month equivalent.",
    marketView: "What matters is not only who is cheapest, but how much trust, device support, and refund flexibility the buyer gives up or gains at each price point.",
    angle: "This page works best as a side-by-side decision aid for readers who are already comparing two or three providers and want the pricing structure in one place.",
    comparisonView: "The reader should be able to see promo price, long-term rate, device allowance, and refund policy without hopping between five tabs.",
    hiddenCost: "The hidden cost on comparison pages is usually tunnel vision, where the buyer optimizes for monthly-equivalent price and ignores the full billed amount or support quality.",
    bestFit: "This page is for shoppers who are no longer asking whether they need a VPN at all and are instead trying to decide which provider wins on value.",
    bottomLine: "The best VPN price comparison is the one that makes tradeoffs visible instead of pretending price alone produces a universal winner.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "vpnCosts",
  },
  {
    slug: "how-much-does-vpn-cost",
    title: "How Much Does a VPN Cost?",
    description: "How much does a VPN cost in 2026? Direct answer page covering monthly pricing, annual spend, and how mainstream providers differ by value and renewal risk.",
    parent: hubs[0],
    shortTopic: "how much a vpn costs",
    shortAnswer: "For most mainstream consumer VPNs, a one-month plan costs about $12.99 to $15.45, while annualized value plans usually land around $24 to $81 per year depending on term length and provider.",
    marketView: "That range is wide enough to confuse first-time buyers, but narrow enough that shoppers can still learn what counts as normal very quickly.",
    angle: "This is the direct-answer page for the biggest cost keyword, so the content needs to answer fast and then explain what changes the number.",
    comparisonView: "The most useful comparison is monthly versus long-term, not one brand versus another in isolation.",
    hiddenCost: "The hidden cost is assuming the cheapest annualized number is the same as the best annualized value.",
    bestFit: "This page is ideal for first-time buyers, budget-conscious households, and readers deciding whether a VPN belongs in their broader security budget.",
    bottomLine: "The right answer to how much a VPN costs is a range, not a single figure, and the right purchase depends on whether the buyer values flexibility or lower annual spend.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "vpnCosts",
  },
  {
    slug: "vpn-cost-per-month",
    title: "VPN Cost Per Month",
    description: "VPN cost per month explained with direct monthly pricing, annual-equivalent math, and when paying monthly still makes sense for VPN buyers.",
    parent: hubs[0],
    shortTopic: "vpn cost per month",
    shortAnswer: "VPN cost per month usually means either the real month-to-month price of around $12.99 to $15.45 or the annualized equivalent of a longer plan, which can fall below $5 and sometimes below $2.",
    marketView: "That distinction matters because many readers search for a monthly figure while providers advertise a long-term monthly equivalent instead of the actual monthly checkout price.",
    angle: "The aim here is to separate true monthly billing from marketing shorthand so readers do not compare two different things by accident.",
    comparisonView: "A useful monthly-cost page has to show the difference between pay-monthly flexibility and annualized pricing language.",
    hiddenCost: "The hidden cost is confusion itself: shoppers often think a long-term equivalent is a plan they can actually pay month by month.",
    bestFit: "This page best serves readers who need flexibility, are testing a provider, or simply want to understand what monthly really means in VPN pricing.",
    bottomLine: "Monthly cost is only useful when the page clearly separates actual monthly billing from long-term monthly equivalents.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "vpnCosts",
  },
  {
    slug: "cheapest-vpn-2025",
    title: "Cheapest VPN 2025",
    description: "Cheapest VPN 2025 ranking based on mainstream pricing, long-term value, refund windows, and where low-cost VPN plans still feel trustworthy.",
    parent: hubs[0],
    shortTopic: "the cheapest vpn in 2025",
    shortAnswer: "Among well-known providers, Surfshark and CyberGhost usually lead the mainstream market on long-term headline price, while NordVPN and IPVanish often sit close behind depending on plan structure.",
    marketView: "The challenge with a cheapest-VPN page is separating legitimate value brands from services that are simply cheap because they ask the buyer to accept more uncertainty.",
    angle: "This page therefore ranks value, not just the lowest sticker price.",
    comparisonView: "The reader should compare low-cost plans against refund policy, device count, and privacy confidence, not just raw dollars.",
    hiddenCost: "The hidden cost on cheap VPN pages is often quality drift: slower apps, weaker streaming, or less confidence in long-run transparency.",
    bestFit: "This page is for budget-led shoppers who still want a mainstream brand rather than a questionable ultra-cheap alternative.",
    bottomLine: "The cheapest worthwhile VPN is the one that stays credible after the low promo price stops being the only thing in the frame.",
    providers: ["Surfshark", "CyberGhost", "NordVPN", "IPVanish", "ExpressVPN"],
    links: "vpnCosts",
  },
  {
    slug: "business-vpn-cost",
    title: "Business VPN Cost",
    description: "Business VPN cost guide covering company pricing, team budgeting, seat models, and what small businesses should expect to pay for secure VPN access.",
    parent: hubs[0],
    shortTopic: "business vpn cost",
    shortAnswer: "A small business VPN can cost anywhere from a consumer-style plan shared across a tiny team to a per-user model that climbs quickly once device counts, admin controls, and support expectations grow.",
    marketView: "The business market is less about the cheapest long-term promo and more about how seat count, management overhead, and remote-work reliability change the total budget.",
    angle: "This page focuses on how companies should think about VPN spend rather than only on consumer promo numbers.",
    comparisonView: "The most useful comparison is per-seat math versus all-in household-style plans, plus the operational value of stronger admin controls.",
    hiddenCost: "The hidden cost for companies is downtime, onboarding friction, and support drag when the cheapest option is not built for teams.",
    bestFit: "This page is for founders, managers, and operations leads pricing out a VPN for a small or mid-sized workforce.",
    bottomLine: "A business VPN is worth pricing by total team impact, not just by the lowest nominal seat price.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "business",
  },
  {
    slug: "vpn-for-small-business",
    title: "VPN for Small Business Cost",
    description: "VPN for small business pricing guide with cost ranges, team-use considerations, and when a small company should pay more for easier management.",
    parent: hubs[0],
    shortTopic: "vpn for small business",
    shortAnswer: "For a small business, VPN costs can stay modest if the team is tiny and the provider offers generous device allowances, but the budget rises fast when clear admin control and smoother remote support are required.",
    marketView: "That is why small-business VPN decisions often live in the overlap between consumer affordability and business-grade reliability.",
    angle: "This page is written for teams that do not want enterprise overhead but still need something more deliberate than a casual personal subscription.",
    comparisonView: "The comparison should focus on team size, device sprawl, and whether the owner needs centralized oversight or just secure connections.",
    hiddenCost: "The hidden cost is wasted staff time when a VPN is cheap but awkward for onboarding, travel, or customer support.",
    bestFit: "This page suits agencies, consultancies, e-commerce teams, and remote-first small firms.",
    bottomLine: "The best small-business VPN plan is normally the one that protects staff without turning setup and maintenance into a second job.",
    providers: ["NordVPN", "Surfshark", "ExpressVPN", "IPVanish", "CyberGhost"],
    links: "business",
  },
  {
    slug: "enterprise-vpn-cost",
    title: "Enterprise VPN Cost",
    description: "Enterprise VPN cost guide for larger teams comparing per-user pricing logic, support expectations, and why enterprise security budgets differ from consumer VPN math.",
    parent: hubs[0],
    shortTopic: "enterprise vpn cost",
    shortAnswer: "Enterprise VPN cost is less about headline promo pricing and more about seat count, deployment complexity, compliance expectations, support contracts, and how much productivity risk the organization is trying to remove.",
    marketView: "That means enterprise VPN budgeting should not be compared too literally with consumer VPN coupon pages, even if some well-known brands overlap.",
    angle: "The job here is to help readers understand why enterprise pricing looks different and when a team should stop thinking like a household buyer.",
    comparisonView: "The useful comparison is between per-user cost, management overhead, and the cost of outages or security gaps, not between two flashy consumer discounts.",
    hiddenCost: "The hidden cost is underbuying: a cheap plan that creates policy, support, or compliance headaches can become the more expensive option very quickly.",
    bestFit: "This page serves larger SMBs, security-conscious organizations, and decision-makers moving from ad hoc remote access to something more formal.",
    bottomLine: "Enterprise VPN spend only makes sense when matched to risk, scale, and the real cost of operational friction.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "business",
  },
  {
    slug: "vpn-cost-per-user",
    title: "VPN Cost Per User",
    description: "VPN cost per user explained for businesses and teams, including seat math, device policies, and when unlimited-device plans actually save money.",
    parent: hubs[0],
    shortTopic: "vpn cost per user",
    shortAnswer: "VPN cost per user can range from very low on a generously shared consumer-style plan to much higher on a managed business rollout once seat count, admin controls, and support are included.",
    marketView: "Per-user math matters because a team of five and a team of fifty can look at the same headline price and reach completely different conclusions.",
    angle: "This page is built to show how seat-based thinking changes the buying process.",
    comparisonView: "The comparison should look at effective cost per protected worker, not just the posted cost per subscription.",
    hiddenCost: "The hidden cost is assuming unlimited devices automatically means the lowest user cost even when workflow, monitoring, or support requirements say otherwise.",
    bestFit: "This page is best for team leads, founders, finance managers, and IT generalists modeling access costs.",
    bottomLine: "Per-user VPN cost is only useful when it is tied back to the way the organization actually uses devices and supports staff.",
    providers: ["Surfshark", "IPVanish", "NordVPN", "ExpressVPN", "CyberGhost"],
    links: "business",
  },
  {
    slug: "nordvpn-vs-expressvpn-cost",
    title: "NordVPN vs ExpressVPN Cost",
    description: "NordVPN vs ExpressVPN cost comparison covering monthly pricing, long-term rates, renewal logic, and which premium VPN offers better overall value.",
    parent: hubs[4],
    type: "comparison",
    shortTopic: "nordvpn vs expressvpn cost",
    shortAnswer: "NordVPN generally undercuts ExpressVPN on long-term pricing, while ExpressVPN keeps a stronger premium position built around polish, consistency, and brand trust.",
    marketView: "This is one of the most valuable comparisons because both brands are well known, credible, and often shortlisted by readers willing to pay for a premium experience.",
    angle: "The job of the page is to show when NordVPN's lower long-term price outweighs ExpressVPN's premium framing and when it does not.",
    comparisonView: "The meaningful comparison is not just price, but whether the extra spend on ExpressVPN buys enough comfort or reliability for the specific buyer.",
    hiddenCost: "The hidden cost is overbuying premium polish when the user would have been just as well served by the less expensive option.",
    bestFit: "This page suits readers choosing between two premium-leaning brands rather than hunting for the lowest price in the market.",
    bottomLine: "NordVPN usually wins on price efficiency, but ExpressVPN can still justify its premium if the buyer values its specific experience enough.",
    leftBrand: "NordVPN",
    rightBrand: "ExpressVPN",
    comparisonRows: [
      ["Monthly starting point", providerPricing.NordVPN.monthly, providerPricing.ExpressVPN.monthly, "Useful for short-term flexibility"],
      ["Best long-term rate", providerPricing.NordVPN.longTerm, providerPricing.ExpressVPN.longTerm, "This usually decides value for year-round users"],
      ["Device allowance", providerPricing.NordVPN.devices, providerPricing.ExpressVPN.devices, "Important for households and mixed-device setups"],
      ["Refund policy", providerPricing.NordVPN.refund, providerPricing.ExpressVPN.refund, "Lets readers test the app experience with lower risk"],
    ],
    links: "comparisons",
  },
  {
    slug: "nordvpn-vs-surfshark-cost",
    title: "NordVPN vs Surfshark Cost",
    description: "NordVPN vs Surfshark cost comparison for readers weighing long-term value, device flexibility, and whether lower pricing or broader features matter more.",
    parent: hubs[4],
    type: "comparison",
    shortTopic: "nordvpn vs surfshark cost",
    shortAnswer: "Surfshark usually wins on raw long-term headline price and unlimited-device appeal, while NordVPN often feels more premium and structured in its tiering.",
    marketView: "This comparison matters because both brands are strong value candidates, but they express value differently.",
    angle: "The page should help readers understand when Surfshark's lower pricing beats NordVPN's premium balance and when NordVPN's steadier framing is worth more.",
    comparisonView: "The comparison needs to surface price, device count, and perceived trust rather than just coupon noise.",
    hiddenCost: "The hidden cost is assuming the absolute lowest long-term rate automatically means the better household experience.",
    bestFit: "This page is ideal for families, multi-device users, and shoppers choosing between two of the most common consumer shortlists.",
    bottomLine: "Surfshark often wins on budget and flexibility, while NordVPN remains compelling for buyers who want a more premium-feeling middle ground.",
    leftBrand: "NordVPN",
    rightBrand: "Surfshark",
    comparisonRows: [
      ["Monthly starting point", providerPricing.NordVPN.monthly, providerPricing.Surfshark.monthly, "Helps short-term buyers compare flexibility"],
      ["Best long-term rate", providerPricing.NordVPN.longTerm, providerPricing.Surfshark.longTerm, "Core value comparison for long-term users"],
      ["Device allowance", providerPricing.NordVPN.devices, providerPricing.Surfshark.devices, "A key difference for families and shared households"],
      ["Refund policy", providerPricing.NordVPN.refund, providerPricing.Surfshark.refund, "Important for testing before committing"],
    ],
    links: "comparisons",
  },
  {
    slug: "expressvpn-vs-surfshark-cost",
    title: "ExpressVPN vs Surfshark Cost",
    description: "ExpressVPN vs Surfshark cost comparison showing where premium pricing, unlimited devices, and long-term value create very different buying outcomes.",
    parent: hubs[4],
    type: "comparison",
    shortTopic: "expressvpn vs surfshark cost",
    shortAnswer: "ExpressVPN is usually the more premium-priced option, while Surfshark aims at aggressive value with lower long-term pricing and unlimited-device positioning.",
    marketView: "That makes this one of the clearest premium-versus-value comparisons in the mainstream VPN market.",
    angle: "The question is not who is cheaper; it is whether ExpressVPN's extra polish is worth the jump over Surfshark for the reader's real use case.",
    comparisonView: "Readers should compare total billed cost, device count, and whether they need premium polish or simply the best mainstream value.",
    hiddenCost: "The hidden cost is paying for premium branding when the value-oriented option already solves the job well enough.",
    bestFit: "This page is strongest for households, streamers, and budget-conscious buyers considering whether to stretch upward.",
    bottomLine: "Surfshark usually wins the price case, while ExpressVPN only wins the value case if the buyer truly benefits from its premium feel.",
    leftBrand: "ExpressVPN",
    rightBrand: "Surfshark",
    comparisonRows: [
      ["Monthly starting point", providerPricing.ExpressVPN.monthly, providerPricing.Surfshark.monthly, "Shows the premium gap immediately"],
      ["Best long-term rate", providerPricing.ExpressVPN.longTerm, providerPricing.Surfshark.longTerm, "This is where Surfshark often creates separation"],
      ["Device allowance", providerPricing.ExpressVPN.devices, providerPricing.Surfshark.devices, "Relevant for shared use and smart-home setups"],
      ["Refund policy", providerPricing.ExpressVPN.refund, providerPricing.Surfshark.refund, "Useful for testing whether premium polish matters"],
    ],
    links: "comparisons",
  },
  {
    slug: "free-vs-paid-vpn",
    title: "Free vs Paid VPN True Cost",
    description: "Free vs paid VPN cost analysis covering privacy tradeoffs, data limits, ads, speed compromises, and where paying for a VPN actually saves frustration.",
    parent: hubs[4],
    type: "comparison",
    shortTopic: "free vs paid vpn",
    shortAnswer: "Free VPNs cost less in cash but often cost more in limits, reliability, speed, ads, and uncertainty, while paid VPNs shift the tradeoff toward predictability and broader functionality.",
    marketView: "This is less a brand comparison than a value comparison between two very different product models.",
    angle: "The page should explain why zero-dollar pricing is not the same thing as zero cost in practice.",
    comparisonView: "The right comparison is cash price versus hidden friction, not cash price versus cash price.",
    hiddenCost: "The hidden cost on free VPNs often arrives as data caps, server congestion, weaker streaming, fewer device options, or less confidence in how the service is funded.",
    bestFit: "This page helps first-time buyers who wonder if paying at all is necessary.",
    bottomLine: "A paid VPN is usually worth it when the reader values predictable performance, stronger trust signals, and a product that is easier to live with.",
    leftBrand: "Free VPN",
    rightBrand: "Paid VPN",
    comparisonRows: [
      ["Cash price", "$0 upfront", "$1.99 to $15.45 depending on plan length", "Cheap in cash is not always cheap in practice"],
      ["Speed and reliability", "Often limited or inconsistent", "Usually stronger and more predictable", "Performance changes the day-to-day experience"],
      ["Privacy confidence", "Varies widely and can be unclear", "Usually clearer on mainstream providers", "Trust is part of the value equation"],
      ["Best fit", "Light or temporary use", "Regular browsing, travel, streaming, and remote work", "Use case should decide whether paying is worth it"],
    ],
    links: "comparisons",
  },
  {
    slug: "vpn-for-streaming-cost",
    title: "VPN for Streaming Cost",
    description: "VPN for streaming cost guide explaining what streamers should expect to pay, which price tiers still stream well, and where paying more actually helps.",
    parent: hubs[2],
    shortTopic: "vpn for streaming cost",
    shortAnswer: "A good streaming VPN usually costs mainstream money rather than bargain-basement money, with the sweet spot often sitting on long-term plans between roughly $2 and $5 per month equivalent.",
    marketView: "Streaming is one of the clearest cases where a little extra spend can still produce better everyday value.",
    angle: "The point of this page is to show when low-cost streaming plans are good enough and when stronger apps or broader coverage justify more spend.",
    comparisonView: "The useful comparison is not just cost, but cost relative to consistency on TVs, laptops, phones, and travel networks.",
    hiddenCost: "The hidden cost is paying too little for a service that struggles precisely when the user wants to watch something.",
    bestFit: "This page serves streamers, cord-cutters, and travelers who want reliable access without overspending.",
    bottomLine: "The best streaming VPN cost is the one that keeps the service usable enough that the subscription actually earns its keep.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "useCases",
  },
  {
    slug: "vpn-for-gaming-cost",
    title: "VPN for Gaming Cost",
    description: "VPN for gaming cost guide covering latency, performance tradeoffs, and what gamers should realistically pay for usable VPN protection.",
    parent: hubs[2],
    shortTopic: "vpn for gaming cost",
    shortAnswer: "For gaming, the best-value VPN usually sits in the mainstream paid market, where the buyer can balance cost against latency, server reliability, and app control instead of chasing the cheapest plan possible.",
    marketView: "Gaming is a good example of why a low monthly-equivalent price does not automatically equal better value.",
    angle: "The page should help gamers understand when paying more protects performance and when it mostly adds extras they do not need.",
    comparisonView: "The real comparison is cost versus latency tolerance, not cost versus cost alone.",
    hiddenCost: "The hidden cost is poor performance, which can make a cheap VPN feel expensive very quickly.",
    bestFit: "This page suits competitive players, casual console users, and PC gamers who need a clearer sense of what price level is justified.",
    bottomLine: "Gaming VPN value comes from stable performance first and price second.",
    providers: ["NordVPN", "Surfshark", "ExpressVPN", "CyberGhost", "IPVanish"],
    links: "useCases",
  },
  {
    slug: "vpn-for-remote-work",
    title: "VPN for Remote Work Cost",
    description: "VPN for remote work cost guide for freelancers and distributed teams comparing home-office security, reliability, and subscription value.",
    parent: hubs[2],
    shortTopic: "vpn for remote work cost",
    shortAnswer: "For remote work, the best-value VPN is usually the one that protects day-to-day workflows reliably, even if it is not the absolute cheapest option in the market.",
    marketView: "This is a cost topic where uptime, support, and device flexibility can matter more than shaving off one extra dollar per month.",
    angle: "The content should help freelancers and remote teams price a VPN as part of productivity, not just as a privacy impulse buy.",
    comparisonView: "The right comparison is price versus stability on home Wi-Fi, travel connections, and shared work devices.",
    hiddenCost: "The hidden cost is downtime, login friction, and unreliable app behavior during work hours.",
    bestFit: "This page is best for freelancers, consultants, digital nomads, and remote-first teams.",
    bottomLine: "Remote-work VPN value is mostly about whether the product keeps work moving without adding support headaches.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "useCases",
  },
  {
    slug: "vpn-for-travel-cost",
    title: "VPN for Travel Cost",
    description: "VPN for travel cost guide covering short-term versus annual value, hotel Wi-Fi safety, and what travelers should pay for a useful VPN.",
    parent: hubs[2],
    shortTopic: "vpn for travel cost",
    shortAnswer: "Travel VPN cost depends heavily on frequency: occasional travelers may justify a monthly plan, while regular travelers usually save far more on annual or long-term pricing.",
    marketView: "Travel is one of the few use cases where monthly pricing can still make real sense, but only when the trip is genuinely short.",
    angle: "This page should help readers avoid buying a long contract for a temporary trip or overpaying monthly for year-round travel habits.",
    comparisonView: "The key comparison is travel frequency against the real billed cost, plus whether the service works well on hotel, airport, and public Wi-Fi.",
    hiddenCost: "The hidden cost is buying the wrong term length for the way the user actually travels.",
    bestFit: "This page is for vacation travelers, frequent flyers, and workers who routinely rely on untrusted networks.",
    bottomLine: "A travel VPN is cheapest when the billing term matches the travel pattern rather than the lowest monthly-equivalent marketing line.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "useCases",
  },
  {
    slug: "vpn-cost-worth-it",
    title: "Is a VPN Worth the Cost?",
    description: "Is a VPN worth the cost? Honest analysis of when paying for a VPN makes sense, when it does not, and which users get the clearest value.",
    parent: hubs[3],
    shortTopic: "whether a vpn is worth the cost",
    shortAnswer: "A VPN is worth the cost when the user actually benefits from safer public Wi-Fi use, better privacy, travel flexibility, or smoother streaming and remote-work habits often enough to justify the subscription.",
    marketView: "This is fundamentally a value question rather than a raw pricing question.",
    angle: "The content should help readers understand that the answer changes depending on habits, not on marketing claims.",
    comparisonView: "The best comparison is between expected use and annual spend, not between two promo banners.",
    hiddenCost: "The hidden cost is paying for a tool that the reader barely uses or misunderstanding what a VPN can and cannot protect.",
    bestFit: "This page is for skeptical first-time buyers who need an honest cost-benefit view.",
    bottomLine: "A VPN is worth it when it becomes part of a real routine, not when it sits unused after a discount-driven impulse purchase.",
    providers: ["NordVPN", "Surfshark", "ExpressVPN", "CyberGhost", "IPVanish"],
    links: "support",
  },
  {
    slug: "vpn-free-trial-guide",
    title: "VPN Free Trial Guide",
    description: "VPN free trial guide covering money-back guarantees, short-term testing, and how to compare trial-style offers without overpaying.",
    parent: hubs[0],
    shortTopic: "vpn free trials",
    shortAnswer: "Most mainstream VPNs rely more on money-back guarantees than true free trials, which means readers should evaluate the refund policy as carefully as the headline price.",
    marketView: "That distinction matters because a refund-backed plan can still be the smartest way to test a VPN if the buyer understands the billing terms.",
    angle: "This page explains how to compare free-trial style offers without confusing them with risk-free long-term promotions.",
    comparisonView: "The comparison should center on refund window, card charge timing, and cancellation clarity.",
    hiddenCost: "The hidden cost is assuming a refund-backed offer behaves like a free product when the user is still charged upfront.",
    bestFit: "This page is for cautious buyers who want to test before committing.",
    bottomLine: "A VPN free-trial strategy only works when the user understands whether they are using a true free trial or a money-back guarantee.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "vpnCosts",
  },
  {
    slug: "vpn-cost-by-country",
    title: "VPN Cost by Country",
    description: "VPN cost by country guide comparing U.S., U.K., and other market differences in pricing, VAT, currency, and regional checkout expectations.",
    parent: hubs[0],
    shortTopic: "vpn cost by country",
    shortAnswer: "VPN cost by country often looks similar in headline marketing but can feel different at checkout once VAT, currency conversion, and regional promotions are factored in.",
    marketView: "This is particularly relevant for a site serving both U.S. and U.K. readers.",
    angle: "The page should show that price is global in marketing but local in billing reality.",
    comparisonView: "The meaningful comparison is final billed total and renewal comfort by country, not just the advertised dollar amount.",
    hiddenCost: "The hidden cost is assuming a U.S.-centric coupon or headline rate will map cleanly to a U.K. checkout.",
    bestFit: "This page helps international buyers, expatriates, and U.K. readers comparing provider economics more carefully.",
    bottomLine: "Country-level VPN pricing matters because the billed reality can differ even when the product and marketing message are the same.",
    providers: ["NordVPN", "ExpressVPN", "Surfshark", "CyberGhost", "IPVanish"],
    links: "support",
  },
];

function buildSearchConsolePages() {
  return searchConsolePagesRaw.map((item, index) => {
    const isComparison = item.type === "comparison";
    const tableData = isComparison
      ? {
          caption: `${item.title} comparison table`,
          headers: ["Decision area", item.leftBrand, item.rightBrand, "Why it matters"],
          rows: item.comparisonRows,
        }
      : pricingOverviewTable(`${item.title} pricing table`, item.providers);

    return {
      route: `/pages/${item.slug}/`,
      title: item.title,
      h1: item.title,
      description: item.description,
      type: item.type || "article",
      shortTopic: item.shortTopic,
      kicker: item.parent.title,
      heroImage: ["assets/images/hero-vpn-pricing.svg", "assets/images/hero-compare-matrix.svg", "assets/images/hero-remote-shield.svg", "assets/images/hero-cyber-ops.svg"][index % 4],
      heroTone: item.parent === hubs[4] ? "compare" : item.parent === hubs[2] ? "usecase" : item.parent === hubs[3] ? "cyber" : "pricing",
      parent: item.parent,
      leftBrand: item.leftBrand,
      rightBrand: item.rightBrand,
      stats: [
        { label: "Primary intent", value: item.shortTopic, note: "Targeted from Search Console demand clusters." },
        { label: "Core buyer lens", value: item.parent.title, note: "Mapped into an existing topical hub for stronger internal linking." },
        { label: "Pricing band", value: "$1.99 to $15.45", note: "Mainstream VPN market range referenced on this page." },
        { label: "Updated", value: lastmod, note: "Pricing language refreshed for the current editorial cycle." },
      ],
      takeaways: [
        item.shortAnswer,
        "The best VPN deal is usually the one that still looks reasonable after renewal and device-count reality are considered.",
        "Use refund windows and shortlists to test value instead of relying on coupon-page hype alone.",
      ],
      costFocus: "Real billed total, not just effective monthly marketing",
      privacyFocus: "Audit visibility, logging clarity, and trust posture",
      useFocus: "Device fit, travel reliability, streaming or work friction",
      fitFocus: "Which type of reader benefits most from the plan",
      chartBars: [
        { label: "Price clarity", value: item.parent === hubs[4] ? "86/100" : "82/100" },
        { label: "Trust", value: "79/100" },
        { label: "Fit", value: item.parent === hubs[2] ? "85/100" : "80/100" },
        { label: "Savings", value: "84/100" },
      ],
      longSections: opportunitySections(item),
      faqs: opportunityFaqs(item),
      tableData,
      contextLinks: contextLinksFor(item.links),
      metaTitle: `${item.title} | VPNCostGuide`,
    };
  });
}

const allArticlePages = [
  ...buildCostPages(),
  ...buildReviewPages(),
  ...buildUseCasePages(),
  ...buildCyberPages(),
  ...buildComparisonPages(),
  ...buildToolPages(),
  ...buildSearchConsolePages(),
];

for (const page of allArticlePages) {
  page.related = relatedCards(allArticlePages, page.route, page.parent.route);
}

function hubCards(clusterRoute) {
  return allArticlePages
    .filter((page) => page.route.startsWith(clusterRoute) || page.parent?.route === clusterRoute)
    .sort((left, right) => {
      const leftBoost = left.route.startsWith("/pages/") ? 1 : 0;
      const rightBoost = right.route.startsWith("/pages/") ? 1 : 0;
      return rightBoost - leftBoost;
    })
    .slice(0, 16)
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
  metaTitle: "VPN Cost Guide: Premium VPN Pricing & Privacy",
  h1: "VPN Cost Guide for U.S. and U.K. Privacy, Pricing, and Cybersecurity Decisions",
  description:
    "Premium guides, reviews, comparisons, and calculators for readers in the U.S. and U.K. comparing VPN subscriptions, privacy tools, and online safety costs.",
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
      { label: "Audience", value: "U.S. and U.K.", note: "Core pages are written for American and British buying patterns." },
      { label: "Publishing standard", value: "AdSense-ready", note: "Legal pages, author signals, sources, FAQs, and trust-first layouts." },
    ])}
    <section class="panel home-intro">
      <div class="section-heading">
        <span class="eyebrow">Why This Site Exists</span>
        <h2>A premium VPN website built for trust, not clutter</h2>
      </div>
      <p>VPN Cost Guide is designed to become a reference site for readers in the United States and the United Kingdom comparing VPN subscriptions, digital privacy tools, and personal cybersecurity spending. Instead of thin affiliate-style blurbs, we build long-form pages with price context, fit analysis, privacy signals, FAQ coverage, and conversion-ready layouts that still feel editorial.</p>
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
    .flatMap((page) => {
      const cleanRoute = page.route.slice(0, -1);
      return [`${cleanRoute}/index.html ${cleanRoute} 301`, `${page.route} ${cleanRoute} 301`];
    });
  return [
    "http://vpncostguide.com/* https://vpncostguide.com/:splat 301",
    "http://www.vpncostguide.com/* https://vpncostguide.com/:splat 301",
    "https://www.vpncostguide.com/* https://vpncostguide.com/:splat 301",
    "/index.html / 301",
    ...pageRedirects,
    "/404.html /404 404",
  ].join("\n");
}

function headersContent() {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
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
  await fs.copyFile(path.join(root, "assets/styles.css"), path.join(root, "styles.css"));
  await fs.copyFile(path.join(root, "assets/main.js"), path.join(root, "main.js"));
  await fs.copyFile(path.join(root, "assets/icons/favicon.ico"), path.join(root, "favicon.ico"));
  await fs.writeFile(path.join(root, "404.html"), pageShell(page404(), pageContent(page404(), "404.html"), "404.html"));
  await fs.writeFile(
    path.join(root, "walkthrough.md"),
    `# VPN Cost Guide Walkthrough

- Domain: ${domain}
- Pages generated: ${results.length}
- Architecture: extensionless routes with folder-based output, root-level stylesheet and script copies, and a single shared asset layer.
- Design direction: dark premium UI using navy, black, cyan, and green with large hero visuals, charts, cards, and trust sections.
- Compliance goals: no public .html canonicals, no www canonicals, no http URLs, no query-indexable search paths, no ad placeholders, static JSON-LD in page head only.
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
