import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Minus, Plus, ShoppingBag } from 'lucide-react';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { api, backendUnavailable } from '@/lib/api';
import { SITE } from '@/lib/site';

const PRODUCTS = [
  { id: 'gin-10cl', name: 'A-Gin 10 cl', price: 11 },
  { id: 'gin-35cl', name: 'A-Gin 35 cl', price: 31 },
  { id: 'gin-70cl', name: 'A-Gin 70 cl', price: 56 }
];

const chf = (n) => `CHF ${n.toFixed(2)}`;

export default function Shop() {
  const [qty, setQty] = useState({});
  const set = (id, d) => setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }));
  const items = PRODUCTS.filter((p) => qty[p.id] > 0);
  const total = items.reduce((s, p) => s + p.price * qty[p.id], 0);

  const [state, setState] = useState({ status: 'idle', message: '' });

  const order = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const contact = { name: f.get('name'), email: f.get('email'), telefon: f.get('telefon'), adresse: f.get('adresse') };
    setState({ status: 'sending', message: '' });
    try {
      await api('/api/inquiries', {
        method: 'POST',
        body: { type: 'shop', ...contact, website: f.get('website'), items: items.map((p) => ({ name: p.name, qty: qty[p.id], price: p.price })) }
      });
      setQty({});
      form.reset();
      setState({ status: 'ok', message: 'Vielen Dank für Ihre Bestellung! Wir melden uns bei Ihnen zur Abwicklung.' });
    } catch (err) {
      if (backendUnavailable(err)) {
        const lines = items.map((p) => `${qty[p.id]} × ${p.name} (${chf(p.price)})`);
        const mail = `Guten Tag\n\nIch möchte gerne bestellen:\n${lines.join('\n')}\n\nTotal: ${chf(total)}\n\nName: ${contact.name}\nAdresse: ${contact.adresse}\nTelefon: ${contact.telefon}\n`;
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Bestellung A-Shop')}&body=${encodeURIComponent(mail)}`;
        setState({ status: 'ok', message: 'Ihr Mailprogramm wurde geöffnet. Bitte senden Sie die vorbereitete Bestellung dort ab.' });
      } else {
        setState({ status: 'error', message: err.message });
      }
    }
  };

  return (
    <>
      <PageHero eyebrow="A-Shop" title="A Gin zum Mitnehmen">
        Unser eigener Gin aus der Distillerie Seetal in drei Grössen. Stellen Sie Ihre Bestellung zusammen, wir melden uns zur Abwicklung bei Ihnen.
      </PageHero>
      <Section>
        <ul className="grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="bg-[#fffac8]">
                  <img src={`/images/shop/${p.id}.webp`} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-3xl text-primary">{p.name}</h2>
                  <p className="mt-1 text-lg">{chf(p.price)}</p>
                  <div className="mt-auto flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3" role="group" aria-label={`Menge ${p.name}`}>
                      <Button type="button" variant="outline" size="icon" aria-label="Weniger" onClick={() => set(p.id, -1)}><Minus /></Button>
                      <span className="w-6 text-center tabular-nums" aria-live="polite">{qty[p.id] ?? 0}</span>
                      <Button type="button" variant="outline" size="icon" aria-label="Mehr" onClick={() => set(p.id, 1)}><Plus /></Button>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <motion.form
          onSubmit={order}
          initial={false}
          animate={{ opacity: items.length ? 1 : 0.6 }}
          className="mx-auto mt-12 max-w-2xl rounded-3xl bg-ink p-6 text-[#f3ead8] sm:p-8"
        >
          <div className="text-center">
            <ShoppingBag className="mx-auto size-8 text-[#e8c07a]" aria-hidden="true" />
            <p className="mt-3 font-serif text-3xl">{items.length ? chf(total) : 'Ihre Bestellung'}</p>
            <p className="mt-1 text-sm text-white/60">{items.length ? items.map((p) => `${qty[p.id]} × ${p.name}`).join(' · ') : 'Wählen Sie die gewünschte Menge.'}</p>
          </div>
          {items.length > 0 && (
            <div className="mt-6 grid gap-4 text-foreground sm:grid-cols-2">
              <Field label="Name" required htmlFor="shop-name"><Input id="shop-name" name="name" required autoComplete="name" maxLength={120} /></Field>
              <Field label="E-Mail" htmlFor="shop-kontakt">
                <Input id="shop-kontakt" name="email" type="email" autoComplete="email" maxLength={200} />
              </Field>
              <Field label="Telefon" htmlFor="shop-tel"><Input id="shop-tel" name="telefon" type="tel" autoComplete="tel" maxLength={40} /></Field>
              <Field label="Adresse (falls Lieferung)" htmlFor="shop-adr"><Input id="shop-adr" name="adresse" autoComplete="street-address" maxLength={400} /></Field>
              <p className="text-xs text-white/60 sm:col-span-2">Bitte geben Sie mindestens E-Mail oder Telefon an.</p>
              <div className="absolute -left-[9999px]" aria-hidden="true"><input type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
            </div>
          )}
          <div className="mt-6 text-center">
            <Button type="submit" variant="gold" size="lg" disabled={!items.length || state.status === 'sending'}>
              {state.status === 'sending' && <Loader2 className="animate-spin" />} Bestellung anfragen
            </Button>
          </div>
          {state.message && (
            <p role={state.status === 'error' ? 'alert' : 'status'} className="mt-4 flex items-start justify-center gap-2 text-sm text-white/75">
              {state.status === 'error' ? <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#e8c07a]" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#e8c07a]" aria-hidden="true" />}
              {state.message}
            </p>
          )}
        </motion.form>
      </Section>
    </>
  );
}
