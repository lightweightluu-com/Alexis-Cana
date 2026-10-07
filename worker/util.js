// Kleine Helfer für Antworten, Validierung und Ratenbegrenzung.

export const MENUS = ['tagesmenu', 'speisekarte', 'getraenkekarte', 'monatsweine'];

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers
    }
  });
}

export const fail = (status, error) => json({ ok: false, error }, status);

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Schneidet Texte zu und lehnt zu lange Eingaben ab.
export function text(value, max, label, { required = false } = {}) {
  const v = typeof value === 'string' ? value.trim() : '';
  if (required && !v) throw new HttpError(400, `Bitte füllen Sie das Feld «${label}» aus.`);
  if (v.length > max) throw new HttpError(400, `Das Feld «${label}» ist zu lang (maximal ${max} Zeichen).`);
  return v || null;
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function sha256Hex(input) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Erlaubt `limit` Versuche pro Zeitfenster. Gibt false zurück, wenn das Limit erreicht ist.
export async function rateLimit(db, key, limit, windowSec) {
  const now = Math.floor(Date.now() / 1000);
  const row = await db.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?').bind(key).first();
  if (!row || row.reset_at <= now) {
    await db
      .prepare('INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at')
      .bind(key, now + windowSec)
      .run();
    return true;
  }
  if (row.count >= limit) return false;
  await db.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(key).run();
  return true;
}

export async function clientKey(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'lokal';
  return (await sha256Hex(ip)).slice(0, 24);
}
