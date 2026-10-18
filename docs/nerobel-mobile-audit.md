# Nerobel Group — Mobile Experience Audit & Premium Redesign Plan

- **Site:** https://s-7mza.github.io/nerobel/index.html (all six pages)
- **Focus:** mobile only — phones 320–430 px, tablet portrait 768 px as a secondary check
- **Roles:** mobile web designer (visual system, rhythm, type, imagery) + mobile UX auditor + front-end reviewer
- **Goal:** a best-in-class premium mobile experience: consistent spacing, alignment, typography and sizes, and **sliders where the image is the hero, not a side-crop of a desktop background**
- **Companion file:** `nerobel-website-audit.md` (full-site audit, owner decisions in its section 8.4 still apply: French only, no SLA/warranty figures, no "150+", no tracking, no partner retailer names)
- **Status:** 🟡 v0 — skeleton generated first; sections below are filled live, one at a time

## 0. Live progress

| Section | Status |
|---|---|
| 1. Method, evidence levels, limits | ✅ Written |
| 2. Premium mobile standard (the target) | ✅ Written |
| 3. Slider doctrine (image-first) | ✅ Written |
| 4. Evidence gathering (code + content) | ⏳ In progress |
| 5. Findings per page (mobile) | ⏳ Pending |
| 6. Slider & hero deep-dive | ⏳ Pending |
| 7. Redesign proposals (mobile layouts) | ⏳ Pending |
| 8. Mobile design tokens | ⏳ Pending |
| 9. Sprint plan (agent-executable) | ⏳ Pending |
| 10. Measurement harness & test scripts | ⏳ Pending |
| 11. Open questions | ⏳ Pending |
| 12. Changelog | ✅ Started |

## 1. Method, evidence levels, limits

**How the audit is built**
1. **Evidence first.** Read the real source (HTML, CSS, JavaScript) instead of guessing from the visible text. Every finding carries an evidence level.
2. **Measure, don't opine.** Each lens in 1.2 has numeric pass/fail criteria, so a finding is a measurable gap between the code and the standard in section 2.
3. **Design the fix, then make it testable.** Every finding maps to a sprint task with acceptance checks that a script can run.
4. **Live updates.** This file is edited as findings, ideas and fixes appear; the changelog (section 12) records each change.

**Evidence levels** (written next to every finding)
- `CODE` — seen directly in the source files.
- `CONTENT` — seen in the page text/markup but not in styles.
- `INFERRED` — deduced from structure; needs a device or screenshot check.
- `MEASURED` — produced by the harness in section 10 (screenshots, computed styles, bounding boxes).

**Limits of this audit**
- No real device or browser rendering is available to the auditor here. Layout, crop and spacing statements are therefore `CODE` or `INFERRED` until the harness (section 10) is run and its output is pasted back; the file is then upgraded to `MEASURED`.
- No performance or field data.

### 1.1 Test viewports

| Name | Size (CSS px) | Why |
|---|---|---|
| Floor | 320 × 568 | Smallest supported phone; catches overflow |
| Baseline Android | 360 × 800 | Most common Android width |
| iPhone standard | 390 × 844 | Most common iPhone width |
| Large phone | 430 × 932 | Plus/Max devices |
| Tablet portrait | 768 × 1024 | Breakpoint check only |

### 1.2 Audit lenses and scoring (0–5 each)

| # | Lens | Passes when |
|---|---|---|
| L1 | Layout & grid | 4-column grid, constant side margins, no horizontal scroll at 320–768 px |
| L2 | Spacing & rhythm | Only values from the spacing scale; section rhythm constant; no cramped or floating elements |
| L3 | Typography | Sizes, line heights, line length and weights follow the type scale; no text below 12 px, body ≥ 16 px |
| L4 | Imagery & sliders | Every image has a defined focal point and art-directed mobile crop; subject never cut; no layout shift |
| L5 | Navigation & thumb reach | Primary actions in the lower half, targets ≥ 48 px, header and bar do not fight |
| L6 | Components | Cards, forms, simulators, locator, accordions behave and align on a phone |
| L7 | Motion & feedback | Subtle, purposeful, reduced-motion safe; tap feedback present |
| L8 | Perceived speed | First screen meaningful fast; no jank; images sized and lazy |
| L9 | Accessibility on mobile | Contrast AA, focus, labels, zoom to 200 %, no hover-only |
| L10 | Premium coherence | One visual language across pages; restraint; nothing looks templated or inconsistent |

## 2. Premium mobile standard (the target)

### 2.1 Grid and margins
- 4 columns; side margin **16 px** at 320–389, **20 px** at 390–429, **24 px** at 430–767; gutter 12 px.
- Content never touches the screen edge except full-bleed media; full-bleed media still keeps text inside the margins.
- Respect `env(safe-area-inset-*)` for anything fixed to an edge.

### 2.2 Spacing scale (use nothing else)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64` px.
- Between sections: **48** (compact) or **64** (feature) — one choice per page type, applied everywhere.
- Between a section title and its content: 16–24. Between cards: 16. Card inner padding: 20 (24 for feature cards).
- Between a label and its value, or an icon and its text: 8.

### 2.3 Typography (mobile)

| Role | Size / line height | Weight | Notes |
|---|---|---|---|
| H1 | clamp 30–36 px / 1.15 | 600–700 | max 3 lines, `text-wrap: balance` |
| H2 | clamp 24–28 px / 1.2 | 600 | max 3 lines |
| H3 | 20 px / 1.25 | 600 | |
| Body | 16 px / 1.55 | 400 | never below 16 for reading text |
| Secondary | 14 px / 1.45 | 400–500 | specs, helper text |
| Caption / legal | 12 px / 1.4 | 400 | the floor; not for essential information |
| Eyebrow | 12 px / 1.3, uppercase, +0.08 em | 600 | one per section at most |
| Button | 16 px / 1 | 600 | sentence case |

- Two font families maximum, four weights maximum; `font-display: swap` with a metric-matched fallback; `text-wrap: pretty` on paragraphs; no justified text; no all-caps for sentences.
- Line length on phones: about 32–42 characters; paragraphs of at most 5 lines before a break.
- Numbers in spec rows: tabular figures.

### 2.4 Touch and thumb reach
- Targets **≥ 48 × 48 px**, spaced ≥ 8 px; primary actions in the lower 55 % of the screen; one primary button per screen section.
- The persistent bar is 64 px + safe area, four items maximum, icon + label ≥ 12 px.

### 2.5 Colour and surfaces (dark premium look)
- Off-black surfaces (not pure #000) with 2–3 elevation steps; off-white text (not pure #FFF); accent used sparingly and only as a brand cue.
- Contrast: 4.5:1 for text, 3:1 for large text and UI borders; text over images only on a scrim that guarantees it.

### 2.6 Shape, depth, motion
- Two radii (8 and 16 px) used consistently; hairline borders (1 px) rather than heavy shadows on dark.
- Motion 150–250 ms ease-out; tap feedback (`:active` scale 0.98 or opacity); nothing moves on its own; `prefers-reduced-motion` honoured.

### 2.7 Imagery
- Boxes reserve their space with `aspect-ratio` (no layout shift); phones use their own crops via `<picture>` (4:5 hero, 4:3 cards, 1:1 thumbs).
- Every image has a **focal point** (`object-position`) and a documented **safe area** that contains the subject; the logo and any text are never baked into photos.
- `srcset`/`sizes` for 360–430 px at 2–3× density; WebP/AVIF; first image eager, the rest lazy.

## 3. Slider doctrine (image-first)

The image is the experience. A slider on a phone is judged on what the image shows, not on what is left of it.

1. **Art-direct every slide for mobile.** A separate portrait crop (4:5, or 3:4 for tall products) is prepared per slide; the desktop image is never reused with a centered `cover` crop.
2. **Declare the focal point per slide** (`x%`, `y%`) and apply it (`object-position`); define a **safe area** (the rectangle that must stay visible). A script checks the visible share of the safe area at 320, 360, 390 and 430 px (target ≥ 95 %).
3. **Text never competes with the subject.** Either (a) image-first layout — the image is a full-bleed 4:5 block and the text sits in a card below it, which is the default for product slides; or (b) text over the lower 35–45 % of the image on a gradient scrim that guarantees 4.5:1 contrast, with the subject kept in the upper 55 %.
4. **Swipe like a native app.** CSS scroll-snap (`scroll-snap-type: x mandatory`, `scroll-snap-align: center`), the next slide peeks 8–12 % to signal it, momentum scrolling untouched; no JavaScript that fights vertical scrolling.
5. **No autoplay on phones.** If autoplay exists on larger screens it pauses on touch and focus and respects reduced motion.
6. **Clear position.** Dots 8 px with a 48 px hit area, plus an « 1 / 4 » counter; arrows hidden on touch.
7. **3 to 4 slides at most.** Each slide has one headline, one line of support, one action.
8. **Performance.** The first slide is preloaded (`fetchpriority="high"`), the others lazy; slide height comes from `aspect-ratio`, never from content, so nothing shifts.
9. **Accessibility.** Region labelled as a carousel, each slide a group « 1 sur 4 », controls reachable by keyboard, content readable without scrolling horizontally.
10. **Premium restraint.** No parallax, no zoom animation, no auto-moving text on phones.

## 4. Evidence gathering
<!-- FILLED LIVE -->

## 5. Findings per page (mobile)
<!-- FILLED LIVE -->

## 6. Slider & hero deep-dive
<!-- FILLED LIVE -->

## 7. Redesign proposals (mobile layouts)
<!-- FILLED LIVE -->

## 8. Mobile design tokens
<!-- FILLED LIVE -->

## 9. Sprint plan (agent-executable)
<!-- FILLED LIVE -->

## 10. Measurement harness & test scripts
<!-- FILLED LIVE -->

## 11. Open questions
<!-- FILLED LIVE -->

## 12. Changelog

| Date | Change |
|---|---|
| 2026-10-18 | File generated: method, lenses, premium mobile standard and slider doctrine written; evidence gathering started. |
