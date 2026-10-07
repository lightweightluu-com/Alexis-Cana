-- Anfragen aus Kontakt-, Bewerbungs- und Shop-Formular
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('contact', 'job', 'shop')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  payload TEXT,
  file_key TEXT,
  file_name TEXT,
  file_type TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'done')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_inquiries_status ON inquiries (status, created_at DESC);

-- Zähler gegen Missbrauch (Login-Versuche, Formular-Spam)
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);

-- Karten: tagesmenu, speisekarte, getraenkekarte, monatsweine
CREATE TABLE menu_meta (
  menu TEXT PRIMARY KEY,
  note TEXT,
  valid_text TEXT,
  digital INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);

CREATE TABLE menu_sections (
  id TEXT PRIMARY KEY,
  menu TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  sort INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX idx_sections_menu ON menu_sections (menu, sort);

CREATE TABLE menu_items (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES menu_sections (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  allergens TEXT,
  badge TEXT,
  sort INTEGER NOT NULL DEFAULT 0,
  visible INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT
);
CREATE INDEX idx_items_section ON menu_items (section_id, sort);
