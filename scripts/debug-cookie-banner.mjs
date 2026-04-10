import process from "node:process";

const endpoint = process.argv[2] || "http://127.0.0.1:9222";
const mode = process.argv[3] || "inspect";
const navigateUrl = process.argv[4];
const resetStorage = process.argv[5] === "reset";

async function getJson(path) {
  const response = await fetch(`${endpoint}${path}`);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${path}`);
  return response.json();
}

const targets = await getJson("/json/list");
const page = targets.find((entry) => entry.type === "page");
if (!page?.webSocketDebuggerUrl) throw new Error("No debuggable page target found.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let sequence = 0;

function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

socket.addEventListener("message", (event) => {
  const payload = JSON.parse(event.data);
  if (!payload.id) return;
  const job = pending.get(payload.id);
  if (!job) return;
  pending.delete(payload.id);
  if (payload.error) job.reject(new Error(payload.error.message));
  else job.resolve(payload.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

await call("Runtime.enable");
await call("Page.enable");

if (navigateUrl) {
  await call("Page.navigate", { url: navigateUrl });
  await new Promise((resolve) => setTimeout(resolve, 1200));
}

if (resetStorage) {
  await call("Runtime.evaluate", {
    expression: `
      (() => {
        try { localStorage.removeItem('vpcg_cookie_pref'); } catch {}
        document.cookie = 'vpcg_cookie_pref=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        return true;
      })()
    `,
    returnByValue: true,
  });
}

const inspectExpression = `
(() => {
  const banner = document.querySelector('[data-cookie-banner]');
  const buttons = [...document.querySelectorAll('[data-cookie-action]')].map((button) => {
    const rect = button.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);
    const top = document.elementFromPoint(x, y);
    const stack = document.elementsFromPoint(x, y).slice(0, 6).map((node) => ({
      tag: node.tagName,
      className: node.className,
      id: node.id
    }));
    return {
      text: button.textContent.trim(),
      rect: { x, y, width: rect.width, height: rect.height },
      disabled: button.disabled,
      hidden: button.hidden,
      pointerEvents: getComputedStyle(button).pointerEvents,
      visibility: getComputedStyle(button).visibility,
      opacity: getComputedStyle(button).opacity,
      topElement: top ? { tag: top.tagName, className: top.className, id: top.id } : null,
      stack
    };
  });

  return {
    bannerHidden: banner?.hidden,
    bannerStyle: banner ? {
      zIndex: getComputedStyle(banner).zIndex,
      pointerEvents: getComputedStyle(banner).pointerEvents,
      visibility: getComputedStyle(banner).visibility,
      opacity: getComputedStyle(banner).opacity
    } : null,
    buttons,
    localStorageValue: (() => {
      try { return localStorage.getItem('vpcg_cookie_pref'); } catch { return 'localStorage-error'; }
    })()
  };
})()
`;

if (mode === "inspect") {
  const result = await call("Runtime.evaluate", {
    expression: inspectExpression,
    returnByValue: true,
  });
  console.log(JSON.stringify(result.result.value, null, 2));
}

if (mode === "click-accept" || mode === "click-reject") {
  const which = mode === "click-accept" ? "accept" : "reject";
  const findButton = await call("Runtime.evaluate", {
    expression: `
      (() => {
        const button = document.querySelector('[data-cookie-action="${which}"]');
        const rect = button.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()
    `,
    returnByValue: true,
  });

  const { x, y } = findButton.result.value;
  await call("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none" });
  await call("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await call("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });

  const postClick = await call("Runtime.evaluate", {
    expression: `
      (() => ({
        hidden: document.querySelector('[data-cookie-banner]')?.hidden,
        stored: (() => {
          try { return localStorage.getItem('vpcg_cookie_pref'); } catch { return 'localStorage-error'; }
        })()
      }))()
    `,
    returnByValue: true,
  });
  console.log(JSON.stringify(postClick.result.value, null, 2));
}

socket.close();
