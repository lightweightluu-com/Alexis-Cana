// Dünner Wrapper um fetch für die Worker-API (gleiche Herkunft, Cookie-Sitzung).
export async function api(path, { method = 'GET', body, form } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: form ?? (body ? JSON.stringify(body) : undefined)
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* keine JSON-Antwort, z. B. bei statischem Fallback */
  }
  if (!res.ok || data?.ok === false) {
    const err = new Error(data?.error || `Fehler ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// Fehler, bei denen das Formular auf E-Mail ausweichen soll (Backend nicht erreichbar).
export const backendUnavailable = (e) => !e.status || [404, 405, 415, 500, 502, 503, 504].includes(e.status);
