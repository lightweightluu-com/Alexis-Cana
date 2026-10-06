import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import PageHero, { Heading, Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

const BOTANICALS = [
  { id: 'hopfen', name: 'Hopfen', text: 'Die wertgebenden Inhaltsstoffe des Hopfens sind Bitterstoffe (Hopfenharze), Aromastoffe (Hopfenöle, ätherische Öle) und Gerbstoffe (Polyphenole). Die Bitterstoffe und ätherischen Öle befinden sich im Hopfenmehl (Lupulin), das in den Harzdrüsen der Doldenblätter gebildet wird. Neben der geschmacksprägenden Note hat die Verwendung von Hopfen bei der Bierherstellung Einfluss auf die Keimflora.' },
  { id: 'chili', name: 'Chili', text: 'Chili ist eines der ältesten Lebensmittel Amerikas und wurde lange vor der Maya-Zeit kultiviert und genutzt, also aus einer Zeit noch bevor der Mensch die Töpferei kannte. In Ecuador zum Beispiel fand man die ältesten Chili-Reste (Stärkepartikel) auf Mühlsteinen und Kochgefässen und in Panama an Steinwerkzeugen. Chili gibt dem A Gin die Originalität.' },
  { id: 'wacholder', name: 'Wacholder', text: 'Wacholderbeeren erinnern in ihrem Aroma an Gin: ohne Wacholder kein Gin. Sie duften würzig, ein wenig harzig-süsslich und schmecken warm-brennend, mit Anklängen an Rosmarin und Lorbeer. Das Aroma der ganzen Beeren entwickelt sich nur langsam.' },
  { id: 'aronia', name: 'Aroniabeere', text: 'Die Aroniabeere führt die Hitliste des gesunden Beerenobstes an. Keine andere Frucht hat eine so hohe Konzentration von Anthocyanen wie die Aronia. Es sind vor allem die blauen und roten Farbstoffe, die sogenannten Anthocyane. Beeren sind reich an natürlichen Antioxidantien und können eine Vielzahl gesundheitsfördernder Effekte erzielen.' },
  { id: 'orange', name: 'Orangenschale', text: 'Orangenschale enthält Hesperidin, ein Flavonoid, das die Lipidwerte im Blut reguliert. Die Schalen enthalten 20 % mehr Hesperidin als das Fruchtfleisch. Die Senkung des Cholesterinspiegels gehört also zu den gesunden Eigenschaften der Orangenschale.' },
  { id: 'tormentill', name: 'Tormentill', text: 'Tormentill (Blutwurz, Potentilla erecta) ist eine sehr alte Heilpflanze, die für zahlreiche Beschwerden verwendet werden kann. Die Wurzeln werden bei Zahn- und Rachenentzündungen, bei Durchfallerkrankungen oder zur Wundheilung verwendet. Sie gehört zur artenreichen Familie der Rosengewächse, zu der auch Odermennig, Frauenmantel und Mädesüss zählen.' }
];

const SIZES = [
  { id: 'flasche-s', cl: '10 cl', price: '11.–' },
  { id: 'flasche-m', cl: '35 cl', price: '31.–' },
  { id: 'flasche-xl', cl: '70 cl', price: '56.–' }
];

export default function AGin() {
  return (
    <>
      <PageHero eyebrow="Aus der Distillerie Seetal" title="A Gin">
        Unser eigener Gin: sechs Botanicals, ein Charakter. Hergestellt in der Distillerie Seetal.
      </PageHero>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img src="/images/gin/mood.webp" alt="A Gin – Illustration mit Wacholder, Aronia, Orangenschale und Chili" className="mx-auto w-full max-w-md rounded-3xl" loading="lazy" />
          </Reveal>
          <Reveal delay={0.1}>
            <Heading eyebrow="Serviervorschlag" title="So geniessen Sie ihn" />
            <div className="mt-6 flex items-start gap-6 rounded-3xl border border-border bg-card p-6">
              <img src="/images/gin/serviervorschlag.webp" alt="Serviervorschlag im Glas" className="h-44 w-auto shrink-0" loading="lazy" />
              <ul className="space-y-2 text-sm leading-relaxed">
                {['5 cl A Gin', 'Eiswürfel', '3–4 Aronia, geschnitten', 'Chilischote auf Holzspiess', 'Mit Gents Tonic auffüllen'].map((s) => (
                  <li key={s} className="flex gap-2"><span className="text-gold" aria-hidden="true">◆</span>{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="muted">
        <Reveal><Heading eyebrow="Die Botanicals" title="Was im A Gin steckt" /></Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BOTANICALS.map((b, i) => (
            <Reveal key={b.id} delay={(i % 3) * 0.08}>
              <motion.article whileHover={{ y: -6 }} className="h-full rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-2xl">
                <div className="flex items-center gap-4">
                  <img src={`/images/gin/${b.id}.webp`} alt="" className="h-20 w-auto" loading="lazy" />
                  <h3 className="text-3xl text-primary">{b.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <Reveal><Heading eyebrow="A-Shop" title="Den A Gin mit nach Hause nehmen" /></Reveal>
        <ul className="mt-12 flex flex-wrap items-end justify-center gap-10 sm:gap-16">
          {SIZES.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.1} className="text-center">
              <img src={`/images/gin/${s.id}.webp`} alt={`A Gin ${s.cl}`} className="mx-auto h-auto max-h-72 w-auto drop-shadow-2xl" loading="lazy" />
              <p className="mt-4 font-serif text-2xl">{s.cl}</p>
              <p className="text-[#e8c07a]">CHF {s.price}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12 text-center">
          <Button asChild variant="gold" size="lg"><Link to="/shop"><ShoppingBag /> Zum A-Shop</Link></Button>
        </Reveal>
      </Section>
    </>
  );
}
