# Scroll jerk — what caused it, how it was fixed, how to test it

**Symptom:** a jerk, stall or jump while scrolling, felt most around the menu
(quote-builder) section. It showed up on desktop with a mouse wheel and on phones.

**Status:** fixed and verified with the automated test below (`scripts/scroll-jerk-test.mjs`).

---

## TL;DR — the five causes and the fix for each

| # | Cause | Where | What you felt | Fix |
|---|-------|-------|---------------|-----|
| 1 | **Lenis smooth-scroll** fighting areas marked `data-lenis-prevent` | `components/SmoothScroll.tsx`, menu course tabs / classic menus / quote panel | Desktop: the page **stopped** while the pointer was over the course tabs, then **snapped** to catch up | Removed Lenis — native browser scrolling |
| 2 | **Gallery photos with no reserved size** | `sections/Gallery.tsx` | The page **jumped ~500 px** just above the menu as the lazy photos loaded (layout shift 0.18) | Each photo box gets its final aspect ratio before the photo loads |
| 3 | **Sticky course rail that faded out / back in** when the quote panel crossed mid-screen | `sections/Menu.tsx` (phones) | The tab bar **vanished and reappeared** while scrolling | Rail now sticks only inside the dish column and scrolls away naturally — no scroll watcher, no fade |
| 4 | **Scroll-in fade/slide animations** on every block (GSAP ScrollTrigger) | `components/Reveal.tsx` | **Dropped frames** as each block entered the screen | Content renders in place; the animation feature is dropped |
| 5 | **Expensive paint while scrolling**: frosted-glass header (`backdrop-filter`) re-blurring the page every frame, large gradients/stripes, big rotated banana-leaf drawings and 80 px soft shadows in the menu, oversized gallery photos, and an auto-loading **Google Map** embed | `components/Header.tsx`, `sections/Menu.tsx`, `sections/Footer.tsx`, gallery photos | **Dropped frames** throughout, worst as the menu enters and near its end | Solid header, flat menu backgrounds, no leaf drawings in the menu, light shadows, gallery photos resized to 1000 px, map loads only when "Show map" is tapped |

---

## How to test it yourself

1. Build and serve the static site:

   ```bash
   npm run build
   cd out && python -m http.server 3126
   ```

2. In another terminal, run the test (needs Google Chrome installed; no npm packages):

   ```bash
   node scripts/scroll-jerk-test.mjs http://localhost:3126/
   ```

   It opens headless Chrome and scrolls through the menu section twice:

   - **desktop** — real mouse-wheel ticks (100 px each), steering the pointer over the
     course tabs, the classic menus and the quote panel, where nested scroll areas live;
   - **phone** — real touch swipes (down, then back up) in a 390×844 touch viewport.

   Per wheel tick / swipe it checks how far the page actually moved:

   | Signal | Meaning |
   |--------|---------|
   | `stalls` | the input was swallowed — the page did not move |
   | `backJumps` | the page moved backwards (snap-back) |
   | `surges` | the page moved far more than asked (catch-up jump) |
   | `framesOver50ms` / `worstFrameMs` | dropped frames while scrolling |
   | `layoutShift` | content jumping (Cumulative Layout Shift during the scroll) |
   | `rail fades/jumps` | the sticky course rail changed opacity/position on its own |
   | `rail covering quote panel` | the rail sat on top of the quote panel / send button |

   Exit code `1` means jerk was found.

3. Compare two builds (headless Chrome renders in software, so single runs are noisy —
   compare medians over several runs):

   ```bash
   node scripts/scroll-jerk-compare.mjs 3 before=http://localhost:3127/ after=http://localhost:3126/
   ```

   To build an older commit for "before":
   `git worktree add --detach ../sk-baseline <commit>`, link `node_modules`, `next build`,
   serve its `out/` on another port.

---

## Results

Measured with `scripts/scroll-jerk-compare.mjs`, 3 runs per version, headless Chrome on
this Windows machine (software rendering, so frame times are slower and noisier than on a
real phone or laptop GPU — compare versions against each other and against the plain page).

- **before** — commit `5a14d6a` (Lenis smooth scroll, gallery without reserved sizes, fading rail,
  scroll-in animations, frosted header, auto-loading map)
- **after** — this fix
- **plain page** — a bare page of text with no images, effects or scripts: the noise floor of
  the test machine

| Version | Pass | Stalls | Snap-backs | Frames > 50 ms (median) | Layout shift | Rail jumps | Rail over quote panel |
|---------|------|-------:|-----------:|------------------------:|-------------:|-----------:|----------------------:|
| before | desktop wheel | **3** | 0 | 5 | **0.08–0.18** | – | – |
| before | phone swipe | 0 | 0 | 1 | 0 | **6–7** | 0 |
| after | desktop wheel | **0** | 0 | 3 | **0** | – | – |
| after | phone swipe | 0 | 0 | 1 | 0 | **0** | **0** |
| plain page | desktop wheel | 0 | 0 | 1 | 0 | – | – |
| plain page | phone swipe | 0 | 0 | 4 | 0 | – | – |

What changed for a visitor:

- **No more freezes:** before, the page stopped dead for 3 wheel ticks in a row with the pointer
  over the course tabs; after, every tick moves the page.
- **No more jumps:** before, the page shifted up to ~500 px while the gallery photos loaded
  (layout shift 0.08–0.18 depending on timing); after, 0.
- **No more flickering bar on phones:** the course rail faded/jumped 6–7 times per pass before;
  0 after, and it never covers the quote panel.
- **Frame drops at the noise floor:** the A/B traces (below) took the desktop menu scroll from
  ~6 dropped frames to 0–1 with each paint fix; the remaining 1–3 per run in the full test are
  the same order as a bare text page on this machine (phone plain page: 4).

One "after" desktop run once reported the page not moving at all (170 stalls); it did not
reproduce in 4 further runs (0 stalls on desktop and phone each time) and was a test-harness
hiccup, not the site.

---

## The causes in detail

### 1. Lenis smooth scroll vs. `data-lenis-prevent`

Lenis takes over wheel scrolling and animates the page itself. Three menu areas were
marked `data-lenis-prevent` so their own (horizontal / inner) scrolling would work: the
classic-menu row, the course tabs and the quote panel. On desktop the first two do not
scroll at all, so a wheel over them was ignored by Lenis **and** had nothing to scroll —
the test measured the page frozen for 3 ticks in a row (y 6945 → 6948) with the pointer
over the course tabs, before Lenis caught up.

**Fix:** Lenis removed (`components/SmoothScroll.tsx` deleted, wrapper removed from
`app/layout.tsx`, `data-lenis-prevent` attributes removed). Native scrolling handles nested
scroll areas correctly. Anchor links still glide (`html { scroll-behavior: smooth }`) and land
below the fixed header (`scroll-padding-top`).

### 2. Gallery images without a reserved size

The gallery is a masonry wall of lazy-loaded `<img>` with `h-auto`. Until a photo loads its
box is 0 px tall, so the section was **443 px** and grew to **955 px** as the five photos
arrived — while the visitor was scrolling towards the menu. Everything below (How we work,
the menu) moved down ~500 px mid-scroll. Chrome's Layout Instability API reported a single
shift of **0.18** on the How-we-work section.

**Fix:** gallery entries carry their pixel size (`w`, `h` in `events/active.json`); the
photo box gets `aspect-ratio: w / h` and the image fills it (`absolute inset-0 object-cover`).
Unknown sizes fall back to a 4:3 box. The section is now 955 px before *and* after loading;
layout shift is 0.

> Rule: **every lazy image must have its box size known before it loads** (fixed aspect
> container, or `width`/`height` attributes with `height:auto`).

### 3. The fading sticky rail (phones)

The course rail was `position: sticky` for the whole menu section, so it would have sat on
top of the quote panel. A workaround watched the scroll (IntersectionObserver) and faded the
rail out when the quote panel reached mid-screen and back in when it left — a bar visibly
disappearing and reappearing while scrolling (the test counted 4–6 of these per pass).

**Fix:** the rail moved inside the dish column. `position: sticky` only sticks within its
parent, so the rail stays pinned while the dishes are on screen and scrolls away by itself
when the column ends — before the quote panel. No observer, no fade, and it never covers
the panel (`rail covering quote panel: 0`).

### 4. Scroll-in animations

Every `<Reveal>` block faded and slid in (GSAP `autoAlpha` + `y`) when it reached 85 % of
the viewport. Animating opacity and transform on whole blocks promotes them to their own
compositing layers and re-rasterises them while the page scrolls. A/B in the trace:
with the animations neutralised, GPU raster time during the menu scroll dropped from
~700 ms to ~260 ms and dropped frames went to 0 in most runs.

**Fix:** `components/Reveal.tsx` is now a plain wrapper (same props, no animation).

### 5. Paint cost while scrolling

A/B measurements (desktop wheel through the menu, dropped frames > 50 ms):

| Switched off | Dropped frames |
|--------------|----------------|
| nothing | 6 |
| banana-leaf drawings | 8 (no help) |
| shadows | 6 (no help) |
| all `backdrop-filter` (frosted header) | 3 |
| menu gradients / stripes | 2 |
| embedded Google Map | 1–3, GPU time −30 % |
| *second round, after fixes 1–4 and the above* | *1–3* |
| big banana-leaf drawings in the menu | 0–1 |
| menu / gallery photos | 0–1 |
| 80 px soft shadows | 1, GPU time −40 % |

**Fixes:** header is solid white (no `backdrop-filter`); the phone rail has a solid
background; the menu section and dish card use flat colours (no full-height gradient, no
repeating stripe pattern); the three large rotated leaf drawings behind the menu are gone;
the menu's 80 px soft shadows are now light 10–24 px ones; gallery photos are 1000 px wide
(they display at ~370 px; the lightbox at ≤ 900 px) instead of 1400–1600 px, so there is far
less to decode while scrolling; the map is click-to-load (`components/MapEmbed.tsx`).

The per-cause A/B traces were made with a throwaway script that injects CSS to switch one
effect off at a time and records a Chrome performance trace of the same wheel scroll; the
same approach works for any future regression.

---

## Fixing the same thing on the other sites

All IN ONE, Carmel and Shadhi use the same template, so they have causes 1, 2, 4 and 5
(cause 3 too, if they have the fading rail). To apply the fix there, port these commits from
this repo (`git log --oneline -- jerk.md` lists them) or make the same edits:

1. **Delete** `components/SmoothScroll.tsx`; in `app/layout.tsx` remove its import and the
   `<SmoothScroll>` wrapper; in `app/globals.css` remove the `/* Lenis */` block and add
   `scroll-behavior: smooth` to the `html { scroll-padding-top … }` rule; remove every
   `data-lenis-prevent` attribute.
2. **Gallery:** add `w`/`h` to `GalleryEntry` and `GalleryItem`, give the photo button
   `style={{ aspectRatio: w && h ? \`${w} / ${h}\` : "4 / 3" }}`, make the `<Img>`
   `absolute inset-0 h-full w-full object-cover`, and record each photo's size in the site's
   gallery data.
3. **Menu rail:** wrap the course rail and the dish card in one column div inside the menu
   grid; drop the `panelUp` state/observer and its fade classes; solid rail background.
4. **Reveal:** replace `components/Reveal.tsx` with the plain wrapper.
5. **Paint:** header without `backdrop-blur`, flat menu backgrounds, no `BananaLeaf` drawings
   behind the menu, light shadows, gallery photos ≤ 1000 px wide, `MapEmbed` for the map.
6. Run `node scripts/scroll-jerk-test.mjs` against the built site — it should print
   `RESULT: smooth`, or only occasional single dropped frames from headless rendering noise.

## Guardrails (so it does not come back)

- No scroll-hijacking libraries (Lenis, locomotive-scroll, etc.).
- Never animate layout properties or big blocks on scroll; never show/hide fixed or sticky
  bars from a scroll watcher — use `position: sticky` inside the right parent instead.
- Every lazy image and video gets a reserved box (aspect-ratio or width/height).
- No `backdrop-filter` on anything that stays on screen while scrolling.
- Third-party embeds (maps, video players) load on tap, not on scroll.
- No large rotated/clipped SVG art or 60 px+ blurred shadows in long scrolling sections;
  images no wider than about 2–3× their displayed size.
- Run `scripts/scroll-jerk-test.mjs` before deploying a layout change.
