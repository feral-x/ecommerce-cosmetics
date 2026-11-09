# FiguBazaar (Frontend)

Next.js App Router + React 19 + TypeScript + Tailwind CSS v4.

## Scripts

```bash
npm run dev      # local dev (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run test     # Vitest
npm run lint     # Oxlint
```

## Structure (FSD)

- `src/app/` — Next.js routes and root layout
- `src/views/` — page compositions (imported from `app/*/page.tsx`)
- `src/widgets/`, `src/entities/`, `src/shared/` — UI, domain, shared utilities

`src/pages` is not used — it conflicts with the legacy Next.js Pages Router.
