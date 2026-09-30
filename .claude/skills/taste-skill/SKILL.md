---
name: taste-skill
description: >-
  Anti-slop frontend design rules for building landing pages, hero sections,
  portfolios and redesigns that do NOT look AI-generated. Use whenever creating
  or restyling a public-facing page, section or component in this website
  (React + Vite + Tailwind), or when the user asks for a "premium", "modern",
  "not generic" or "high-taste" design. Enforces a hard pre-flight checklist
  before the design is considered done.
---

# Taste Skill — Anti-Slop Frontend

Adapted for this repo from the open-source **Taste Skill** ("The Anti-Slop
Frontend Framework for AI Agents") — https://tasteskill.dev ·
https://github.com/Leonxlnx/taste-skill (MIT). Credit to the original authors.
This file restates its rules; it is not a verbatim copy.

Goal: prevent generic, templated output. Every page should look like a
deliberate design decision was made, not a default.

## 1. Design Read first (before any code)

Read the room and output a single-line **Design Read** stating your
interpretation before writing markup:

- **Page kind** — landing, hero, portfolio, detail page, form, dashboard.
- **Audience** — for this repo: prospective tenants/buyers and partners of a
  Swiss architecture & real-estate firm (Hans Amonn AG). Tone is trustworthy,
  precise, understated-premium — not flashy startup.
- **Vibe signals & references** — alpine, architectural, material, calm.
- **Constraints** — must stay within the existing Tailwind theme
  (`tailwind.config.js`), i18n (DE/ES/…), and component conventions in `src/`.

## 2. Three dials (declare them explicitly)

Tune every output on three axes and state the chosen values:

- `DESIGN_VARIANCE` 1–10 — symmetry → asymmetry.
- `MOTION_INTENSITY` 1–10 — static → cinematic.
- `VISUAL_DENSITY` 1–10 — gallery (airy) → cockpit (dense).

For this brand, defaults sit around variance 4, motion 3, density 4:
composed and confident, not loud.

## 3. Anti-AI tells (never ship these)

- No em-dashes (`—`) in body copy. Use commas, colons or restructure.
- No default Inter-everywhere. Pick intentional type; if two families, make
  them clearly distinct.
- No beige + brass "luxury" palette by reflex, and no serif-by-default.
- No three identical equal feature cards as the only layout idea.
- No placeholder "Jane Doe / Lorem ipsum" copy in delivered work.
- No `<div>`-based fake screenshots or fake browser chrome.
- One page theme lock: a single theme across all sections, no mid-page
  light/dark inversions unless it encodes real meaning.

## 4. Hard rules

- **Hero fits the viewport**: headline ≤ 2 lines, subtext ≤ ~20 words, primary
  CTA visible without scrolling.
- **Eyebrow restraint**: at most one eyebrow/kicker label per three sections.
- **No duplicate CTA intent**: "Get in touch" and "Contact us" are the same
  intent — pick one per view.
- **Real images required**: no text-only pages. Use real project photography
  already in `public/`/`src`, or explicit, labelled placeholders.
- **Copy does one job**: active voice, plain language, each element earns
  its place.

## 5. Pre-flight checklist (all must pass)

Before declaring a design done, verify mechanically:

- [ ] Design Read line was produced and the three dials are stated.
- [ ] Zero em-dashes in copy.
- [ ] Hero fits viewport; headline ≤ 2 lines; CTA above the fold.
- [ ] One theme across the page; no unexplained inversions.
- [ ] No three-equal-cards-only layout; structure encodes meaning.
- [ ] Typographic scale is intentional (not all `text-base`/`text-xl`).
- [ ] Real images or explicit placeholders; no fake chrome.
- [ ] Uses existing Tailwind tokens and i18n keys, not hard-coded strings.
- [ ] Accessible: color contrast ≥ WCAG AA, focus states, alt text.
- [ ] Responsive at 375 / 768 / 1280 px with no horizontal scroll.

Failing any single box means the page is **not** done.
