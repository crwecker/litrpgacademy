# LitRPG Academy

Find, rank, and share LitRPG, progression fantasy, cultivation, and isekai books. See
[docs/VISION.md](docs/VISION.md) for the product direction and roadmap.

## Stack

- Next.js 16 (App Router, Cache Components) with React 19 and Tailwind CSS 4
- Prisma 7 with the `pg` driver adapter on Neon Postgres
- Deployed on Netlify

## Development

```sh
npm install          # also runs prisma generate
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

Requires Node 24 (see `.nvmrc`) and a `.env` with `DATABASE_URL` (Neon pooled connection string).

**The database is shared with the live site.** Never run `prisma migrate dev`, `db push`, or `migrate reset`
against it. Use a Neon branch for schema work.

## Layout

- `src/app`: routes (`/`, `/books`, `/book/[bookId]`, `/realm/[realmId]`, sitemap, robots)
- `src/lib/books.ts`: all catalog queries, cached with `'use cache'`
- `src/lib/realms.ts`: realm definitions and their Royal Road tags
- `legacy/`: the 2025 Vite app, kept for reference while porting
