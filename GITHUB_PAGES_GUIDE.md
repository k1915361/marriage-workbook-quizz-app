# GitHub Pages

**Source:** GitHub Actions (not branch deployment)

**Settings → Pages → Build and deployment → Source → GitHub Actions**

The workflow installs deps, runs `pnpm build`, and deploys `dist/`. The Vite base path is set to `/marriage-workbook-quizz-app/` when `GITHUB_PAGES=true` is set in the environment.

If you rename the repo, update the base path in `vite.config.ts`.
