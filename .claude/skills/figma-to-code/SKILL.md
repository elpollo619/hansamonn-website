---
name: figma-to-code
description: >-
  Convert Figma designs into React + Tailwind components for this website, and
  keep code and design in sync. Use when the user shares a figma.com URL, asks
  to implement a design/mockup/screen from Figma, or wants to push a page back
  into Figma. Relies on the Figma MCP server tools when available.
---

# Figma → Code

Turn Figma designs into production React + Tailwind that matches this repo's
conventions. This skill orchestrates the **Figma MCP** tools; it does not
replace them.

## When this triggers

- The user pastes a `figma.com/...` link (file, frame, or node).
- "Implement this design", "build this screen", "match the mockup".
- "Push this component/page into Figma" (code → design).

## Workflow (design → code)

1. **Read the design.** Use the Figma MCP tools (e.g. `get_design_context`,
   `get_screenshot`, `get_metadata`, `get_variable_defs`) to pull layout,
   spacing, colors, type and assets from the selected frame/node. If the Figma
   MCP is not connected, ask the user to connect it (claude.ai connectors or
   `/mcp`) or to export the frame as PNG + a spec.
2. **Map tokens to the repo.** Translate Figma variables to existing Tailwind
   tokens in `tailwind.config.js`. Do **not** hard-code hex/px when a token
   exists. Add new tokens only when the design genuinely introduces them.
3. **Reuse components.** Prefer existing components in `src/components/`
   (buttons, cards, forms, `ui/` primitives) before creating new ones.
4. **Build responsive.** Implement mobile-first; verify 375 / 768 / 1280 px.
5. **Assets.** Download exports via the Figma MCP into `public/` or `src`, use
   the project's lazy-image pattern, and always set `alt` text.
6. **i18n.** Route all visible strings through the existing i18n system
   (`src/i18n`), never inline literals.

## Workflow (code → design)

When asked to push UI into Figma, use the Figma MCP write tools
(`create_new_file` / `use_figma` per the Figma skill) and follow the mandatory
`/figma-use` skill before calling `use_figma`.

## Guardrails

- Follow the design skills in this repo (`frontend-design`, `taste-skill`,
  `ui-ux-pro-max`) — a faithful Figma port must still pass their checklists.
- Never invent brand assets; ask if a logo/photo is missing.
- Keep diffs small and match the surrounding code style.
