// Shared by the admin product endpoints: which fields can be edited, and how a form body is cleaned up.
export const CATEGORIES = ['buffetware', 'tableware', 'packaging', 'potspans'];
const TEXT = ['name', 'cat', 'mat', 'img', 'finish', 'size', 'variants', 'description'];

export function clean(body) {
  const p = {};
  for (const k of TEXT) p[k] = String(body[k] ?? '').trim().slice(0, k === 'description' ? 4000 : 500);
  p.featured = body.featured ? 1 : 0;
  p.hidden = body.hidden ? 1 : 0;
  if (!p.name) return { error: 'Product name is required.' };
  if (!CATEGORIES.includes(p.cat)) return { error: 'Choose a category.' };
  return { p };
}

// Uploaded photos live in R2 under media/<key>; remove one when its product no longer uses it.
export async function dropMedia(env, img) {
  if (img && img.startsWith('media/')) await env.MEDIA.delete(img.slice('media/'.length));
}

export const bad = (error, status = 400) => Response.json({ error }, { status });
