# Architecture

## Stack

| Layer | Technology |
|---|---|
| UI framework | SolidJS |
| Styling | Plain CSS (`src/styles/app.css`) with Base UI design tokens |
| Accessible primitives | `@msviderok/base-ui-solid` (headless — no bundled CSS) |
| Build | Vite |
| Language | TypeScript strict |

## SolidJS notes

**Components run once.** Only code inside JSX, `createEffect`, or `createMemo` re-runs.

**Never destructure props** — it breaks reactivity. Use `props.x` directly or `splitProps`.

**Control flow:** use `<For>`, `<Show>`, `<Switch>/<Match>` — not JS conditionals in JSX.

**State location:** all state in `App.tsx` via `createSignal`. Extract to a `QuizContext` if it grows.

## RadioGroup empty selection

`RadioGroup` receives `value=""` when no answer is selected. This keeps the radio state in sync when navigating between questions without a stale selection.

## Base UI CSS model

Base UI is headless — it handles ARIA, keyboard nav, and state; you own all visual CSS. `src/styles/base-ui/` is the Base UI *docs site* stylesheet, not importable component styles. App styles live in `src/styles/app.css`.
