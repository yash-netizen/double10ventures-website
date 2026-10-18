import { bad } from '../../../lib/product.js';

const TYPES = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };

// POST /api/admin/upload — store one photo in R2 and return the path to save on the product.
// The dashboard shrinks photos in the browser first (about 1600px, WebP where supported), so files stay small.
export async function onRequestPost({ request, env }) {
  const type = (request.headers.get('content-type') || '').split(';')[0];
  if (!TYPES[type]) return bad('Please upload a JPG, PNG or WebP image.');
  const body = await request.arrayBuffer();
  if (body.byteLength > 8 * 1024 * 1024) return bad('That image is too large (8 MB maximum).');
  const key = `products/${crypto.randomUUID()}.${TYPES[type]}`;
  await env.MEDIA.put(key, body, { httpMetadata: { contentType: type } });
  return Response.json({ img: 'media/' + key }, { status: 201 });
}
