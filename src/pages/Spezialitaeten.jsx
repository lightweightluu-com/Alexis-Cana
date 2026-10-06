import { Link } from 'react-router-dom';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

const DISHES = [
  { title: 'Beefsteak Tatar', sub: 'Schweizer Rindfleisch, mit Butter und Toast', badge: 'Hit', img: 'tatar', prices: ['70 g · CHF 21.50', '140 g · CHF 28.50', '210 g · CHF 35.50'] },
  { title: 'Hot Stone', sub: 'Rindfleisch, Poulet, Lamm, Schweinefleisch', img: 'hotstone' },
  { title: 'Spare Ribs', sub: 'Mit Dip und Beilage', img: 'spare-ribs' },
  { title: 'Wiener Schnitzel', sub: 'Original, goldbraun gebraten', badge: 'Original', img: 'schnitzel' },
  { title: 'Apfelstrudel', sub: 'Hausgemacht, mit Vanillesauce', badge: 'Klassiker', img: 'apfelstrudel' },
  { title: 'Fitnessteller', sub: 'Frische Salate mit Fleisch vom Grill' },
  { title: 'Käsefondue', sub: 'In verschiedenen Variationen', img: 'fondue', wide: true }
];

export default function Spezialitaeten() {
  return (
    <>
      <PageHero eyebrow="Alexi’s Restaurant" title="Spezialitäten">
        Was unsere Gäste immer wieder bestellen: Klassiker, die wir mit Sorgfalt zubereiten.
      </PageHero>
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((d, i) => (
            <Reveal key={d.title} delay={(i % 3) * 0.08} className={d.wide ? 'sm:col-span-2 lg:col-span-3' : ''}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl">
                {d.badge && (
                  <span className="absolute right-4 top-4 z-10 rotate-3 rounded-md bg-primary px-3 py-1 font-serif text-lg italic text-primary-foreground shadow-lg">{d.badge}</span>
                )}
                {d.img && (
                  <div className={`flex items-center justify-center bg-muted ${d.wide ? 'h-56 sm:h-72' : 'h-60'}`}>
                    <img src={`/images/essen/${d.img}.webp`} alt={d.title} loading="lazy" className={`transition-transform duration-700 group-hover:scale-105 ${d.wide ? 'size-full object-cover' : 'max-h-full max-w-full object-contain p-4'}`} />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-3xl text-primary">{d.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{d.sub}</p>
                  {d.prices && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {d.prices.map((p) => (
                        <li key={p} className="rounded-full border border-border px-3 py-1 text-xs">{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Button asChild size="lg">
            <Link to="/speisekarte">Zur Speisekarte</Link>
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
