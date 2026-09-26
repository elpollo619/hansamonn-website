---
name: frontend-design
description: >-
  Guidance for distinctive, intentional visual design when building new UI or
  reshaping existing interfaces. Use when creating web components, pages, or
  sections and design quality matters — to avoid generic AI-default aesthetics
  and make deliberate choices about palette, typography and layout.
---

# Frontend Design

Adapted for this repo from Anthropic's official **frontend-design** skill in
https://github.com/anthropics/claude-code (plugins/frontend-design). Credit to
Anthropic. This restates its guidance; see the upstream LICENSE for terms.

Design as a studio lead would: make deliberate, opinionated choices about
palette, typography and layout that are specific to *this* brief — not
defaults.

## Principles

**Ground in the subject matter.** Understand the product, audience and primary
function before designing. For this repo that means Swiss architecture and
real estate: precision, materials, restraint. Extract aesthetic direction from
that vernacular.

**Typography as personality.** Use one or two typeface families (clearly
distinct if two). Set an intentional type scale. Avoid reflexive all-caps
labels and unnecessary typographic chrome.

**Visual structure as information.** Structural devices should encode meaning,
not decorate. Numbered sequences are for genuinely sequential content only.

**Motion and decoration.** Use non-user-triggered motion sparingly and
deliberately, only to draw attention. One orchestrated moment beats scattered
transitions. Respect `prefers-reduced-motion`.

## Red flags (AI-generated defaults to avoid)

- Warm cream backgrounds with terracotta accents used as a reflex "premium" look.
- High-contrast near-black with acid/neon accents for no reason.
- Newspaper/editorial layout applied where it adds nothing.
- Identical rounded-card systems as the only structural idea.
- Repeated chrome elements (fake toolbars, redundant badges).

## Process — two passes

1. **Token pass.** Create a compact token system: color roles, type scale,
   spacing/layout rhythm, and 2–3 guiding principles for this page.
2. **Review pass.** Check the tokens against the brief for uniqueness and fit
   *before* writing components. Then implement in React + Tailwind, reusing the
   project's existing tokens and components.

## Writing principles

Copy serves understanding, not decoration. Active voice, plain language,
conversational but precise. Keep each written element doing exactly one job.
