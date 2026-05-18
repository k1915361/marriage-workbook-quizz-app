# Implementation Plan

Feature roadmap and status tracker for the Marriage Enrichment Quiz App.

---

## ✅ Phase 1 — Core Quiz MVP (Complete)

- [x] SolidJS + Vite + TypeScript project scaffold
- [x] Base UI Solid primitive integration
- [x] 5 questions covering Principles 1–5
- [x] `WelcomeScreen` → `QuizScreen` → `ResultsScreen` navigation
- [x] Score calculation and tiered feedback (Strong / Growing / Reconnect)
- [x] Progress bar (filled by answered questions)
- [x] Accessible RadioGroup (keyboard nav, ARIA)
- [x] **RadioGroup empty selection handling** — see [`architecture.md`](./architecture.md#5-radiogroup-empty-selection-handling)

## 🚧 Current Work — Button-first UI Migration

- Preparing the `Button` component integration in `src/components/ui/Button.tsx`
- Goal: use Base UI Solid primitives while preserving the existing `variant`, `size`, and `fullWidth` API
- Map props to existing CSS class tokens such as `button--primary`, `button--secondary`, `button--ghost`, and size classes
- Keep the public `Button` component API stable so screens and helper components do not require import changes
- Verify with unit tests in `src/components/ui/Button.test.tsx`
- Also diagnosing the Playwright runner environment to ensure `npm run test:e2e` works after the button refactor

---

## 🔧 Phase 2 — Quality & Developer Experience

- [x] Hermes-style dev agent (`dev-agent/main.py`) with tool use
- [x] `architecture.md` with SolidJS best practices and bug log
- [ ] Add `vitest` for score logic unit tests
- [ ] Add `@solidjs/testing-library` for component smoke tests
- [ ] ESLint + Prettier setup
- [ ] Add `.gitignore` entry for `dev-agent/.env`

---

## 📚 Phase 3 — Content Expansion

- [ ] Complete all 7 principles (currently 5 of 7 covered)
- [ ] 3–5 questions per principle (currently 1 per principle)
- [ ] Per-principle breakdown on results screen
- [ ] Animated transition between questions (slide or fade)

---

## 🏗 Phase 4 — User Experience Polish

- [ ] `localStorage` persistence (reload recovery for in-progress quiz)
- [ ] Keyboard shortcut: press 1–4 to select option, Enter to advance
- [ ] Print / share results (copy link or export PDF)
- [ ] Dark mode support

---

## 🚀 Phase 5 — Optional Backend (if needed)

> Only pursue if aggregated results or authentication becomes a requirement.

- [ ] Cloudflare Workers API endpoint for result submission
- [ ] Cloudflare D1 (SQLite) for result storage — zero-cost at prototype scale
- [ ] Anonymous session tokens (no PII stored)

---

## Known Bugs & Issues

| ID | Severity | Status | Description |
|---|---|---|---|
| BUG-001 | Medium | **Fixed** | `RadioGroup`: empty selections are represented with `value=""` so question navigation does not keep stale selected state. |

---

## Open Questions

1. **Content**: Are all 7 principles finalised in the workbook text?
2. **Scoring**: Should each principle be scored independently (per-principle bar) or only as a total?
3. **Dev Agent Gateway**: Telegram bot integration for mobile access — desired?
