# Agent Skills — Hans Amonn website

Claude Code [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills)
for building and maintaining this site. Each folder holds a `SKILL.md` that
Claude loads automatically when its `description` matches the task.

These were added from a set of reference images collecting popular AI skills
for building premium websites. Skills marked "adapted from" restate the
documented behaviour of an open-source project, tailored to this repo (React +
Vite + Tailwind, i18n DE/ES, Supabase); they are attributed, not verbatim
copies. Check each upstream project's license before redistributing.

| Skill | What it does | Source |
|-------|--------------|--------|
| `taste-skill` | Anti-slop frontend rules + pre-flight checklist | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · [tasteskill.dev](https://tasteskill.dev) |
| `ui-ux-pro-max` | Generate a full design system before coding | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) |
| `frontend-design` | Distinctive, intentional visual design | [anthropics/claude-code](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) |
| `figma-to-code` | Figma → React/Tailwind via Figma MCP | Figma MCP |
| `playwright-testing` | E2E / visual / a11y tests in a real browser | Playwright |
| `component-libraries` | Where to get UI blocks & generated assets | shadcn/ui, 21st.dev, Higgsfield |

## Not included

- **Hyliox Skill** (horyx.studio) — appears in the reference images but is a
  gated/commercial product with no public download, so it could not be added.
  If you have access, drop its `SKILL.md` into `.claude/skills/hyliox/`.

## Installing the real upstream versions

Some of these ship official installers you can run locally (outside this
sandbox, which blocks executing remote installers):

- Taste Skill: `npx skills add Leonxlnx/taste-skill`
- UI UX Pro Max: `npm i -g ui-ux-pro-max-cli && uipro init --ai claude`

Running those will overwrite the adapted versions here with the upstream files.
