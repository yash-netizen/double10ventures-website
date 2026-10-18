import { clean, bad, CATEGORIES } from '../../../../lib/product.js';

const PREFIX = { buffetware: 'BUF', tableware: 'TBL', packaging: 'PKG', potspans: 'PNP' };

// GET /api/admin/products — every product, hidden ones included.
export async function onRequestGet({ env, data }) {
  const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY sort, sku').all();
  return Response.json({ products: results, categories: CATEGORIES, user: data.user });
}

// POST /api/admin/products — add a product. The SKU is the next free number in its category (e.g. BUF-0006).
export async function onRequestPost({ request, env }) {
  const { p, error } = clean(await request.json());
  if (error) return bad(error);
  const pre = PREFIX[p.cat];
  const last = await env.DB.prepare("SELECT sku FROM products WHERE sku LIKE ? ORDER BY sku DESC LIMIT 1").bind(pre + '-%').first();
  const sku = pre + '-' + String((last ? parseInt(last.sku.split('-')[1], 10) : 0) + 1).padStart(4, '0');
  const { next } = await env.DB.prepare('SELECT COALESCE(MAX(sort), 0) + 1 AS next FROM products').first();
  await env.DB.prepare(
    'INSERT INTO products (sku, name, cat, mat, img, finish, size, variants, description, featured, hidden, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(sku, p.name, p.cat, p.mat, p.img, p.finish, p.size, p.variants, p.description, p.featured, p.hidden, next).run();
  return Response.json({ sku }, { status: 201 });
}
