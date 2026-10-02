# Haulwise 2026 Full-App Redesign

## Goal
Apply the selected Cyber-industrial Glass direction consistently across every existing page while preserving all current data, authentication, and workflows.

## What will change
- Rebuild the persistent sidebar, top bar, menus, search, notifications, and mobile navigation in the selected dark operational style.
- Restyle shared page headings, cards, status indicators, tables, filters, pagination, empty/loading/error states, forms, drawers, and confirmations.
- Bring Dashboard and Reports charts into the same high-contrast telemetry system with clear legends, tooltips, and status colors.
- Redesign sign-in, account creation, password reset, Settings, error, and not-found screens to match the product.
- Add Appearance controls in Settings for theme, typography, and density, saved on the current device and applied throughout the app.
- Check every current page at desktop and mobile sizes, including long tables and drawers.

## Technical details
- Keep the existing TanStack routes, Lovable Cloud data access, authentication, and mutations unchanged.
- Centralize visual presets in semantic CSS tokens and a small appearance provider; no page-specific hardcoded color system.
- Use existing reusable controls and update shared components first so all CRUD pages inherit the new system.
- Preserve reduced-motion support and accessible focus/contrast states.
- Add missing per-page social metadata fields where required.
