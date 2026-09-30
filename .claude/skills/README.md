# Agent Skills — Hans Amonn website

Claude Code [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills)
for building and maintaining this site. Each folder holds a `SKILL.md` that
Claude loads automatically when its `description` matches the task.

These were added from a set of reference images collecting popular AI skills
for building premium websites. Most restate the documented behaviour of an
open-source project, tailored to this repo (React + Vite + Tailwind, i18n
DE/ES, Supabase); those are attributed, not verbatim copies. **`ui-ux-pro-max`
is the full official upstream skill**, vendored verbatim from its public repo
(MIT) — including its `data/` catalogs, `references/` and Python `scripts/`
(its test suite was omitted). Check each upstream project's license before
redistributing.

| Skill | What it does | Source |
|-------|--------------|--------|
| `taste-skill` | Anti-slop frontend rules + pre-flight checklist | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · [tasteskill.dev](https://tasteskill.dev) |
| `ui-ux-pro-max` | Generate a full design system before coding (official skill, incl. data + scripts) | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT) |
| `frontend-design` | Distinctive, intentional visual design | [anthropics/claude-code](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) |
| `figma-to-code` | Figma → React/Tailwind via Figma MCP | Figma MCP |
| `playwright-testing` | E2E / visual / a11y tests in a real browser | Playwright |
| `component-libraries` | Where to get UI blocks & generated assets | shadcn/ui, 21st.dev, Higgsfield |

## Not included

- **Hyliox Skill** (horyx.studio) — appears in the reference images but is a
  gated/commercial product with no public download, so it could not be added.
  If you have access, drop its `SKILL.md` into `.claude/skills/hyliox/`.

## Upstream versions

- **`ui-ux-pro-max`** is already the official upstream skill (vendored from the
  public repo). Its search tool runs with Python 3 and no external deps:
  `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`.
  To update it, re-copy from the repo above.
- **Taste Skill**: the version here is adapted. For the verbatim upstream files,
  run its official installer on a local machine: `npx skills add Leonxlnx/taste-skill`
  (remote installers are blocked in the cloud sandbox).
