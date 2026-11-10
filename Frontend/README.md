# Hanami J-Beauty — Frontend

Demo e-commerce storefront for a Japanese-beauty brand (**Hanami**). The UI, filters, cart, and checkout are production-style; **product data and images** come from the public [Makeup API](https://makeup-api.herokuapp.com/api/v1/products.json) (no API key). Bundles, reviews, and payment are **local/demo** only — there is no real backend.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · Vitest

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Dev server binds to `0.0.0.0:3000` (handy for testing on a phone on the same network).

Production:

```bash
npm run build
npm run start
```

## Scripts

| Command | Description |
| -------- | ------------- |
| `npm run dev` | Development with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run test` | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |
| `npm run lint` | Oxlint |

## Main routes

| Route | Purpose |
| ----- | -------- |
| `/` | Landing (featured products from API) |
| `/catalog` | Shop — filters, sort, pagination, mobile filter sheet |
| `/search` | Full-screen search (mobile); inline search on desktop header |
| `/product/[id]` | Product detail |
| `/bundles` | Curated sets (static mock data) |
| `/cart` | Cart |
| `/checkout` | Checkout (simulated payment) |
| `/account` | Account / identify (demo) |

## Catalog & API

1. The client loads **`GET /api/catalog/bootstrap`** (TanStack Query).
2. The route fetches the Makeup API pool server-side, maps **~58 SKUs** to the app `Product` model (ids `1`…`n`), and returns facets (categories, brands, formats).
3. **Cache:** 30 minutes on the server (in-memory), plus `sessionStorage` (`hanami-catalog-bootstrap-v4`) and React Query stale time.

If the Makeup API is unavailable, bootstrap returns **503** — the catalog shows an error state with retry (no silent fallback to fake products in the UI).

**Images:** remote URLs from Makeup (`api_featured_image` / `image_link`). Hostnames are allowlisted in `next.config.ts`. In development, `dangerouslyAllowLocalIP` helps when a VPN rewrites CDN DNS.

**Note for demos:** branding is “J-Beauty”; API inventory is generic cosmetics (e.g. ColourPop). That mismatch is intentional for a portfolio demo — swap in your own API when you have one.

## What is still mocked

| Area | Source |
| ---- | ------ |
| Product catalog (runtime) | Makeup API |
| Bundles | `src/entities/bundle/model/mock-bundles.ts` |
| PDP reviews | `src/entities/product/lib/product-reviews.mock.ts` |
| Checkout / payment | `src/entities/order/lib/fake-payment.ts` |
| `mock-products.ts` | **Tests only** (Vitest fixtures) |

## Project structure (FSD)

```
src/
  app/           # Next.js routes, layout, API routes
  views/         # Page-level compositions
  widgets/       # Header, filters, landing sections, …
  entities/      # Product, cart, bundle, user, …
  shared/        # API clients, UI primitives, hooks
```

`src/pages` is not used (legacy Pages Router).

Palette tokens live in `src/app/theme-palette.css`.

## Testing

```bash
npm run test
```

97 tests covering catalog URL state, cart, header/search, checkout flow, and entity logic. Catalog tests inject a bootstrap loader; they do not hit the real Makeup API.

## Environment

Copy `.env.example` to `.env.local` if needed. **`UNSPLASH_ACCESS_KEY`** is optional legacy; the live catalog path does not depend on it.

## Deployment checklist

- Run `npm run build` on CI or the host (build hits Makeup API for static product ids / landing).
- Ensure outbound HTTPS to `makeup-api.herokuapp.com` and product image CDNs is allowed.
- If images fail on your network (VPN), try without VPN or rely on dev `dangerouslyAllowLocalIP` only locally.
- After deploy, smoke-test on a real phone: `/catalog`, `/search`, PDP add-to-cart.

## License

Private / portfolio use unless stated otherwise.
