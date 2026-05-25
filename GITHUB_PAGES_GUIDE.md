# GitHub Pages Deployment Guide

## How it works

```
pnpm run build   (with GITHUB_PAGES=true)
       │
       ▼
  dist/           ← build output at the repo root
  ├── index.html
  └── assets/
       ├── index-*.js
       └── index-*.css
       │
       ▼
  gh-pages branch (root)
       │
       ▼
  https://<owner>.github.io/marriage-workbook-quizz-app/
```

The CI workflow (`deploy-pages.yml`) runs automatically on every push to `main`. It builds the app, then pushes the **contents** of `dist/` (not the folder itself) to the root of the `gh-pages` branch using `JamesIves/github-pages-deploy-action`.

---

## GitHub repository settings required

**Settings → Pages → Build and deployment**

| Setting | Value |
|---------|-------|
| Source | **Deploy from a branch** |
| Branch | **gh-pages** |
| Folder | **/ (root)** |

> If you see "GitHub Actions" as the Source instead, switch it to  
> "Deploy from a branch" and select `gh-pages` / `(root)`.

---

## Build output location

`dist/` at the **repo root** — created (and overwritten) by every build.  
The `gh-pages` branch mirrors this folder; **never edit `gh-pages` by hand**.

---

## Base path (asset URLs)

`scripts/build.mjs` reads the `GITHUB_PAGES` environment variable:

```js
const base = process.env.GITHUB_PAGES === 'true'
  ? '/marriage-workbook-quizz-app/'
  : '/';
```

| Context | Base path | How to trigger |
|---------|-----------|----------------|
| Local dev (`pnpm dev`) | `/` | default |
| Local production preview (`pnpm preview`) | `/` | default |
| GitHub Pages build | `/marriage-workbook-quizz-app/` | set `GITHUB_PAGES=true` |

If you **rename the repository**, update the base string in `scripts/build.mjs`.

---

## Manual / local commands

```bash
# 1. Install all workspace dependencies (including packages/quiz-data, packages/quiz-engine)
pnpm install

# 2. Build exactly as CI does (output → dist/)
GITHUB_PAGES=true pnpm run build          # macOS / Linux
$env:GITHUB_PAGES='true'; pnpm run build  # Windows PowerShell

# 3. Preview the built output locally (serves at http://localhost:4173)
pnpm preview
```

> `pnpm preview` serves from `dist/` with base `/`, so asset links work locally  
> even though the deployed site uses the `/marriage-workbook-quizz-app/` base.

---

## CI workflow reference

**File:** `.github/workflows/deploy-pages.yml`  
**Triggers:** push to `main`, or manual dispatch from the Actions tab  
**Key steps:**

1. `pnpm install --frozen-lockfile` — install exact locked deps
2. `pnpm run build` (with `GITHUB_PAGES=true`) — produce `dist/`
3. `JamesIves/github-pages-deploy-action@v4` — push `dist/` contents to the `gh-pages` branch (`clean: true` removes stale files)

**Required permission:** `contents: write` (set in the workflow; no extra repo configuration needed).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Blank page / 404 on assets | Wrong base path | Ensure `GITHUB_PAGES=true` was set during build |
| Pages shows old content | `gh-pages` branch not updated | Check the Actions tab for workflow failures |
| "404 Not Found" on the whole site | Pages not configured | Set Source to "Deploy from a branch → gh-pages / root" in repo Settings |
| Workflow fails on `pnpm install` | Lockfile out of sync | Run `pnpm install` locally and commit the updated `pnpm-lock.yaml` |
