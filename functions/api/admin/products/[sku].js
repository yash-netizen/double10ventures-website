import { clean, bad, dropMedia } from '../../../../lib/product.js';

const find = (env, sku) => env.DB.prepare('SELECT * FROM products WHERE sku = ?').bind(sku).first();

// PUT /api/admin/products/<sku> — save changes. The SKU itself stays fixed, since quote carts and links use it.
export async function onRequestPut({ request, env, params }) {
  const old = await find(env, params.sku);
  if (!old) return bad('Product not found.', 404);
  const { p, error } = clean(await request.json());
  if (error) return bad(error);
  await env.DB.prepare(
    "UPDATE products SET name = ?, cat = ?, mat = ?, img = ?, finish = ?, size = ?, variants = ?, description = ?, featured = ?, hidden = ?, updated_at = datetime('now') WHERE sku = ?"
  ).bind(p.name, p.cat, p.mat, p.img, p.finish, p.size, p.variants, p.description, p.featured, p.hidden, params.sku).run();
  if (old.img !== p.img) await dropMedia(env, old.img);
  return Response.json({ sku: params.sku });
}

// DELETE /api/admin/products/<sku> — remove the product and its uploaded photo.
export async function onRequestDelete({ env, params }) {
  const old = await find(env, params.sku);
  if (!old) return bad('Product not found.', 404);
  await env.DB.prepare('DELETE FROM products WHERE sku = ?').bind(params.sku).run();
  await dropMedia(env, old.img);
  return Response.json({ deleted: params.sku });
}
