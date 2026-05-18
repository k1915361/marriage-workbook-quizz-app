# Architecture & Best Practices

This document outlines the architectural decisions and best practices for the
**Marriage Enrichment Quiz App**. The project prioritises a zero-budget,
minimal, highly performant, and accessible stack.

---

## Core Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **UI Framework** | [SolidJS](https://www.solidjs.com/) | Fine-grained reactivity, no virtual DOM, tiny bundle |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first, zero unused CSS in production |
| **Accessible Primitives** | [Base UI Solid](https://base-ui.com/) | Unstyled headless components (WAI-ARIA compliant) |
| **Build Tool** | [Vite](https://vitejs.dev/) | esbuild-powered HMR, fastest dev loop |
| **Language** | TypeScript (strict) | Type safety across data models and component contracts |
| **Dev Agent** | Python + OpenRouter | Hermes-style agentic loop for coding assistance |

---

## SolidJS Best Practices

### 1. Components Run Once
In SolidJS a component function is a **setup function**, not a render function.
It runs exactly once. Do not place logic in the body if you expect it to re-run.
Only code inside _tracking scopes_ (JSX, `createEffect`, `createMemo`) re-runs.

### 2. State Management Strategy

```
Primitive state  →  createSignal
Derived state    →  createMemo  (or inline in JSX)
Complex objects  →  createStore (fine-grained sub-field updates)
Cross-component  →  Context + createStore
```

**Current state**: all state lives in `App.tsx` via `createSignal`. If the
feature set grows, extract to a `QuizContext` provider.

### 3. Never Destructure Props
Destructuring loses reactivity. Always access `props.x` directly or use
SolidJS helpers:

```tsx
// ❌ Breaks reactivity
const { onNext } = props;

// ✅ Correct
props.onNext();

// ✅ Also correct (reactive split)
const [local, rest] = splitProps(props, ['onNext']);
```

### 4. Control Flow
Always use Solid's built-in flow components — they update the DOM efficiently
without recreating elements:

| Purpose | Use |
|---|---|
| List rendering | `<For>` |
| Conditional show/hide | `<Show>` |
| Screen switching | `<Switch>/<Match>` |
| Lazy mounting | `<Lazy>` |

### 5. RadioGroup Empty Selection Handling
> **Status: Preserved in `QuizScreen.tsx`**

The controlled `RadioGroup` receives `value=""` when no answer is selected.
This keeps the visual radio state aligned with `isAnswered()` while navigating
between questions.

**Fix**: Pass `value=""` (empty string) when no answer is selected:

```tsx
value={props.userAnswers[currentIndex] !== null
  ? props.userAnswers[currentIndex]!.toString()
  : ""}
onChange={(val) => { if (val !== "") props.onSelectOption(parseInt(val)); }}
```

---

## Accessibility (a11y)

- **RadioGroup**: Base UI Solid handles `role="radiogroup"`, `role="radio"`,
  `aria-checked`, and keyboard navigation (Arrow keys, Tab).
- **Progress**: Base UI Solid `<Progress>` provides `role="progressbar"` with
  `aria-valuenow` / `aria-valuemax`.
- **Focus rings**: `focus-visible:ring-4` ensures keyboard focus is always
  visible, satisfying WCAG 2.1 AA 2.4.7.
- **Colour contrast**: Blue-600 on white passes AA contrast for text.

---

## UI and Styling Best Practices

### Tailwind CSS v4
- **Utility-First**: Avoid custom CSS in `index.css`. All styling via utilities.
- **No `@apply`**: Extract a SolidJS component instead of collecting utilities.
- **Global tokens**: Base font + background on `<body>` in `index.html` — no
  `@layer base` needed.

### Design System Tokens (current)

| Token | Value |
|---|---|
| Primary font | `Outfit` (Google Fonts) |
| Background | `bg-slate-50` |
| Card | `bg-white`, `ring-1 ring-slate-200/50` |
| Accent | `blue-600` |
| Text primary | `slate-900` |
| Text secondary | `slate-500` / `slate-600` |

---

## Project Structure

```
marriage-workbook-quizz-app/
├── dev-agent/               # Hermes-style Python development agent
│   ├── .env.example         # Config template (copy → .env)
│   ├── main.py              # Agentic loop (tool use + LLM)
│   └── requirements.txt
├── src/
│   ├── components/          # SolidJS UI components
│   │   ├── QuizScreen.tsx   # Core quiz interaction
│   │   ├── ResultsScreen.tsx
│   │   └── WelcomeScreen.tsx
│   ├── data/
│   │   └── questions.ts     # Data model + scoring logic
│   ├── App.tsx              # Root component + state container
│   ├── index.css            # Tailwind entry point
│   └── index.tsx            # Application entry point
├── architecture.md          # This file
├── implementation-plan.md   # Feature roadmap
├── index.html               # HTML shell + Google Fonts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Future Considerations

| Area | Recommendation |
|---|---|
| **State** | Extract `QuizContext` if `App.tsx` grows beyond 3–4 signals |
| **Testing** | Add `vitest` for score logic + `@solidjs/testing-library` for components |
| **Data** | Move `questions.ts` to JSON; load via `import questions from './questions.json'` |
| **Persistence** | `localStorage` for in-progress quiz state (reload recovery) |
| **i18n** | SolidJS-i18n or a simple locale map if multi-language is needed |
| **Backend** | If storing results: Cloudflare Workers + D1 (zero-cost at prototype scale) |
| **Dev Agent** | Add Telegram gateway for remote mobile access to the dev agent |
