---
name: ui-ux-pro-max
description: >-
  Design-intelligence engine: given a page or product brief, produce a complete
  design system (pattern, style priority, color mood, typography pairing, key
  effects, anti-patterns, accessibility checklist) BEFORE writing UI code. Use
  when starting a new page/section, choosing colors or fonts, or when the user
  asks "what design should this use" for the Hans Amonn website.
---

# UI UX Pro Max — Design Intelligence

Adapted for this repo from the open-source **UI UX Pro Max** skill —
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (MIT). Credit to the
original authors. This restates the method in a form tailored to this project;
it is not the upstream data set or scripts.

Purpose: turn a vague request into an explicit, reviewable **design system**
first, so the code that follows is coherent instead of improvised.

## Workflow

1. **Classify the brief.** Identify product type (real-estate listing,
   corporate/about, contact/lead form, team page, blog) and audience.
2. **Generate a design system** — output the seven components below as a short
   spec the user can approve.
3. **Only then implement** in React + Tailwind, reusing the tokens in
   `tailwind.config.js` and existing components under `src/components/`.

## The seven output components

For every brief, produce:

1. **Recommended pattern** — the dominant layout archetype (e.g. split hero,
   image-led gallery grid, editorial long-form, sticky-sidebar detail view).
2. **Style priority** — the one adjective that wins ties (e.g. "calm &
   architectural" for Hans Amonn). Everything else defers to it.
3. **Color mood palette** — 4–6 roles (background, surface, text, muted,
   primary, accent) as Tailwind tokens/hex. Keep it consistent with the
   existing brand; do not invent a new palette per page.
4. **Typography recommendation** — a heading/body pairing with an intentional
   scale. Prefer one or two families, clearly distinguished.
5. **Key effects guidance** — the few effects that carry the design (e.g. soft
   elevation, restrained parallax on hero, hover reveal on project cards).
   Name them; do not scatter effects everywhere.
6. **Anti-patterns to avoid** — the specific traps for this product type
   (e.g. clip-art icons, rainbow gradients, cramped tables on mobile).
7. **Pre-delivery accessibility checklist** — contrast AA+, keyboard focus,
   semantic landmarks, alt text, reduced-motion support, target sizes ≥ 44px.

## Notes for this project

- The site already ships a Tailwind theme, i18n (DE/ES), lazy images and a
  design language across `Hero`, `Projects`, `Services`, `Team`. New work must
  extend that language, not fork it.
- When a full data-driven generator is wanted, point the user to the upstream
  CLI (`npm i -g ui-ux-pro-max-cli`) rather than reimplementing it here.
