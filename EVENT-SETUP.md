# Launching a new event site

Everything client-specific lives in **one data file** and **one media folder**.
Template copy and stock art are shared and should not be duplicated per client.

## The 3-step swap

1. **Data** — copy `events/_new-event.config.ts` to `events/<slug>.config.ts` and fill it in.
2. **Media** — drop their own photos/videos into `public/events/<slug>/` using the layout below.
3. **Switch** — edit `event.config.ts` (two lines):

```ts
import { chandrika } from "@/events/chandrika.config";
export const event = chandrika;
```

That is the whole change. Name, phone, address, maps pin, WhatsApp links, hero
video, gallery, reviews, SEO title/description, keywords, schema.org
LocalBusiness data, sitemap, robots, favicons and the PWA manifest all follow
from it.

## Media folder layout

```
public/events/<slug>/
  hero.mp4              # looping hero video (optional)
  hero-poster.webp      # hero still / reduced-motion fallback
  og-image.jpg          # 1200x630 social share image
  about-1.webp          # About crossfade pair
  about-2.webp
  gallery/01.webp ...   # "Our work" photos (their real events)
  videos/clip-1.mp4     # "Our work" reels
  videos/clip-1.webp    # matching poster frame
  brand/                # favicon.ico, favicon-16x16.png, favicon-32x32.png,
                        # apple-touch-icon.png, android-chrome-192x192.png,
                        # android-chrome-512x512.png, icon.svg
```

Paths in the config are **relative to `media.base`**, so moving a client's
assets (for example to Cloudinary) is a one-line change: set
`media.base: "https://res.cloudinary.com/<cloud>/image/upload/<folder>"`.

## What stays in the template

| Belongs to the template (`config/template.ts`, `public/template/`) | Belongs to the event (`events/<slug>.config.ts`, `public/events/<slug>/`) |
| --- | --- |
| "What we do" service cards + their stock art | Business name, descriptor, tagline |
| "How we work" process steps | Phone, WhatsApp, email |
| Section eyebrows, headings, quotes, hints | Address, area, postcode, geo, maps links |
| Form labels, CTA labels, WhatsApp message wording | Service areas, hours, delivery |
| Illustration in the Contact section | Rating, review count, real review quotes |
| Colours, fonts, motion timings | Their own photos, reels, hero video, OG image |
| SEO title/description/keyword *patterns* | Domain, Instagram, favicons |

## Tokens

Shared strings may contain `{tokens}`, filled per event at render time:

`{brand}` `{fullName}` `{descriptor}` `{kicker}` `{tagline}` `{city}`
`{district}` `{region}` `{area}` `{address}` `{phone}` `{hours}` `{areas}`
`{rating}` `{reviews}`

Example (template): `"Serving {city} & {district}"` -> `"Serving Perintalmanna & Malappuram"`.

## Per-event overrides

Only if a client really differs, add to their config:

```ts
overrides: {
  services: [ /* replaces the three shared cards */ ],
  process:  [ /* replaces the five shared steps */ ],
  aboutBody: "Custom about paragraph, {city} tokens still work.",
}
```

## Rules

- Never hardcode a business detail in `app/`, `sections/` or `components/` — read it from config.
- Never put a client's own photos in `public/template/`, and never put stock art in `public/events/<slug>/`.
- Never invent reviews. Empty `reviews: []` simply hides the section.
- Leave `web.instagram` blank to hide the Instagram CTA.
- Omit `media.heroVideo` to run a still hero.

## Checklist before deploy

- [ ] `events/<slug>.config.ts` filled, no placeholder values left
- [ ] `event.config.ts` points at the new event
- [ ] `public/events/<slug>/` has hero, poster, OG image, about pair, gallery, reels, brand icons
- [ ] `npm run type-check` and `npm run build` pass
- [ ] `web.url` set to the real domain (drives canonical, sitemap, robots, schema.org)
- [ ] Verified on the live URL: WhatsApp link, phone link, Maps link, share preview
