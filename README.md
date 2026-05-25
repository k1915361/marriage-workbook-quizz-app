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

**GitHub Settings → Pages → Source:** `Deploy from a branch` → `gh-pages` / `(root)`

### Deploy from your machine (recommended — no CI needed)

```bash
# macOS / Linux
GITHUB_PAGES=true pnpm run build
pnpm run deploy:pages

# Windows PowerShell
$env:GITHUB_PAGES='true'; pnpm run build
pnpm run deploy:pages
```

`deploy:pages` pushes `dist/` contents directly to the `gh-pages` branch via the `gh-pages` package. GitHub Pages serves it automatically. No GitHub Actions minutes required.

### Automated CI (optional)

`.github/workflows/deploy-pages.yml` runs the same two steps on every push to `main`. Requires GitHub Actions to be available on your account.

See **[GITHUB_PAGES_GUIDE.md](./GITHUB_PAGES_GUIDE.md)** for the full reference.

---

## Project structure

```
packages/
  quiz-data/     @marriage-workbook/quiz-data    — question bank + scoring
  quiz-engine/   @marriage-workbook/quiz-engine  — shuffle, types, export logic
src/             SolidJS web app
```

See [architecture.md](./architecture.md) for deeper detail.
