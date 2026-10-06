import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHero, { Heading, Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

const PHOTOS = [
  { src: 'keller-1', alt: 'Weinkeller und Lagerregale im Alexis' },
  { src: 'keller-2', alt: 'Weinregal mit «Vino Veritas»-Schriftzug' },
  { src: 'bar', alt: 'Weinkarte an der Bar' }
];

export default function Weine() {
  return (
    <>
      <PageHero eyebrow="Getränke" title="In Vino Veritas" image="/images/wein/keller-2.webp">
        Unsere Weinbar lebt von Auswahl und Leidenschaft. Lassen Sie sich von unserem Service beraten.
      </PageHero>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.src} delay={i * 0.1}>
              <figure className="group overflow-hidden rounded-3xl border border-border shadow-lg">
                <motion.img src={`/images/wein/${p.src}.webp`} alt={p.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 grid items-center gap-8 md:grid-cols-2">
          <Heading eyebrow="Weine" title="Die Weinkarte">Unsere vollständige Auswahl finden Sie in der Getränkekarte. Dazu wechseln unsere Monatsweine regelmässig.</Heading>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild><Link to="/getraenkekarte">Getränkekarte</Link></Button>
            <Button asChild variant="outline"><Link to="/monatsweine">Monatsweine</Link></Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
