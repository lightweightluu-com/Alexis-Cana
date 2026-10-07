import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const MENUS = [
  ['tagesmenu', 'Tagesmenu'],
  ['speisekarte', 'Speisekarte'],
  ['getraenkekarte', 'Getränkekarte'],
  ['monatsweine', 'Monatsweine']
];

const move = (arr, i, d) => {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};

function Toolbar({ index, count, visible, onMove, onToggle, onDelete, label }) {
  const btn = 'size-9';
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button type="button" variant="ghost" size="icon" className={btn} aria-label={`${label} nach oben`} disabled={index === 0} onClick={() => onMove(-1)}><ArrowUp /></Button>
      <Button type="button" variant="ghost" size="icon" className={btn} aria-label={`${label} nach unten`} disabled={index === count - 1} onClick={() => onMove(1)}><ArrowDown /></Button>
      <Button type="button" variant="ghost" size="icon" className={btn} aria-label={visible ? `${label} ausblenden` : `${label} einblenden`} aria-pressed={!visible} onClick={onToggle}>{visible ? <Eye /> : <EyeOff className="text-primary" />}</Button>
      <Button type="button" variant="ghost" size="icon" className={cn(btn, 'text-primary')} aria-label={`${label} löschen`} onClick={onDelete}><Trash2 /></Button>
    </div>
  );
}

function ItemForm({ initial, onSave, onCancel, submitLabel }) {
  const [d, setD] = useState({ name: '', price: '', description: '', allergens: '', badge: '', ...initial });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setD((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave(d);
      if (!initial) setD({ name: '', price: '', description: '', allergens: '', badge: '' });
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-6">
      <div className="sm:col-span-3"><Field label="Name" required htmlFor={`n-${initial?.id ?? 'new'}`}><Input id={`n-${initial?.id ?? 'new'}`} value={d.name} onChange={set('name')} required maxLength={160} /></Field></div>
      <div className="sm:col-span-1"><Field label="Preis" htmlFor={`p-${initial?.id ?? 'new'}`}><Input id={`p-${initial?.id ?? 'new'}`} value={d.price ?? ''} onChange={set('price')} placeholder="19.80" maxLength={40} /></Field></div>
      <div className="sm:col-span-1"><Field label="Allergene" htmlFor={`a-${initial?.id ?? 'new'}`}><Input id={`a-${initial?.id ?? 'new'}`} value={d.allergens ?? ''} onChange={set('allergens')} placeholder="GLO" maxLength={60} /></Field></div>
      <div className="sm:col-span-1"><Field label="Label" htmlFor={`b-${initial?.id ?? 'new'}`}><Input id={`b-${initial?.id ?? 'new'}`} value={d.badge ?? ''} onChange={set('badge')} placeholder="Hit" maxLength={30} /></Field></div>
      <div className="sm:col-span-6"><Field label="Beschreibung" htmlFor={`d-${initial?.id ?? 'new'}`}><Textarea id={`d-${initial?.id ?? 'new'}`} value={d.description ?? ''} onChange={set('description')} rows={2} maxLength={600} className="min-h-0" /></Field></div>
      <div className="flex gap-2 sm:col-span-6">
        <Button type="submit" size="sm" disabled={busy}>{initial ? <Save /> : <Plus />} {submitLabel}</Button>
        {onCancel && <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Abbrechen</Button>}
      </div>
    </form>
  );
}

function Item({ item, index, count, siblings, run }) {
  const [edit, setEdit] = useState(false);
  const ids = siblings.map((i) => i.id);
  return (
    <li className={cn('rounded-xl border border-border bg-background p-3', !item.visible && 'opacity-60')}>
      {edit ? (
        <ItemForm
          initial={item}
          submitLabel="Speichern"
          onCancel={() => setEdit(false)}
          onSave={async (d) => {
            await run(() => api(`/api/admin/items/${item.id}`, { method: 'PATCH', body: { ...d, visible: item.visible } }));
            setEdit(false);
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setEdit(true)} className="min-w-0 flex-1 rounded-lg px-1 py-1 text-left hover:bg-muted" aria-label={`${item.name} bearbeiten`}>
            <span className="flex items-baseline gap-2"><span className="truncate font-medium">{item.name}</span>{item.badge && <span className="rounded bg-primary px-1.5 text-[10px] uppercase text-primary-foreground">{item.badge}</span>}<span className="ml-auto shrink-0 tabular-nums text-sm text-muted-foreground">{item.price}</span></span>
            {item.description && <span className="block truncate text-xs text-muted-foreground">{item.description}</span>}
          </button>
          <Toolbar
            label={item.name}
            index={index}
            count={count}
            visible={item.visible}
            onMove={(d) => run(() => api('/api/admin/reorder', { method: 'POST', body: { kind: 'item', ids: move(ids, index, d) } }))}
            onToggle={() => run(() => api(`/api/admin/items/${item.id}`, { method: 'PATCH', body: { ...item, visible: !item.visible } }))}
            onDelete={() => window.confirm(`«${item.name}» löschen?`) && run(() => api(`/api/admin/items/${item.id}`, { method: 'DELETE' }))}
          />
        </div>
      )}
    </li>
  );
}

function Section({ section, index, siblings, run }) {
  const [title, setTitle] = useState(section.title);
  const [subtitle, setSubtitle] = useState(section.subtitle ?? '');
  const [adding, setAdding] = useState(false);
  const dirty = title !== section.title || subtitle !== (section.subtitle ?? '');
  const ids = siblings.map((s) => s.id);
  const patch = (extra = {}) => run(() => api(`/api/admin/sections/${section.id}`, { method: 'PATCH', body: { title, subtitle, visible: section.visible, ...extra } }));

  return (
    <section className={cn('rounded-3xl border border-border bg-card p-4 sm:p-5', !section.visible && 'opacity-70')} aria-label={section.title}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1"><Field label="Rubrik" htmlFor={`st-${section.id}`}><Input id={`st-${section.id}`} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} /></Field></div>
        <div className="min-w-48 flex-1"><Field label="Untertitel" htmlFor={`ss-${section.id}`}><Input id={`ss-${section.id}`} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={200} /></Field></div>
        {dirty && <Button type="button" size="sm" onClick={() => patch()}><Save /> Speichern</Button>}
        <Toolbar
          label={`Rubrik ${section.title}`}
          index={index}
          count={siblings.length}
          visible={section.visible}
          onMove={(d) => run(() => api('/api/admin/reorder', { method: 'POST', body: { kind: 'section', ids: move(ids, index, d) } }))}
          onToggle={() => patch({ visible: !section.visible, title: section.title, subtitle: section.subtitle })}
          onDelete={() => window.confirm(`Rubrik «${section.title}» mit allen Positionen löschen?`) && run(() => api(`/api/admin/sections/${section.id}`, { method: 'DELETE' }))}
        />
      </div>
      <ul className="mt-4 space-y-2">
        {section.items.map((it, i) => <Item key={it.id} item={it} index={i} count={section.items.length} siblings={section.items} run={run} />)}
      </ul>
      {adding ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-3">
          <ItemForm submitLabel="Position hinzufügen" onCancel={() => setAdding(false)} onSave={(d) => run(() => api('/api/admin/items', { method: 'POST', body: { ...d, sectionId: section.id } }))} />
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setAdding(true)}><Plus /> Position hinzufügen</Button>
      )}
    </section>
  );
}

export default function MenuEditor() {
  const [menu, setMenu] = useState('tagesmenu');
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await api(`/api/admin/menus/${menu}`);
      setData(d);
      setMeta(d.meta);
    } catch (e) {
      setError(e.message);
    }
  }, [menu]);

  useEffect(() => {
    setData(null);
    setSaved('');
    load();
  }, [load]);

  const run = async (fn) => {
    setError('');
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const saveMeta = (e) => {
    e.preventDefault();
    run(async () => {
      await api(`/api/admin/menus/${menu}/meta`, { method: 'PUT', body: meta });
      setSaved('Gespeichert.');
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Karte wählen">
        {MENUS.map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={menu === k} onClick={() => setMenu(k)} className={cn('rounded-full border px-4 py-1.5 text-sm transition-colors', menu === k ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted')}>{l}</button>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-primary">{error}</p>}
      {data && meta && (
        <>
          <form onSubmit={saveMeta} className="mt-6 space-y-4 rounded-3xl border border-border bg-card p-5">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 size-4 accent-[var(--primary)]" checked={meta.digital} onChange={(e) => { setSaved(''); setMeta({ ...meta, digital: e.target.checked }); }} />
              <span>
                <span className="font-medium">Digitale Karte auf der Website anzeigen</span>
                <span className="block text-sm text-muted-foreground">Ist die Option aus oder die Karte leer, sehen Gäste weiterhin das PDF.</span>
              </span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gültigkeit (z. B. «5.–9. Oktober 2026»)" htmlFor="valid"><Input id="valid" value={meta.validText} maxLength={120} onChange={(e) => { setSaved(''); setMeta({ ...meta, validText: e.target.value }); }} /></Field>
              <Field label="Hinweis unter dem Titel" htmlFor="note"><Input id="note" value={meta.note} maxLength={500} onChange={(e) => { setSaved(''); setMeta({ ...meta, note: e.target.value }); }} /></Field>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm"><Save /> Einstellungen speichern</Button>
              {saved && <span role="status" className="text-sm text-muted-foreground">{saved}</span>}
            </div>
          </form>

          <div className="mt-6 space-y-4">
            {data.sections.map((s, i) => <Section key={s.id} section={s} index={i} siblings={data.sections} run={run} />)}
            {data.sections.length === 0 && <p className="rounded-3xl border border-dashed border-border py-10 text-center text-muted-foreground">Noch keine Rubriken. Legen Sie unten die erste an, z. B. «Suppen» oder «Hauptgänge».</p>}
          </div>

          <form
            className="mt-6 flex flex-wrap items-end gap-3 rounded-3xl border border-dashed border-border p-4"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api('/api/admin/sections', { method: 'POST', body: { menu, title: newTitle } });
                setNewTitle('');
              });
            }}
          >
            <div className="min-w-56 flex-1"><Field label="Neue Rubrik" htmlFor="new-sec"><Input id="new-sec" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required maxLength={120} placeholder="z. B. Suppen" /></Field></div>
            <Button type="submit"><Plus /> Rubrik anlegen</Button>
          </form>
        </>
      )}
    </div>
  );
}
