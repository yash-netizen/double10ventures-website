// Every /api/admin/* request must come through Cloudflare Access (the email sign-in in front of /admin).
// Access adds a signed token to each request; it is checked here so the API stays locked even if the
// Access rule is ever misconfigured. Needs two variables in the Pages project settings:
//   ACCESS_TEAM_DOMAIN  e.g. double10.cloudflareaccess.com
//   ACCESS_AUD          the "Application Audience (AUD) tag" of the Access application
// Running locally (`npm run dev`, which reads LOCAL_DEV=1 from .dev.vars) skips the check.

let certs = { domain: '', keys: null, at: 0 };

async function accessKeys(domain) {
  if (certs.domain === domain && certs.keys && Date.now() - certs.at < 3600e3) return certs.keys;
  const res = await fetch(`https://${domain}/cdn-cgi/access/certs`);
  const { keys } = await res.json();
  certs = { domain, at: Date.now(), keys: await Promise.all(keys.map(async (k) => ({
    kid: k.kid,
    key: await crypto.subtle.importKey('jwk', k, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']),
  }))) };
  return certs.keys;
}

const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function verify(token, env) {
  const [h, p, sig] = (token || '').split('.');
  if (!sig) return null;
  const header = JSON.parse(new TextDecoder().decode(b64(h)));
  const claims = JSON.parse(new TextDecoder().decode(b64(p)));
  const k = (await accessKeys(env.ACCESS_TEAM_DOMAIN)).find((x) => x.kid === header.kid);
  if (!k) return null;
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', k.key, b64(sig), new TextEncoder().encode(h + '.' + p));
  const aud = [].concat(claims.aud);
  if (!ok || !aud.includes(env.ACCESS_AUD) || claims.exp * 1000 < Date.now()) return null;
  return claims;
}

export async function onRequest({ request, env, next, data }) {
  if (env.LOCAL_DEV === '1') {
    data.user = 'local developer';
    return next();
  }
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return Response.json({ error: 'Admin sign-in is not set up yet (ACCESS_TEAM_DOMAIN / ACCESS_AUD).' }, { status: 503 });
  }
  const token = request.headers.get('cf-access-jwt-assertion') || (request.headers.get('cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1];
  const claims = await verify(token, env).catch(() => null);
  if (!claims) return Response.json({ error: 'Please sign in again.' }, { status: 401 });
  data.user = claims.email;
  return next();
}
