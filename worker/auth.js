// Anmeldung mit einem einzelnen Admin-Passwort (Worker-Secret ADMIN_PASSWORD).
// Die Sitzung ist ein signiertes Cookie ohne Serverzustand.

const COOKIE = '__Host-ac_admin';
const SESSION_SECONDS = 12 * 60 * 60;
const enc = new TextEncoder();

const b64url = (buf) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(`alexis-cana-session-v1:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(secret, payload) {
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload));
  return b64url(sig);
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function passwordMatches(env, given) {
  if (!env.ADMIN_PASSWORD || typeof given !== 'string') return false;
  // Beide Seiten hashen, damit Länge und Laufzeit nichts verraten.
  const [a, b] = await Promise.all(
    [given, env.ADMIN_PASSWORD].map(async (v) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(v))))
  );
  return safeEqual(a, b);
}

export async function sessionCookie(env) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(exp);
  const token = `${payload}.${await sign(env.ADMIN_PASSWORD, payload)}`;
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function isAuthenticated(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const raw = (request.headers.get('Cookie') || '').split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split('.');
  if (!payload || !sig) return false;
  if (Number(payload) < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sig, await sign(env.ADMIN_PASSWORD, payload));
}
