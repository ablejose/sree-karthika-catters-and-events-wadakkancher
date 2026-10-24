#!/usr/bin/env node
/**
 * Run scroll-jerk-test.mjs several times per URL and print one comparison table.
 * Headless Chrome renders in software, so single runs are noisy — compare medians.
 *
 *   node scripts/scroll-jerk-compare.mjs <runs> <label>=<url> [<label>=<url> ...]
 *   e.g. node scripts/scroll-jerk-compare.mjs 3 before=http://localhost:3127/ after=http://localhost:3126/
 */
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [runsArg, ...targets] = process.argv.slice(2);
const runs = Number(runsArg) || 3;
const test = join(dirname(fileURLToPath(import.meta.url)), "scroll-jerk-test.mjs");
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const field = (block, k) => Number((block.match(new RegExp(`│ ${k}\\s+│ ([^│]+)│`)) || [])[1]?.trim() ?? NaN);

const rows = [];
for (const t of targets) {
  const [label, url] = t.split("=");
  const acc = { desktop: [], phone: [] };
  for (let i = 0; i < runs; i++) {
    let out = "";
    try { out = execFileSync(process.execPath, [test, url, "--label", label], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
    catch (e) { out = e.stdout ?? ""; } // exit code 1 just means jerk was found
    for (const b of out.split("== ").slice(1)) {
      const pass = b.startsWith("desktop") ? "desktop" : "phone";
      const rail = b.match(/rail fades\/jumps: (\d+) · rail covering quote panel: (\d+)/);
      acc[pass].push({
        stalls: field(b, "stalls"), back: field(b, "backJumps"), surges: field(b, "surges"),
        drops: field(b, "framesOver50ms"), worst: field(b, "worstFrameMs"), shift: field(b, "layoutShift"),
        railJumps: rail ? Number(rail[1]) : 0, railOver: rail ? Number(rail[2]) : 0,
      });
    }
    process.stderr.write(`  ${label} run ${i + 1}/${runs} done\n`);
  }
  for (const pass of ["desktop", "phone"]) {
    const r = acc[pass];
    const m = (k) => median(r.map((x) => x[k]));
    rows.push({
      version: label, pass, runs: r.length,
      "stalls (max)": Math.max(0, ...r.map((x) => x.stalls)),
      "snap-backs (max)": Math.max(0, ...r.map((x) => x.back)),
      "surges (max)": Math.max(0, ...r.map((x) => x.surges)),
      "frames>50ms (median)": m("drops"),
      "worst frame ms (median)": m("worst"),
      "layout shift (max)": Math.max(0, ...r.map((x) => x.shift)),
      "rail jumps (max)": Math.max(0, ...r.map((x) => x.railJumps)),
      "rail over panel (max)": Math.max(0, ...r.map((x) => x.railOver)),
    });
  }
}
console.table(rows);
