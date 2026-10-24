#!/usr/bin/env node
/**
 * Scroll-jerk test for the menu section (no dependencies — drives Chrome over CDP).
 *
 *   node scripts/scroll-jerk-test.mjs [url] [--label name]
 *
 * Defaults to http://localhost:3126/ (serve the built `out/` folder there first).
 * Runs two passes through #menu:
 *   desktop — real mouse-wheel ticks, with the pointer over the course tabs, the
 *             classic menus and the quote panel (where nested scroll areas live);
 *   phone   — real touch swipes (down, then back up) in a 390x844 touch viewport,
 *             also checking the sticky course rail never fades, jumps or covers the quote panel.
 * For each wheel tick it records how far the page actually moved, so it can tell
 *   STALL  — the wheel was swallowed (page did not move),
 *   BACK   — the page jumped backwards (snap-back),
 *   SURGE  — the page moved far more than the wheel asked for (catch-up jump),
 * plus dropped frames (gaps > 50 ms), long tasks and layout shifts while scrolling.
 * Exit code 1 when anything jerky is found.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:/.test(a)) ?? "http://localhost:3126/";
const label = args.includes("--label") ? args[args.indexOf("--label") + 1] : "";
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9300 + Math.floor(Math.random() * 400);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), "jerk-"));
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--autoplay-policy=no-user-gesture-required",
  "--window-size=1366,800", "about:blank",
], { stdio: "ignore" });

async function cdpTarget() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error("Chrome did not start");
}

const ws = new WebSocket(await cdpTarget());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(m.error.message)) : res(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = ++seq;
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result.value;

// Frame/long-task/layout-shift recorder, installed before any page script runs.
const PROBE = `
  window.__jerk = { frames: [], longTasks: 0, longTaskMs: 0, shift: 0, recording: false };
  (function loop(t) { if (window.__jerk.recording) window.__jerk.frames.push(t); requestAnimationFrame(loop); })(0);
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (window.__jerk.recording) { window.__jerk.longTasks++; window.__jerk.longTaskMs += e.duration; } }).observe({ type: "longtask", buffered: false }); } catch {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (window.__jerk.recording && !e.hadRecentInput) window.__jerk.shift += e.value; }).observe({ type: "layout-shift", buffered: false }); } catch {}
`;

async function open(mobile) {
  await send("Emulation.setDeviceMetricsOverride", mobile
    ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
    : { width: 1366, height: 800, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setTouchEmulationEnabled", mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "pointer", value: mobile ? "coarse" : "fine" }, { name: "hover", value: mobile ? "none" : "hover" }] });
  await send("Page.navigate", { url: url + (url.includes("?") ? "&" : "?") + "jerk=" + Date.now() });
  await sleep(6000); // loader + fonts
  // Pick two dishes so the quote panel and the phone bar have content, like a real visitor.
  await evaluate(`[...document.querySelectorAll('#menu ul button[aria-pressed]')].slice(0,3).forEach(b=>b.click()); true`);
  await sleep(500);
}

const box = (sel) => evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, top: r.top + scrollY, h: r.height }; })()`);

function summarise(name, ticks, probe) {
  const gaps = probe.frames.slice(1).map((t, i) => t - probe.frames[i]);
  const dropped = gaps.filter((g) => g > 50);
  const issues = ticks.filter((t) => t.kind !== "ok");
  const out = {
    pass: name,
    ticks: ticks.length,
    stalls: ticks.filter((t) => t.kind === "STALL").length,
    backJumps: ticks.filter((t) => t.kind === "BACK").length,
    surges: ticks.filter((t) => t.kind === "SURGE").length,
    framesRecorded: probe.frames.length,
    framesOver50ms: dropped.length,
    worstFrameMs: Math.round(Math.max(0, ...gaps)),
    longTasks: probe.longTasks,
    longTaskMs: Math.round(probe.longTaskMs),
    layoutShift: Number(probe.shift.toFixed(4)),
  };
  console.log(`\n== ${name} ==`);
  console.table(out);
  for (const t of issues.slice(0, 12)) console.log(`  ${t.kind.padEnd(5)} at y=${t.from} → ${t.to} (asked +${t.asked}) over ${t.over}`);
  return out;
}

// ---------- desktop: mouse wheel ----------
async function desktop() {
  await open(false);
  const menu = await box("#menu");
  await evaluate(`window.scrollTo({ top: ${Math.round(menu.top) - 900}, behavior: "instant" }); true`);
  await sleep(600);
  await evaluate("window.__jerk.recording = true; true");
  const ticks = [];
  const DELTA = 100;
  const end = menu.top + menu.h + 200;
  for (let i = 0; i < 200; i++) {
    const y0 = await evaluate("scrollY");
    if (y0 > end) break;
    // Steer the pointer over whatever nested area is on screen — that is where scroll fights happen.
    const targets = await evaluate(`(() => {
      const pick = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.bottom > 80 && r.top < innerHeight - 20 ? { x: r.left + Math.min(r.width / 2, 300), y: Math.max(90, Math.min(innerHeight - 30, r.top + r.height / 2)), name: s } : null; };
      return pick('#menu [role=tablist]') || pick('#menu-panel') || pick('#menu-name') || pick('#menu h2') || { x: 683, y: 400, name: 'page' };
    })()`);
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: targets.x, y: targets.y });
    await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: targets.x, y: targets.y, deltaX: 0, deltaY: DELTA });
    await sleep(140);
    const y1 = await evaluate("scrollY");
    const moved = Math.round(y1 - y0);
    const kind = moved < -2 ? "BACK" : moved < 5 ? "STALL" : moved > DELTA * 2.5 ? "SURGE" : "ok";
    ticks.push({ kind, from: Math.round(y0), to: Math.round(y1), asked: DELTA, over: targets.name });
  }
  await sleep(1200);
  // A settled page should not keep moving on its own after the last tick (catch-up / snap-back).
  const settle0 = await evaluate("scrollY");
  await sleep(800);
  const settle1 = await evaluate("scrollY");
  if (Math.abs(settle1 - settle0) > 2) ticks.push({ kind: "BACK", from: Math.round(settle0), to: Math.round(settle1), asked: 0, over: "after last tick" });
  const probe = await evaluate("window.__jerk.recording = false; window.__jerk");
  return summarise(`desktop wheel ${label}`, ticks, probe);
}

// ---------- phone: touch swipes ----------
// Real touch events (touchStart → touchMoves → touchEnd); Input.synthesizeScrollGesture is
// unreliable in headless Chrome (it either does nothing or flings thousands of pixels).
async function swipe(x, y, dy) {
  const steps = 12;
  await send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let i = 1; i <= steps; i++) {
    await send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - (dy * i) / steps }] });
    await sleep(16);
  }
  await send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

// The sticky course rail on phones: is it fading/jumping, and does it ever cover the quote panel?
const RAIL = `(() => {
  const rail = document.querySelector('#menu [role=tablist]')?.parentElement;
  const panel = document.querySelector('#menu-name')?.closest('.scroll-mt-24');
  if (!rail || !panel) return null;
  const r = rail.getBoundingClientRect(), p = panel.getBoundingClientRect(), cs = getComputedStyle(rail);
  const visible = Number(cs.opacity) > 0.05 && cs.visibility !== 'hidden';
  return { opacity: Number(cs.opacity).toFixed(2), transform: cs.transform, over: visible && r.bottom > p.top + 4 && r.top < p.bottom && r.bottom > 0 };
})()`;

async function phone() {
  await open(true);
  const menu = await box("#menu");
  await evaluate(`window.scrollTo({ top: ${Math.round(menu.top) - 700}, behavior: "instant" }); true`);
  await sleep(600);
  await evaluate("window.__jerk.recording = true; true");
  const ticks = [];
  let railFlicker = 0, railOverPanel = 0, lastRail = null;
  const end = menu.top + menu.h + 200;
  for (let i = 0; i < 80; i++) {
    const y0 = await evaluate("scrollY");
    if (y0 > end) break;
    await swipe(195, 650, 300);
    await sleep(260);
    const y1 = await evaluate("scrollY");
    const moved = Math.round(y1 - y0);
    const kind = moved < -2 ? "BACK" : moved < 40 ? "STALL" : moved > 900 ? "SURGE" : "ok";
    ticks.push({ kind, from: Math.round(y0), to: Math.round(y1), asked: 300, over: "swipe" });
    const rail = await evaluate(RAIL);
    if (rail) {
      if (lastRail && (rail.opacity !== lastRail.opacity || rail.transform !== lastRail.transform)) railFlicker++;
      if (rail.over) railOverPanel++;
      lastRail = rail;
    }
  }
  // Scroll back up through the menu too — show/hide tricks often misbehave on the way back.
  for (let i = 0; i < 12; i++) {
    const y0 = await evaluate("scrollY");
    await swipe(195, 250, -300);
    await sleep(260);
    const y1 = await evaluate("scrollY");
    const moved = Math.round(y0 - y1);
    ticks.push({ kind: moved < -2 ? "BACK" : moved < 40 ? "STALL" : "ok", from: Math.round(y0), to: Math.round(y1), asked: -300, over: "swipe up" });
    const rail = await evaluate(RAIL);
    if (rail) {
      if (lastRail && (rail.opacity !== lastRail.opacity || rail.transform !== lastRail.transform)) railFlicker++;
      if (rail.over) railOverPanel++;
      lastRail = rail;
    }
  }
  const probe = await evaluate("window.__jerk.recording = false; window.__jerk");
  const out = summarise(`phone swipe ${label}`, ticks, probe);
  out.railFlicker = railFlicker;
  out.railOverPanel = railOverPanel;
  console.log(`  rail fades/jumps: ${railFlicker} · rail covering quote panel: ${railOverPanel}`);
  return out;
}

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: PROBE });
  const d = await desktop();
  const p = await phone();
  const bad = (r) => r.stalls + r.backJumps + r.surges + r.framesOver50ms + (r.layoutShift > 0.05 ? 1 : 0) + (r.railFlicker ?? 0) + (r.railOverPanel ?? 0);
  const total = bad(d) + bad(p);
  console.log(total ? `\nRESULT: ${total} jerk signal(s) found` : "\nRESULT: smooth — no stalls, back-jumps, surges, dropped frames, layout shifts or rail jumps");
  process.exitCode = total ? 1 : 0;
} finally {
  ws.close();
  // Chrome spawns helper processes; on Windows kill the whole tree so none keep the port or profile.
  if (process.platform === "win32") spawn("taskkill", ["/pid", String(chrome.pid), "/T", "/F"], { stdio: "ignore" });
  else chrome.kill();
  await sleep(500);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
