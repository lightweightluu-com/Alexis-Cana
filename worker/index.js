import { HttpError, MENUS, clientKey, fail, isEmail, json, rateLimit, text } from './util.js';
import { clearCookie, isAuthenticated, passwordMatches, sessionCookie } from './auth.js';

const MAX_FILE = 5 * 1024 * 1024;
const FILE_TYPES = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};
const INQUIRY_TYPES = ['contact', 'job', 'shop'];

const now = () => new Date().toISOString();
const bool = (v) => (v ? 1 : 0);

async function body(request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      throw new HttpError(400, 'Ungültige Anfrage.');
    }
  }
  if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
    const form = await request.formData();
    return Object.fromEntries(form.entries());
  }
  throw new HttpError(415, 'Nicht unterstütztes Format.');
}

// ---------- Öffentlich ----------

async function createInquiry(request, env) {
  if (!env.DB) throw new HttpError(503, 'Das Formular ist momentan nicht verfügbar.');
  const data = await body(request);

  // Honigtopf: Bots füllen das versteckte Feld aus. Wir tun so, als hätte es geklappt.
  if (data.website) return json({ ok: true });

  const ip = await clientKey(request);
  if (!(await rateLimit(env.DB, `inq:${ip}`, 6, 3600))) {
    throw new HttpError(429, 'Zu viele Anfragen. Bitte versuchen Sie es später erneut oder rufen Sie uns an.');
  }

  const type = data.type;
  if (!INQUIRY_TYPES.includes(type)) throw new HttpError(400, 'Ungültige Anfrage.');

  const name = text(data.name, 120, 'Name', { required: true });
  const vorname = text(data.vorname, 120, 'Vorname', { required: type === 'job' });
  const email = text(data.email, 200, 'E-Mail-Adresse', { required: type !== 'shop' });
  if (email && !isEmail(email)) throw new HttpError(400, 'Bitte geben Sie eine gültige E-Mail-Adresse an.');
  const phone = text(data.phone ?? data.telefon, 40, 'Telefon', { required: type === 'job' });
  if (type === 'shop' && !email && !phone) throw new HttpError(400, 'Bitte geben Sie E-Mail oder Telefon an.');
  const subject = text(data.subject ?? data.betreff, 200, 'Betreff');
  const message = text(data.message ?? data.nachricht, 5000, 'Nachricht', { required: type === 'contact' });

  let payload = null;
  if (type === 'shop') {
    let items = data.items;
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch {
        items = null;
      }
    }
    if (!Array.isArray(items) || !items.length || items.length > 20) throw new HttpError(400, 'Bitte wählen Sie mindestens ein Produkt.');
    const clean = items.map((i) => ({
      name: text(i?.name, 80, 'Produkt', { required: true }),
      qty: Math.min(99, Math.max(1, Number(i?.qty) || 1)),
      price: Number(i?.price) || 0
    }));
    payload = JSON.stringify({ items: clean, address: text(data.adresse ?? data.address, 400, 'Adresse'), total: clean.reduce((s, i) => s + i.qty * i.price, 0) });
  } else if (vorname) {
    payload = JSON.stringify({ vorname });
  }

  const id = crypto.randomUUID();
  let file = { key: null, name: null, type: null };
  const upload = data.file;
  if (type === 'job' && upload && typeof upload === 'object' && upload.size > 0) {
    if (!env.FILES) throw new HttpError(503, 'Datei-Uploads sind momentan nicht verfügbar. Bitte senden Sie die Unterlagen per E-Mail.');
    const ext = FILE_TYPES[upload.type];
    if (!ext) throw new HttpError(400, 'Erlaubt sind PDF, Word, JPG und PNG.');
    if (upload.size > MAX_FILE) throw new HttpError(400, 'Die Datei ist grösser als 5 MB.');
    const safe = String(upload.name || `unterlagen.${ext}`).replace(/[^\w.\- ]+/g, '_').slice(0, 80);
    file = { key: `bewerbungen/${id}/${safe}`, name: safe, type: upload.type };
    await env.FILES.put(file.key, upload.stream(), { httpMetadata: { contentType: upload.type } });
  }

  await env.DB.prepare(
    'INSERT INTO inquiries (id, type, name, email, phone, subject, message, payload, file_key, file_name, file_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, type, name, email, phone, subject, message, payload, file.key, file.name, file.type, now())
    .run();
  return json({ ok: true }, 201);
}

async function publicMenu(env, key) {
  if (!env.DB) throw new HttpError(503, 'Nicht verfügbar.');
  if (!MENUS.includes(key)) throw new HttpError(404, 'Nicht gefunden.');
  const meta = await env.DB.prepare('SELECT note, valid_text, digital FROM menu_meta WHERE menu = ?').bind(key).first();
  const sections = (await env.DB.prepare('SELECT id, title, subtitle FROM menu_sections WHERE menu = ? AND visible = 1 ORDER BY sort, rowid').bind(key).all()).results;
  const items = (
    await env.DB.prepare(
      'SELECT i.id, i.section_id, i.name, i.description, i.price, i.allergens, i.badge FROM menu_items i JOIN menu_sections s ON s.id = i.section_id WHERE s.menu = ? AND s.visible = 1 AND i.visible = 1 ORDER BY i.sort, i.rowid'
    )
      .bind(key)
      .all()
  ).results;
  return json(
    {
      ok: true,
      meta: { note: meta?.note ?? null, validText: meta?.valid_text ?? null, digital: !!meta?.digital },
      sections: sections.map((s) => ({ ...s, items: items.filter((i) => i.section_id === s.id).map(({ section_id, ...rest }) => rest) })).filter((s) => s.items.length)
    }
  );
}

// ---------- Admin ----------

async function login(request, env) {
  if (!env.ADMIN_PASSWORD) throw new HttpError(503, 'Der Admin-Zugang ist noch nicht eingerichtet (ADMIN_PASSWORD fehlt).');
  if (!env.DB) throw new HttpError(503, 'Die Datenbank ist noch nicht eingerichtet.');
  const ip = await clientKey(request);
  if (!(await rateLimit(env.DB, `login:${ip}`, 5, 900))) throw new HttpError(429, 'Zu viele Versuche. Bitte warten Sie 15 Minuten.');
  const { password } = await body(request);
  if (!(await passwordMatches(env, password))) throw new HttpError(401, 'Das Passwort stimmt nicht.');
  return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie(env) });
}

async function listInquiries(env, url) {
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  const where = [];
  const args = [];
  if (status === 'new' || status === 'done') (where.push('status = ?'), args.push(status));
  if (INQUIRY_TYPES.includes(type)) (where.push('type = ?'), args.push(type));
  const sql = `SELECT id, type, name, email, phone, subject, message, payload, file_name, status, created_at FROM inquiries ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC LIMIT 200`;
  const rows = (await env.DB.prepare(sql).bind(...args).all()).results;
  const counts = await env.DB.prepare("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'new'").first();
  return json({ ok: true, inquiries: rows.map((r) => ({ ...r, payload: r.payload ? JSON.parse(r.payload) : null })), newCount: counts.n });
}

async function adminMenu(env, key) {
  if (!MENUS.includes(key)) throw new HttpError(404, 'Nicht gefunden.');
  const meta = (await env.DB.prepare('SELECT note, valid_text, digital FROM menu_meta WHERE menu = ?').bind(key).first()) || {};
  const sections = (await env.DB.prepare('SELECT id, title, subtitle, sort, visible FROM menu_sections WHERE menu = ? ORDER BY sort, rowid').bind(key).all()).results;
  const items = (
    await env.DB.prepare(
      'SELECT i.id, i.section_id, i.name, i.description, i.price, i.allergens, i.badge, i.sort, i.visible FROM menu_items i JOIN menu_sections s ON s.id = i.section_id WHERE s.menu = ? ORDER BY i.sort, i.rowid'
    )
      .bind(key)
      .all()
  ).results;
  return json({
    ok: true,
    meta: { note: meta.note ?? '', validText: meta.valid_text ?? '', digital: !!meta.digital },
    sections: sections.map((s) => ({ ...s, visible: !!s.visible, items: items.filter((i) => i.section_id === s.id).map((i) => ({ ...i, visible: !!i.visible })) }))
  });
}

async function nextSort(env, table, column, value) {
  const r = await env.DB.prepare(`SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM ${table} WHERE ${column} = ?`).bind(value).first();
  return r.n;
}

async function adminRoutes(request, env, url, path) {
  const method = request.method;
  let m;

  if (path === '/api/admin/me' && method === 'GET') return json({ ok: true });
  if (path === '/api/admin/logout' && method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });

  if (path === '/api/admin/inquiries' && method === 'GET') return listInquiries(env, url);

  if ((m = path.match(/^\/api\/admin\/inquiries\/([\w-]+)$/))) {
    if (method === 'PATCH') {
      const { status } = await body(request);
      if (!['new', 'done'].includes(status)) throw new HttpError(400, 'Ungültiger Status.');
      await env.DB.prepare('UPDATE inquiries SET status = ? WHERE id = ?').bind(status, m[1]).run();
      return json({ ok: true });
    }
    if (method === 'DELETE') {
      const row = await env.DB.prepare('SELECT file_key FROM inquiries WHERE id = ?').bind(m[1]).first();
      if (row?.file_key && env.FILES) await env.FILES.delete(row.file_key);
      await env.DB.prepare('DELETE FROM inquiries WHERE id = ?').bind(m[1]).run();
      return json({ ok: true });
    }
  }

  if ((m = path.match(/^\/api\/admin\/inquiries\/([\w-]+)\/file$/)) && method === 'GET') {
    const row = await env.DB.prepare('SELECT file_key, file_name, file_type FROM inquiries WHERE id = ?').bind(m[1]).first();
    if (!row?.file_key || !env.FILES) throw new HttpError(404, 'Keine Datei vorhanden.');
    const obj = await env.FILES.get(row.file_key);
    if (!obj) throw new HttpError(404, 'Datei nicht gefunden.');
    return new Response(obj.body, {
      headers: {
        'Content-Type': row.file_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${row.file_name}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store'
      }
    });
  }

  if ((m = path.match(/^\/api\/admin\/menus\/(\w+)$/)) && method === 'GET') return adminMenu(env, m[1]);

  if ((m = path.match(/^\/api\/admin\/menus\/(\w+)\/meta$/)) && method === 'PUT') {
    if (!MENUS.includes(m[1])) throw new HttpError(404, 'Nicht gefunden.');
    const d = await body(request);
    await env.DB.prepare(
      'INSERT INTO menu_meta (menu, note, valid_text, digital, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(menu) DO UPDATE SET note = excluded.note, valid_text = excluded.valid_text, digital = excluded.digital, updated_at = excluded.updated_at'
    )
      .bind(m[1], text(d.note, 500, 'Hinweis'), text(d.validText, 120, 'Gültigkeit'), bool(d.digital), now())
      .run();
    return json({ ok: true });
  }

  if (path === '/api/admin/sections' && method === 'POST') {
    const d = await body(request);
    if (!MENUS.includes(d.menu)) throw new HttpError(400, 'Ungültige Karte.');
    const id = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO menu_sections (id, menu, title, subtitle, sort, visible) VALUES (?, ?, ?, ?, ?, 1)')
      .bind(id, d.menu, text(d.title, 120, 'Titel', { required: true }), text(d.subtitle, 200, 'Untertitel'), await nextSort(env, 'menu_sections', 'menu', d.menu))
      .run();
    return json({ ok: true, id }, 201);
  }

  if ((m = path.match(/^\/api\/admin\/sections\/([\w-]+)$/))) {
    if (method === 'PATCH') {
      const d = await body(request);
      await env.DB.prepare('UPDATE menu_sections SET title = ?, subtitle = ?, visible = ? WHERE id = ?')
        .bind(text(d.title, 120, 'Titel', { required: true }), text(d.subtitle, 200, 'Untertitel'), bool(d.visible), m[1])
        .run();
      return json({ ok: true });
    }
    if (method === 'DELETE') {
      await env.DB.batch([env.DB.prepare('DELETE FROM menu_items WHERE section_id = ?').bind(m[1]), env.DB.prepare('DELETE FROM menu_sections WHERE id = ?').bind(m[1])]);
      return json({ ok: true });
    }
  }

  if (path === '/api/admin/items' && method === 'POST') {
    const d = await body(request);
    const id = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO menu_items (id, section_id, name, description, price, allergens, badge, sort, visible, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)')
      .bind(
        id,
        d.sectionId,
        text(d.name, 160, 'Name', { required: true }),
        text(d.description, 600, 'Beschreibung'),
        text(d.price, 40, 'Preis'),
        text(d.allergens, 60, 'Allergene'),
        text(d.badge, 30, 'Label'),
        await nextSort(env, 'menu_items', 'section_id', d.sectionId),
        now()
      )
      .run();
    return json({ ok: true, id }, 201);
  }

  if ((m = path.match(/^\/api\/admin\/items\/([\w-]+)$/))) {
    if (method === 'PATCH') {
      const d = await body(request);
      await env.DB.prepare('UPDATE menu_items SET name = ?, description = ?, price = ?, allergens = ?, badge = ?, visible = ?, updated_at = ? WHERE id = ?')
        .bind(
          text(d.name, 160, 'Name', { required: true }),
          text(d.description, 600, 'Beschreibung'),
          text(d.price, 40, 'Preis'),
          text(d.allergens, 60, 'Allergene'),
          text(d.badge, 30, 'Label'),
          bool(d.visible),
          now(),
          m[1]
        )
        .run();
      return json({ ok: true });
    }
    if (method === 'DELETE') {
      await env.DB.prepare('DELETE FROM menu_items WHERE id = ?').bind(m[1]).run();
      return json({ ok: true });
    }
  }

  if (path === '/api/admin/reorder' && method === 'POST') {
    const { kind, ids } = await body(request);
    const table = kind === 'section' ? 'menu_sections' : kind === 'item' ? 'menu_items' : null;
    if (!table || !Array.isArray(ids) || ids.length > 500) throw new HttpError(400, 'Ungültige Anfrage.');
    await env.DB.batch(ids.map((id, i) => env.DB.prepare(`UPDATE ${table} SET sort = ? WHERE id = ?`).bind(i, String(id))));
    return json({ ok: true });
  }

  throw new HttpError(404, 'Nicht gefunden.');
}

// ---------- Einstieg ----------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    // Nur /api/* erreicht den Worker (run_worker_first). Alles andere liefert die Plattform aus.
    if (!path.startsWith('/api/')) return env.ASSETS.fetch(request);

    try {
      // Schreibende Aufrufe nur von der eigenen Seite (Schutz vor Cross-Site-Anfragen).
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        const origin = request.headers.get('Origin');
        if (origin && new URL(origin).host !== url.host) throw new HttpError(403, 'Nicht erlaubt.');
      }

      if (path === '/api/health') return json({ ok: true, db: !!env.DB, files: !!env.FILES, admin: !!env.ADMIN_PASSWORD });
      if (path === '/api/inquiries' && request.method === 'POST') return await createInquiry(request, env);
      let m;
      if ((m = path.match(/^\/api\/menus\/(\w+)$/)) && request.method === 'GET') return await publicMenu(env, m[1]);
      if (path === '/api/admin/login' && request.method === 'POST') return await login(request, env);

      if (path.startsWith('/api/admin/')) {
        if (!(await isAuthenticated(request, env))) throw new HttpError(401, 'Bitte melden Sie sich an.');
        if (!env.DB) throw new HttpError(503, 'Die Datenbank ist noch nicht eingerichtet.');
        return await adminRoutes(request, env, url, path);
      }
      throw new HttpError(404, 'Nicht gefunden.');
    } catch (e) {
      if (e instanceof HttpError) return fail(e.status, e.message);
      console.error(e);
      return fail(500, 'Ein unerwarteter Fehler ist aufgetreten.');
    }
  }
};
