import { Link } from 'react-router-dom';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

const WINES = [
  { id: 'gemischter-satz', name: 'Gemischter Satz' },
  { id: 'ultimate', name: 'Ultimate' },
  { id: 'salzl', name: 'Salzl' },
  { id: 'moma', name: 'Moma' },
  { id: 'damilano', name: 'Damilano' },
  { id: 'arzuaga', name: 'Arzuaga' }
];

export default function Monatsweine() {
  return (
    <>
      <PageHero eyebrow="Getränke" title="Monatsweine">
        Eine Auswahl, die wir Ihnen besonders ans Herz legen. Preise und Angebote nennt Ihnen unser Service oder die Getränkekarte.
      </PageHero>
      <Section>
        <ul className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {WINES.map((w, i) => (
            <Reveal as="li" key={w.id} delay={i * 0.07}>
              <div className="group flex h-full flex-col items-center rounded-3xl border border-border bg-card p-5 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <img src={`/images/wein/${w.id}.webp`} alt={`Flasche ${w.name}`} loading="lazy" className="h-52 w-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2" />
                <h2 className="mt-4 font-serif text-2xl">{w.name}</h2>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12 text-center">
          <Button asChild size="lg"><Link to="/getraenkekarte">Zur Getränkekarte</Link></Button>
        </Reveal>
      </Section>
    </>
  );
}
