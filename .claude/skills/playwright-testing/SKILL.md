---
name: playwright-testing
description: >-
  Write and run Playwright end-to-end and visual/accessibility checks for this
  Vite + React site. Use when the user asks to test a page or flow in a real
  browser, verify a change works, catch visual regressions, or check that forms
  (contact, rental enquiry, booking) and navigation behave correctly.
---

# Playwright Testing

Drive the real site in a browser to prove changes work, not just that they
compile. Chromium is preinstalled in this environment
(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`); do **not** run
`playwright install`.

## Setup

- If `@playwright/test` is not yet a dev dependency, add it and create a
  `playwright.config.js` with a `webServer` that runs the Vite dev/preview
  server (`npm run dev` or `npm run preview`) and a `baseURL`.
- If a project pins a specific Playwright version, launch with
  `executablePath: '/opt/pw-browsers/chromium'` instead of downloading.
- Keep tests under `tests/e2e/` (or the project's existing test folder).

## What to cover for this site

- **Smoke**: home, projects list, a project detail page, team, services and
  contact all render without console errors.
- **Navigation & routing**: header links, language switcher (DE/ES), back-to-top,
  breadcrumbs, and deep links.
- **Forms**: contact, rental/enquiry and booking forms — required-field
  validation, successful submit path, and error states (mock network where
  needed).
- **Responsive**: run key specs at 375 / 768 / 1280 px; assert no horizontal
  overflow.
- **Accessibility**: integrate `@axe-core/playwright` and assert no critical
  violations on main pages (focus order, alt text, contrast, labels).
- **Visual regression** (optional): `toHaveScreenshot()` on stable sections
  (hero, footer) to catch unintended design drift.

## Running

- `npx playwright test` for the suite; `--project=chromium` to scope.
- `npx playwright test --ui` locally; in CI/headless use the default reporter
  and upload the HTML report as an artifact.
- Always report real results: if a test fails, show the failing assertion and
  output; never claim green without running it.

## Guardrails

- Prefer role/label/text selectors over brittle CSS/nth-child.
- Keep tests deterministic: stub time, seed data, and mock external APIs
  (Supabase, analytics) rather than hitting live services.
