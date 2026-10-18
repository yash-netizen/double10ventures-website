// GET /assets/catalogue.js — the live product list from D1, in the shape site.js expects.
// Overrides the bundled mockup/assets/catalogue.js when the site runs on Cloudflare.
export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT sku, name, cat, mat, img, finish, size, variants, description, featured FROM products WHERE hidden = 0 ORDER BY sort, sku'
  ).all();
  const products = results.map(({ description, ...p }) => ({ ...p, desc: description }));
  // "<" is escaped so a product field can never close the script.
  const body = 'window.D10_PRODUCTS = ' + JSON.stringify(products).replace(/</g, '\\u003c') + ';\n';
  return new Response(body, {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      // browsers and Cloudflare's edge may reuse it for a minute, so a change in /admin is live within about a minute
      'cache-control': 'public, max-age=60',
    },
  });
}
