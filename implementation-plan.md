# Implementation Plan

Feature roadmap and status tracker for the Marriage Enrichment Quiz App.

---

## ✅ Phase 1 — Core Quiz MVP (Complete)

- [x] SolidJS + Vite + TypeScript project scaffold
- [x] Tailwind CSS v4 + Kobalte UI integration
- [x] 5 questions covering Principles 1–5
- [x] `WelcomeScreen` → `QuizScreen` → `ResultsScreen` navigation
- [x] Score calculation and tiered feedback (Strong / Growing / Reconnect)
- [x] Progress bar (filled by answered questions)
- [x] Accessible RadioGroup (keyboard nav, ARIA)
- [x] **Bug Fix: Kobalte RadioGroup `value={undefined}` stale selection** — see [`architecture.md`](./architecture.md#5-known-bug-kobalte-radiogroup--valueundefined)

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
| BUG-001 | Medium | **Fixed** | Kobalte `RadioGroup`: `value={undefined}` keeps stale selection on question navigation, leaving "Next" disabled. Fixed by passing `value=""`. |

---

## Open Questions

1. **Content**: Are all 7 principles finalised in the workbook text?
2. **Scoring**: Should each principle be scored independently (per-principle bar) or only as a total?
3. **Dev Agent Gateway**: Telegram bot integration for mobile access — desired?
