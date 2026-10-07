#!/usr/bin/env node
// Erzeugt die wrangler.jsonc für das Deployment (Aufruf: node scripts/wrangler-config.mjs <worker-name>).
//
// Legt bei Bedarf die D1-Datenbank (Anfragen, Karten) und den R2-Speicher
// (Bewerbungsunterlagen) an und spielt die Migrationen ein. Schlägt einer dieser
// Schritte fehl, etwa wegen fehlender Token-Rechte, wird die jeweilige Bindung weggelassen:
// Die Website wird trotzdem veröffentlicht, nur das Backend bleibt dann aus
// und die Formulare weichen auf E-Mail aus.
import { execFileSync } from 'node:child_process';
import { appendFileSync, writeFileSync } from 'node:fs';

const name = process.argv[2];
if (!name) {
  console.error('Worker-Name fehlt.');
  process.exit(1);
}
const DB_NAME = `${name}-db`;
const BUCKET = `${name}-files`;

const config = {
  name,
  main: 'worker/index.js',
  compatibility_date: '2026-09-01',
  assets: {
    directory: './dist',
    binding: 'ASSETS',
    not_found_handling: 'single-page-application',
    run_worker_first: ['/api/*']
  },
  routes: [{ pattern: `${name}.lightweightluu.com`, custom_domain: true }]
};

const save = () => writeFileSync('wrangler.jsonc', JSON.stringify(config, null, 2));
const wrangler = (args) =>
  execFileSync('npx', ['--no-install', 'wrangler', ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, CI: '1', WRANGLER_SEND_METRICS: 'false' } });
const json = (out) => JSON.parse(out.slice(out.search(/[[{]/)));
const strip = (t) => t.replace(/\u001b\[[0-9;]*m/g, '');
const reason = (e) => strip(String(e.stderr || e.message || e)).split('\n').find((l) => /error|fehl|permission|authentication/i.test(l))?.trim() || 'unbekannter Fehler';

const status = [];
save();

try {
  let db = json(wrangler(['d1', 'list', '--json'])).find((d) => d.name === DB_NAME);
  if (!db) {
    wrangler(['d1', 'create', DB_NAME]);
    db = json(wrangler(['d1', 'list', '--json'])).find((d) => d.name === DB_NAME);
  }
  if (!db) throw new Error('Datenbank nach dem Anlegen nicht gefunden');
  config.d1_databases = [{ binding: 'DB', database_name: DB_NAME, database_id: db.uuid, migrations_dir: 'migrations' }];
  save();
  wrangler(['d1', 'migrations', 'apply', 'DB', '--remote']);
  status.push(`Datenbank \`${DB_NAME}\`: bereit`);
} catch (e) {
  delete config.d1_databases;
  save();
  console.log(`::warning::Datenbank nicht eingerichtet: ${reason(e)}`);
  status.push(`Datenbank: **nicht eingerichtet** (${reason(e)})`);
}

try {
  try {
    wrangler(['r2', 'bucket', 'create', BUCKET]);
  } catch (e) {
    if (!/already exists|10004/i.test(String(e.stderr || e.message))) throw e;
  }
  config.r2_buckets = [{ binding: 'FILES', bucket_name: BUCKET }];
  save();
  status.push(`Dateispeicher \`${BUCKET}\`: bereit`);
} catch (e) {
  console.log(`::warning::Dateispeicher nicht eingerichtet: ${reason(e)}`);
  status.push(`Dateispeicher: **nicht eingerichtet** (${reason(e)})`);
}

console.log(status.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Backend\n${status.map((s) => `- ${s}`).join('\n')}\n`);
