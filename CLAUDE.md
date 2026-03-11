# NTUTBox Template API

Cloudflare Worker serving school schedule templates as read-only JSON.

## Tech Stack

- **Runtime:** Cloudflare Workers (ES modules)
- **Storage:** Cloudflare KV (namespace: `SCHEDULE_TEMPLATES`)
- **Testing:** Vitest + @cloudflare/vitest-pool-workers
- **CI/CD:** GitHub Actions → Cloudflare Workers

## Commands

- `npm run dev` — local dev server (wrangler dev)
- `npm test` — run all tests
- `npm run deploy` — deploy to production
- `npm run seed` — sync data/templates/ to KV

## Project Structure

- `src/` — Worker source code
- `data/templates/` — source-of-truth template JSON files
- `scripts/seed-kv.js` — syncs template data to Cloudflare KV
- `test/` — Vitest integration + unit tests

## Adding a New School Template

1. Create `data/templates/{school-id}.json` (see existing files for format)
2. Add entry to `data/templates/index.json`
3. Commit, push to `main` — CI deploys and seeds KV automatically

## API Routes

- `GET /schedule/templates` — list all templates
- `GET /schedule/templates/:id` — get single template with periods

## KV Key Conventions

- `index` — template list array
- `tmpl:{id}` — individual template object

## Template Data Format

Period IDs use the university convention: `0`-`10` for daytime, `A`-`D` for evening.
Time format: 24-hour `HH:mm`. Array order = display order.
