import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';
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

  const order = () => {
    const lines = items.map((p) => `${qty[p.id]} × ${p.name} (${chf(p.price)})`);
    const body = `Guten Tag\n\nIch möchte gerne bestellen:\n${lines.join('\n')}\n\nTotal: ${chf(total)}\n\nName:\nAdresse:\nTelefon:\n`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Bestellung A-Shop')}&body=${encodeURIComponent(body)}`;
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

        <motion.div
          initial={false}
          animate={{ opacity: items.length ? 1 : 0.5 }}
          className="mx-auto mt-12 max-w-xl rounded-3xl bg-ink p-8 text-center text-[#f3ead8]"
        >
          <ShoppingBag className="mx-auto size-8 text-[#e8c07a]" aria-hidden="true" />
          <p className="mt-3 font-serif text-3xl">{items.length ? chf(total) : 'Ihre Bestellung'}</p>
          <p className="mt-1 text-sm text-white/60">{items.length ? items.map((p) => `${qty[p.id]} × ${p.name}`).join(' · ') : 'Wählen Sie die gewünschte Menge.'}</p>
          <Button type="button" variant="gold" size="lg" className="mt-6" disabled={!items.length} onClick={order}>Bestellung anfragen</Button>
        </motion.div>
      </Section>
    </>
  );
}
