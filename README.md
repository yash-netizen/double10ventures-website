# Double 10 Ventures — Website

Website for Double 10 Ventures: Consulting & Projects and Supplies & Sourcing. It runs on Cloudflare (free plan):

| Piece | Cloudflare product | Where in this repo |
|---|---|---|
| Website | Pages | `mockup/` |
| Product data | D1 (SQL database `d10-catalogue`) | `db/schema.sql`, `db/seed.sql` |
| Uploaded product photos | R2 (bucket `d10-media`) | served at `/media/...` by `functions/media/` |
| Owner's dashboard | Pages page at `/admin/` | `mockup/admin/index.html` |
| Dashboard API | Pages Functions at `/api/admin/...` | `functions/api/admin/`, `lib/product.js` |
| Dashboard sign-in | Zero Trust Access (email one-time code) | checked in `functions/api/admin/_middleware.js` |

The public pages load `assets/catalogue.js`. On Cloudflare that file is generated live from the database (`functions/assets/catalogue.js.js`), so products added in `/admin/` appear on the site within about a minute. Opened without Cloudflare, the pages fall back to the bundled `mockup/assets/catalogue.js`. Categories and project data are still in `mockup/assets/site.js` and `mockup/assets/projects.js`.

## Run locally

```bash
npm install
npm run db:seed:local   # first time: creates the local database with the starting products
npm run dev             # http://localhost:8788, dashboard at http://localhost:8788/admin/
```

Locally the dashboard needs no sign-in (`.dev.vars` sets `LOCAL_DEV=1`; that file is never deployed). Uploaded photos go to a local R2 copy in `.wrangler/`.

## First deployment (one time)

1. Create a Cloudflare account and turn on R2 (Dashboard → R2). R2 asks for a card, but the free tier is not charged.
2. `npx wrangler login`
3. `npx wrangler d1 create d10-catalogue`, then copy the printed `database_id` into `wrangler.toml`.
4. `npx wrangler r2 bucket create d10-media`
5. `npm run db:seed:remote`, which loads the starting products into the live database.
6. `npx wrangler pages project create double10ventures --production-branch main`, then `npm run deploy`.
7. Lock the dashboard: Zero Trust → Access → Applications → Add → Self-hosted.
   - Domain `double10ventures.pages.dev` (and the custom domain, if any), paths `admin` and `api/admin`.
   - Policy: Allow, Emails = the owner's email address (and yours).
   - Copy the application's **Audience (AUD) tag**, and your team domain (Zero Trust → Settings, e.g. `double10.cloudflareaccess.com`).
8. Pages project → Settings → Variables: add `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`, then `npm run deploy` again.

After that, deploy site changes with `npm run deploy`. Product changes need no deploy.
