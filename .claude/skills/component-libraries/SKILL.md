---
name: component-libraries
description: >-
  Curated catalog of component libraries, UI blocks and generative asset tools
  for building premium web pages, with guidance on when to use each. Use when
  the user wants a specific UI block (hero, pricing, testimonials, bento grid),
  polished components, animations, or generated marketing imagery for the site.
---

# Component & Asset Libraries

A shortlist of high-quality sources for UI blocks, components and generated
assets, plus when to reach for each. Prefer sources that fit this repo's stack
(React + Vite + Tailwind, `components.json` present so shadcn/ui-compatible).

## Component libraries & blocks

- **shadcn/ui** — https://ui.shadcn.com — accessible, unstyled-then-themed React
  components you copy into the repo. First choice for primitives (dialog, form,
  dropdown, tabs). This repo already has `components.json` and a `ui/` folder.
- **21st.dev** — https://21st.dev/community/components — community marketing
  blocks (heroes, CTAs, footers, features, backgrounds, testimonials). Good for
  landing-page sections; adapt to the repo's tokens before committing.
- **Tailwind UI / Flowbite / HyperUI** — production Tailwind blocks for common
  patterns. Use as reference; re-theme to the brand.
- **Aceternity UI / Magic UI** — animated, motion-heavy React + Tailwind
  components. Use sparingly and respect `prefers-reduced-motion` (see the
  `taste-skill` motion rules).

## Generative asset tools (imagery / video)

- **Higgsfield** — https://higgsfield.ai — generate ad/product imagery and
  video for hero and marketing sections when real photography is missing. Treat
  output as a placeholder until brand-approved; never present AI imagery as a
  real Hans Amonn project.
- Also available in this environment: the **Adobe** image/vector tools and
  **Figma** MCP (see the `figma-to-code` skill) for real asset work.

## How to use with this project

1. Pick the block/component closest to the need.
2. Port it into `src/components/`, replacing hard-coded colors/spacing/fonts
   with the repo's Tailwind tokens and routing text through i18n.
3. Run it through the design skills (`frontend-design`, `taste-skill`,
   `ui-ux-pro-max`) and the pre-flight checklist before shipping.
4. Verify responsiveness and accessibility (the `playwright-testing` skill).

## Guardrails

- Check each source's license before copying code or assets into the repo.
- Do not add heavy dependencies for a single component — copy the minimal code.
- Keep the visual language consistent; these are ingredients, not a redesign.
