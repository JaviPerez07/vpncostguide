const COOKIE_NAME = "vpcg_cookie_pref";
const COOKIE_STORAGE_KEY = "vpcg_cookie_pref";

function parseSchema() {
  const node = document.querySelector("#schema-data");
  if (!node) return null;
  try {
    return JSON.parse(node.dataset.schema || "{}");
  } catch {
    return null;
  }
}

function injectSchema() {
  const data = parseSchema();
  if (!data || document.querySelector("#dynamic-schema")) return;

  const graph = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: data.siteName,
      url: "https://vpncostguide.com/",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: data.organizationName,
      url: data.organizationUrl,
      logo: data.organizationLogo,
    },
  ];

  if (Array.isArray(data.breadcrumbs) && data.breadcrumbs.length > 1) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        item: crumb.href,
      })),
    });
  }

  if (Array.isArray(data.faqs) && data.faqs.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    });
  }

  if (data.type === "home" || data.type === "article") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      datePublished: data.published,
      dateModified: data.modified,
      author: {
        "@type": "Person",
        name: data.author,
      },
      publisher: {
        "@type": "Organization",
        name: data.organizationName,
        logo: {
          "@type": "ImageObject",
          url: data.organizationLogo,
        },
      },
      mainEntityOfPage: data.url,
      image: data.image,
    });
  }

  if (data.type === "review" && data.review?.itemReviewed) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "Review",
      name: data.title,
      reviewBody: data.description,
      author: {
        "@type": "Person",
        name: data.author,
      },
      itemReviewed: {
        "@type": "Product",
        name: data.review.itemReviewed,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: data.review.ratingValue,
        bestRating: data.review.bestRating,
      },
    });
  }

  if (data.type === "calculator") {
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: data.title,
      description: data.description,
      url: data.url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
    });
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "dynamic-schema";
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
}

function upsertHeadTag(selector, build) {
  const current = document.head.querySelector(selector);
  if (current) return build(current);
  const tag = selector.startsWith("link") ? document.createElement("link") : document.createElement("meta");
  build(tag);
  document.head.appendChild(tag);
  return tag;
}

function cleanCanonicalPath(pathname) {
  if (!pathname || pathname === "/index.html") return "/";
  return pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "").replace(/\/{2,}/g, "/");
}

function handleQuerySignals() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("q")) return;

  upsertHeadTag('meta[name="robots"]', (node) => {
    node.setAttribute("name", "robots");
    node.setAttribute("content", "noindex, follow");
    return node;
  });

  upsertHeadTag('link[rel="canonical"]', (node) => {
    node.setAttribute("rel", "canonical");
    node.setAttribute("href", `https://vpncostguide.com${cleanCanonicalPath(window.location.pathname)}`);
    return node;
  });
}

function setupFilePreviewLinks() {
  if (window.location.protocol !== "file:") return;

  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || /^[a-z]+:/i.test(href)) return;
    if (/\/assets\/|\.css$|\.js$|\.svg$|\.png$|\.jpg$|\.jpeg$|\.webp$|\.ico$|\.json$/i.test(href)) return;
    if (href.includes("?") || href.includes("#")) return;
    if (href === "./" || href === ".") {
      anchor.setAttribute("href", "./index.html");
      return;
    }
    if (href === "../" || href === "..") {
      anchor.setAttribute("href", "../index.html");
      return;
    }
    if (href.endsWith("/")) {
      anchor.setAttribute("href", `${href}index.html`);
      return;
    }
    if (!/\.[a-z0-9]+$/i.test(href)) anchor.setAttribute("href", `${href}/index.html`);
  });
}

function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;
  let desktopMode = window.innerWidth > 820;

  function closeMenu() {
    button.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 820) closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    const nextDesktopMode = window.innerWidth > 820;
    if (nextDesktopMode && !desktopMode) {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }
    desktopMode = nextDesktopMode;
  });
}

function setCookiePreference(value) {
  try {
    window.localStorage.setItem(COOKIE_STORAGE_KEY, value);
  } catch {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax${secure}`;
  }
}

function getCookiePreference() {
  try {
    const stored = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // Ignore localStorage access issues and fall back to cookies.
  }

  return document.cookie
    .split("; ")
    .find((chunk) => chunk.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];
}

function setupCookieBanner() {
  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;
  const preference = getCookiePreference();
  banner.hidden = Boolean(preference);
  if (banner.dataset.bound === "true") return;
  banner.dataset.bound = "true";

  banner.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie-action]");
    if (!button) return;
    const action = button.dataset.cookieAction;
    if (!action) return;
    event.preventDefault();
    event.stopPropagation();
    setCookiePreference(action);
    banner.hidden = true;
  });
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function scoreLabel(score) {
  if (score >= 85) return "Very strong";
  if (score >= 70) return "Good";
  if (score >= 50) return "Moderate";
  return "Weak";
}

function renderResult(node, lines) {
  node.innerHTML = lines.map((line) => `<p><strong>${line.label}:</strong> ${line.value}</p>`).join("");
}

function setupCalculators() {
  document.querySelectorAll("[data-calculator]").forEach((wrapper) => {
    const form = wrapper.querySelector("form");
    const result = wrapper.querySelector(".calculator-result");
    if (!form || !result) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const type = wrapper.dataset.calculator;

      if (type === "vpn-cost") {
        const monthly = Number(data.get("monthlyPrice") || 0);
        const annual = Number(data.get("annualPrice") || 0);
        const years = Number(data.get("years") || 1);
        const monthlyRoute = monthly * 12 * years;
        const annualRoute = annual * years;
        renderResult(result, [
          { label: "Monthly-plan total", value: money(monthlyRoute) },
          { label: "Annual-plan total", value: money(annualRoute) },
          { label: "Estimated savings", value: money(Math.max(0, monthlyRoute - annualRoute)) },
        ]);
        return;
      }

      if (type === "annual-savings") {
        const monthly = Number(data.get("monthlyPrice") || 0);
        const annualEquivalent = Number(data.get("annualEquivalent") || 0);
        const years = Number(data.get("years") || 1);
        const monthlyTotal = monthly * 12 * years;
        const annualTotal = annualEquivalent * 12 * years;
        renderResult(result, [
          { label: "Stay monthly", value: money(monthlyTotal) },
          { label: "Use annual pricing", value: money(annualTotal) },
          { label: "Potential savings", value: money(Math.max(0, monthlyTotal - annualTotal)) },
        ]);
        return;
      }

      if (type === "password") {
        const password = String(data.get("password") || "");
        let score = 0;
        if (password.length >= 12) score += 30;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;
        if (password.length >= 16) score += 10;
        renderResult(result, [
          { label: "Strength score", value: `${score}/100` },
          { label: "Assessment", value: scoreLabel(score) },
          { label: "Advice", value: score >= 70 ? "Use MFA and store it in a password manager." : "Make it longer, unique, and less predictable." },
        ]);
        return;
      }

      if (type === "breach") {
        const accounts = Number(data.get("accounts") || 0);
        const reuse = String(data.get("reuse") || "yes");
        const mfa = String(data.get("mfa") || "no");
        let score = 25;
        score += Math.min(35, accounts / 2);
        if (reuse === "yes") score += 25;
        if (reuse === "sometimes") score += 12;
        if (mfa === "no") score += 20;
        if (mfa === "some") score += 10;
        score = Math.min(100, Math.round(score));
        renderResult(result, [
          { label: "Risk score", value: `${score}/100` },
          { label: "Risk level", value: score >= 70 ? "High" : score >= 45 ? "Moderate" : "Lower" },
          { label: "Priority next step", value: mfa === "no" ? "Enable MFA on email, banking, and shopping accounts." : "Use unique passwords and review account exposure." },
        ]);
        return;
      }

      if (type === "budget") {
        const vpn = Number(data.get("vpn") || 0);
        const passwordManager = Number(data.get("passwordManager") || 0);
        const identity = Number(data.get("identity") || 0);
        const total = vpn + passwordManager + identity;
        renderResult(result, [
          { label: "Total yearly budget", value: money(total) },
          { label: "Monthly equivalent", value: money(total / 12) },
          { label: "Budget posture", value: total < 120 ? "Lean" : total < 240 ? "Balanced" : "Premium" },
        ]);
      }
    });
  });
}

function initSite() {
  injectSchema();
  handleQuerySignals();
  setupFilePreviewLinks();
  setupMenu();
  setupCookieBanner();
  setupCalculators();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
