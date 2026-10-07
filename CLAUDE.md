# Projekt-Konventionen für Claude

Dieses Repo stammt aus dem Template `lightweightluu-com/pwa-template`.
Jeder Push auf `main` wird automatisch als PWA auf
**https://<repo-name>.lightweightluu.com** veröffentlicht.

## Deployment – nicht verändern ohne Rückfrage
- `.github/workflows/deploy.yml` baut mit `npm run build` und deployt `dist/`
  als Cloudflare Worker (Static Assets) mit Custom Domain.
- Die Subdomain ist der Repo-Name in Kleinbuchstaben (`_` und `.` werden zu `-`).
- `wrangler.jsonc` wird im CI erzeugt (`scripts/wrangler-config.mjs`) und ist in `.gitignore` – nicht einchecken.
  Für lokale Entwicklung gibt es `wrangler.local.jsonc` (ohne Secrets).
- Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) kommen aus der Org.
  Niemals Tokens oder Keys in den Code schreiben.

## Stack
- Vite + `vite-plugin-pwa` (Manifest + Service Worker, `autoUpdate`).
- Build-Output muss in `dist/` landen.
- Backend im selben Worker (`worker/index.js`, nur `/api/*` läuft über den Worker):
  D1-Datenbank `<repo>-db` (Anfragen, Karten, Migrationen in `migrations/`) und
  R2-Speicher `<repo>-files` (Bewerbungsunterlagen). `scripts/wrangler-config.mjs`
  legt beides im CI an und lässt die Bindung weg, falls das nicht klappt (die Seite
  deployt dann trotzdem). Neue Tabellen immer als neue Migrationsdatei, nie `0001` ändern.
- Admin-Bereich unter `/admin` (Passwort = GitHub-Secret `ADMIN_PASSWORD`, wird im CI als
  Worker-Secret gesetzt). Lokal testen: `.dev.vars` mit `ADMIN_PASSWORD=…` anlegen,
  `npm run build && npm run db:local && npm run dev:worker`.
- Weitere Backend-Dienste (z. B. Supabase) vorher mit dem Besitzer klären.
- SPA-Routing ist aktiv (`not_found_handling: single-page-application`).
- Frameworks (React, Svelte, …) sind erlaubt, wenn das Projekt es braucht –
  `vite-plugin-pwa` und den `dist/`-Output beibehalten.

## Bei jedem neuen Projekt anpassen
1. In `vite.config.js`: `APP_NAME`, `APP_SHORT_NAME`, `THEME_COLOR`, `BACKGROUND_COLOR`.
2. In `index.html`: `<title>`, `meta description`, `theme-color`.
3. Icons in `public/icons/` (192, 512, maskable 512) und `public/apple-touch-icon.png`, `public/favicon.svg` ersetzen.
4. `name` in `package.json` auf den Repo-Namen setzen.
5. Nach dem ersten `npm install` die `package-lock.json` mit committen.

## Qualitätsregeln
- Vor jedem Push auf `main`: `npm run build` muss fehlerfrei durchlaufen.
- Mobile first, funktioniert ab 360 px Breite, respektiert Safe Areas.
- Hell- und Dunkelmodus über `prefers-color-scheme`.
- Barrierearm: semantisches HTML, ausreichende Kontraste, Labels für Formulare.
- Inhalte und UI-Texte auf Deutsch (Schweiz: „ss“ statt „ß“), sofern nicht anders gewünscht.
- Kleine, beschreibende Commits.
