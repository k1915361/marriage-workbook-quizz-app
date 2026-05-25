# Marriage Enrichment Quiz

Quiz app based on **"The 7 Principles of Creation Marriage Enrichment Workbook"** by Stephen Stacey.

Built with SolidJS · Base UI Solid · Vite · pnpm workspaces.

---

## Development

```bash
pnpm install   # installs all workspace packages (packages/quiz-data, packages/quiz-engine, app)
pnpm dev       # dev server at http://localhost:3000
pnpm test      # watch mode
pnpm test:run  # single run
pnpm build     # production build → dist/
pnpm preview   # serve dist/ locally at http://localhost:4173
```

## Deployment — GitHub Pages

The app is deployed to GitHub Pages from the `gh-pages` branch (root).

**GitHub Settings → Pages → Source:** `Deploy from a branch` → `gh-pages` / `(root)`

On every push to `main`, the CI workflow (`.github/workflows/deploy-pages.yml`) builds the app and pushes `dist/` to the `gh-pages` branch automatically.

To build exactly as CI does:

```bash
# macOS / Linux
GITHUB_PAGES=true pnpm run build

# Windows PowerShell
$env:GITHUB_PAGES='true'; pnpm run build
```

See **[GITHUB_PAGES_GUIDE.md](./GITHUB_PAGES_GUIDE.md)** for the full deployment reference — build output location, base path configuration, manual commands, and troubleshooting.

---

## Project structure

```
packages/
  quiz-data/     @marriage-workbook/quiz-data    — question bank + scoring
  quiz-engine/   @marriage-workbook/quiz-engine  — shuffle, types, export logic
src/             SolidJS web app
```

See [architecture.md](./architecture.md) for deeper detail.
