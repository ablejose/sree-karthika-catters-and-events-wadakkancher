# Authenticity Plan — making a templated site feel custom-built

The architecture makes a new event cheap. The risk is the opposite: eight sites
that are visibly the same site. Everything below is aimed at one goal — a
visitor (and Google) should not be able to tell the site came from a template.

Ordered by impact per hour of work. P0 items are the ones that actually decide
whether the site reads as authentic.

---

## P0-1. Per-event design tokens (the single biggest win)

**Problem:** every build ships the same saffron-on-ivory palette, the same
Fraunces/Manrope pairing, the same 14px radius. Two clients in the same district
will look like the same company.

**Change:** add a `theme` block to `EventConfig` and drive CSS variables from it
at the `<body>` level, instead of hardcoding them in `globals.css` / `tailwind.config.ts`.

```ts
theme: {
  palette: { accent: "#C4892E", accentDeep: "#A9721F", ink: "#1E1712", surface: "#FDFAF3", contrast: "#241C15" },
  fonts: { display: "Fraunces", sans: "Manrope" },   // loaded dynamically from next/font
  radius: "14px" | "0px" | "999px",
  texture: "none" | "paper" | "linen",               // subtle body overlay
}
```

Ship 4-5 named presets (`warm-saffron`, `deep-maroon`, `emerald-gold`,
`monochrome-editorial`, `blush-ivory`) so a swap is one word, but any client can
override a single hex. **Effect:** same code, unrecognisably different site.

## P0-2. Section order and layout variants per event

**Problem:** identical AIDA order and identical left/right rhythm on every site.

**Change:** make the page composition data, not code.

```ts
layout: {
  order: ["hero", "trustBar", "services", "gallery", "process", "about", "testimonials", "contact", "instagram"],
  hero: "fullscreen-video" | "split-portrait" | "editorial-stack",
  gallery: "photo-card" | "masonry" | "filmstrip",
  services: "image-cards" | "list-rows" | "numbered-editorial",
}
```

`app/page.tsx` renders from `layout.order`; each section exports 2-3 variants
behind one prop. Two or three variants per section is already hundreds of
distinct-looking builds.

## P0-3. Real words beat template words

**Problem:** `{brand}` substituted into shared sentences is what makes a site
smell templated — "Weddings, receptions and functions across {district}" reads
fine once and hollow the second time.

**Change:** treat template copy as *fallback only*, and make the intake capture
client-specific language:

- `voice: { founderName, foundedYear, originStory, signatureDishes[], specialityClaim, languages[] }`
- Require at least 3 of: origin story (2-3 sentences), signature dish list,
  biggest event handled (guest count), a named team size, a "what we refuse to
  do" line. Those five facts alone carry a whole About section.
- Add a build-time check: fail `npm run build` if an event still uses more than
  N template strings verbatim, or if `voice.originStory` is empty. Authenticity
  enforced by CI, not by memory.

## P0-4. Proof over polish

**Problem:** stock service art + a generic quote is the clearest template tell.

**Change:** promote real proof into required fields:

- `stats: [{ value: "1,200", label: "guests served in one day" }, ...]` — replaces
  the generic trust pills with facts only this client can claim.
- `venues: string[]` — halls/auditoriums they regularly work in. Local names are
  strong authenticity and strong local SEO.
- `menus: [{ name: "Malabar wedding sadya", items: string[], priceFrom?: number }]`
  — a real menu section is the single most convincing block for a catering site.
- `team: [{ name, role, photo }]` — even two faces with names beats any stock photo.
- Make `services[].image` **required to be the client's own** photo, with template
  art allowed only behind an explicit `usingTemplateArt: true` flag that logs a
  warning at build. Friction in the right direction.

---

## P1-1. Media authenticity pipeline

- **Ban stock in production:** `media.base` pointing at `picsum`/`unsplash` fails
  the production build (allowed only for `slug: "demo"`).
- **Asset floor:** warn below 8 gallery photos, 3 reels, 1 hero video, 2 about
  photos, 1 OG image.
- **Colour extraction:** derive `theme.palette.accent` from the client's hero
  image (one-time script writing the hex into their config). The site then feels
  colour-matched to their own work rather than to the template.
- **Automatic variety:** crop/aspect assignment per event (`4:5`, `3:4`, `1:1`)
  so grids don't share a silhouette.
- **Real captions:** `alt` should name the venue and occasion ("Reception at
  Kalyana Mandapam, Ollur") rather than describing the pixels. Free local SEO.

## P1-2. Local signal, not just location strings

- Embed the real Maps pin, not just a link.
- Add a `nearby: [{ name, type: "venue" | "hall" | "landmark" }]` block rendered as
  a plain "we regularly cater at" list — high-intent local search surface.
- Per-event FAQ (`faq: [{ q, a }]`) with `FAQPage` JSON-LD: every client's FAQ is
  genuinely different (advance notice, minimum guests, travel radius, veg/non-veg,
  payment terms), so it both differentiates and wins rich results.
- `Review` JSON-LD from their real reviews, plus `Menu` schema when menus exist.

## P1-3. Motion and micro-signature

- `motion: { intensity: "calm" | "standard" | "cinematic" }` scaling the GSAP
  parallax, reveal distance, loader duration and typewriter speed.
- One **signature element per event**: monogram loader, hand-drawn divider,
  ticker of dish names, photo-strip footer. A single distinctive gesture is what
  people remember; rotate the catalogue between clients.
- Loader shows the brand monogram (generated from initials) rather than the same
  text animation everywhere.

---

## P2. Hygiene that keeps the fleet honest

- **`npm run new-event <slug>`** scaffolder: creates the config from the starter,
  makes `public/events/<slug>/`, prints the asset checklist, and refuses to
  finish with placeholder values left in.
- **`npm run audit:event`**: reports template-string reuse %, asset counts, stock
  URLs, missing FAQ/menu/stats, duplicated palette against other events in the repo.
  One command answers "does this feel custom yet?".
- **Visual diff guard:** screenshot each deployed event at 3 widths; flag any two
  events above a similarity threshold. Catches accidental clones before the client does.
- **Per-event `robots`/canonical checks** so sibling sites never compete on the
  same copy — near-duplicate text across client sites is a real ranking risk, and
  it is the same risk as looking templated, expressed in SEO terms.
- **Content freshness hook:** `lastUpdated` per event; a stale site (no new photos
  in 6 months) is flagged in the audit.

---

## Suggested sequence

| Step | Work | Outcome |
| --- | --- | --- |
| 1 | P0-1 theme tokens + 5 presets | sites stop sharing a palette |
| 2 | P0-2 layout variants (hero + gallery + services) | sites stop sharing a skeleton |
| 3 | P0-3 `voice` block + build check | sites stop sharing sentences |
| 4 | P0-4 stats / menus / venues / team | real proof replaces stock feel |
| 5 | P1-1 media rules + colour extraction | assets carry the brand |
| 6 | P1-2 FAQ + local blocks + schema | local search advantage per client |
| 7 | P1-3 motion presets + signature element | each site has one memorable gesture |
| 8 | P2 scaffolder + audit + visual diff | authenticity is enforced, not hoped for |

**Rule of thumb for every future field:** if two clients would ever write the
same sentence, it belongs in `config/template.ts`. If they would not, it must be
required in their event config — and the build should refuse to ship without it.
