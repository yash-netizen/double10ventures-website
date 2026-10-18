// GET /media/<key> — product photos uploaded from /admin, served from the R2 bucket.
export async function onRequestGet({ env, params, request }) {
  const key = [].concat(params.key || []).join('/');
  const obj = await env.MEDIA.get(key, { onlyIf: request.headers });
  if (!obj) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  // uploads get a fresh key every time, so a file never changes and can be cached for a year
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response('body' in obj ? obj.body : null, { status: 'body' in obj ? 200 : 304, headers });
}
