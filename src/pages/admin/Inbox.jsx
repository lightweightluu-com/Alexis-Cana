import { useCallback, useEffect, useState } from 'react';
import { Check, ChevronDown, Download, Inbox as InboxIcon, Mail, Phone, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

const TYPES = { contact: 'Kontakt', job: 'Bewerbung', shop: 'Bestellung' };
const STATUS = [
  ['', 'Alle'],
  ['new', 'Neu'],
  ['done', 'Erledigt']
];

const fmt = (iso) => new Date(iso).toLocaleString('de-CH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Zurich' });
const chf = (n) => `CHF ${Number(n).toFixed(2)}`;

function Detail({ q, onChange }) {
  const p = q.payload;
  return (
    <div className="space-y-4 border-t border-border px-4 pb-4 pt-4 text-sm sm:px-5">
      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {q.email && <div><dt className="text-muted-foreground">E-Mail</dt><dd><a className="inline-flex items-center gap-1.5 hover:text-primary" href={`mailto:${q.email}?subject=${encodeURIComponent('Re: ' + (q.subject || TYPES[q.type]))}`}><Mail className="size-3.5" aria-hidden="true" />{q.email}</a></dd></div>}
        {q.phone && <div><dt className="text-muted-foreground">Telefon</dt><dd><a className="inline-flex items-center gap-1.5 hover:text-primary" href={`tel:${q.phone}`}><Phone className="size-3.5" aria-hidden="true" />{q.phone}</a></dd></div>}
        {q.subject && <div className="sm:col-span-2"><dt className="text-muted-foreground">Betreff</dt><dd>{q.subject}</dd></div>}
      </dl>
      {q.message && <p className="whitespace-pre-wrap rounded-xl bg-muted p-4 leading-relaxed">{q.message}</p>}
      {q.type === 'shop' && p && (
        <div className="rounded-xl bg-muted p-4">
          <ul className="space-y-1">
            {p.items.map((i, n) => <li key={n} className="flex justify-between gap-4"><span>{i.qty} × {i.name}</span><span className="tabular-nums">{chf(i.qty * i.price)}</span></li>)}
          </ul>
          <p className="mt-2 flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><span className="tabular-nums">{chf(p.total)}</span></p>
          {p.address && <p className="mt-2 text-muted-foreground">Adresse: {p.address}</p>}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {q.file_name && (
          <Button asChild variant="outline" size="sm"><a href={`/api/admin/inquiries/${q.id}/file`}><Download /> {q.file_name}</a></Button>
        )}
        <Button variant={q.status === 'new' ? 'default' : 'outline'} size="sm" onClick={() => onChange(q, q.status === 'new' ? 'done' : 'new')}>
          {q.status === 'new' ? <><Check /> Als erledigt markieren</> : <><RotateCcw /> Wieder auf «Neu»</>}
        </Button>
        <Button variant="ghost" size="sm" className="text-primary" onClick={() => onChange(q, 'delete')}><Trash2 /> Löschen</Button>
      </div>
    </div>
  );
}

export default function Inbox({ onCount }) {
  const [filter, setFilter] = useState({ status: 'new', type: '' });
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const qs = new URLSearchParams(Object.entries(filter).filter(([, v]) => v));
      const d = await api(`/api/admin/inquiries?${qs}`);
      setRows(d.inquiries);
      onCount(d.newCount);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, [filter, onCount]);

  useEffect(() => {
    load();
  }, [load]);

  const change = async (q, action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm(`Anfrage von ${q.name} endgültig löschen?`)) return;
        await api(`/api/admin/inquiries/${q.id}`, { method: 'DELETE' });
        setOpen(null);
      } else {
        await api(`/api/admin/inquiries/${q.id}`, { method: 'PATCH', body: { status: action } });
      }
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const chip = (active) => cn('rounded-full border px-3.5 py-1.5 text-sm transition-colors', active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted');

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {STATUS.map(([v, l]) => <button key={l} type="button" className={chip(filter.status === v)} onClick={() => setFilter((f) => ({ ...f, status: v }))}>{l}</button>)}
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
        {[['', 'Alle Arten'], ...Object.entries(TYPES)].map(([v, l]) => <button key={l} type="button" className={chip(filter.type === v)} onClick={() => setFilter((f) => ({ ...f, type: v }))}>{l}</button>)}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-primary">{error}</p>}
      {rows && rows.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
          <InboxIcon className="size-8 text-gold" aria-hidden="true" />
          Keine Anfragen in dieser Ansicht.
        </div>
      )}
      <ul className="mt-6 space-y-3">
        {rows?.map((q) => {
          const isOpen = open === q.id;
          return (
            <li key={q.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : q.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left sm:px-5">
                <span className={cn('size-2.5 shrink-0 rounded-full', q.status === 'new' ? 'bg-primary' : 'bg-border')} aria-label={q.status === 'new' ? 'Neu' : 'Erledigt'} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2">
                    <span className={cn('truncate', q.status === 'new' && 'font-semibold')}>{q.name}{q.payload?.vorname ? ` ${q.payload.vorname}` : ''}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] uppercase tracking-wider text-gold">{TYPES[q.type]}</span>
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">{q.subject || q.message || (q.type === 'shop' ? 'Bestellung A-Shop' : '')}</span>
                </span>
                <time className="hidden shrink-0 text-xs text-muted-foreground sm:block" dateTime={q.created_at}>{fmt(q.created_at)}</time>
                <ChevronDown className={cn('size-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              {isOpen && <Detail q={q} onChange={change} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
