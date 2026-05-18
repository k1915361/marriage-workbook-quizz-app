# Base UI Solid Research

## What I checked

- The Solid docs site: `https://base-ui-docs-solid.vercel.app/solid/overview/quick-start`
- The Form docs page: `https://base-ui-docs-solid.vercel.app/solid/components/form`
- The published package metadata for `@msviderok/base-ui-solid`
- The local app’s `src/index.tsx`, `src/index.css`, `src/theme.css`, and `src/index.module.css`

## Findings

### GitHub presence

- The upstream Base UI project has an official GitHub repo at `mui/base-ui`.
- The Solid package is an unofficial port. Its package metadata points at `msviderok/base-ui` with the Solid sources under `packages/solid`.
- The docs site itself is a documentation surface, not the source of truth for the package behavior.

### CSS model

- Base UI Solid is unstyled and headless.
- It does not ship a required CSS file for every component.
- Styling is expected to come from the app, using plain CSS, CSS Modules, Tailwind, or any other styling system.

### What the current files mean

- `src/theme.css` is only a small token/example stylesheet.
- `src/index.module.css` is example popover CSS and is not imported anywhere, so it currently does nothing.
- `src/index.css` currently only sets `#app { isolation: isolate; }`, which is useful for portals but does not style the page.

## Conclusion

If the page looks like plain HTML, the missing piece is not a Base UI component CSS bundle.
The app still needs a real global styling layer of its own.

Do not import `src/index.module.css` globally as a replacement for app styling.
Use Base UI Solid for behavior and accessibility, then add or restore the app’s own stylesheet layer for layout, typography, spacing, and colors.
