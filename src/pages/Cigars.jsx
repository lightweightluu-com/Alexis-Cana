import { ExternalLink } from 'lucide-react';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

const CIGARS = [
  ['churchill', 'Churchill'],
  ['jumbo', 'Jumbo'],
  ['torpedo', 'Torpedo'],
  ['corona', 'Corona'],
  ['robusto-hell', 'Robusto hell'],
  ['robusto-dunkel', 'Robusto dunkel'],
  ['delgado', 'Delgado'],
  ['petit-corona', 'Petit Corona']
];

export default function Cigars() {
  return (
    <>
      <PageHero eyebrow="Cana Fumoir" title="Luwedos Cigars">
        Im separaten Fumoir der Cana Bar geniessen Sie Zigarren von Luwedos, in acht klassischen Formaten.
      </PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {CIGARS.map(([id, name], i) => (
              <Reveal as="li" key={id} delay={(i % 4) * 0.06}>
                <div className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:gap-8 sm:p-5">
                  <h2 className="font-serif text-3xl text-primary sm:w-48">{name}</h2>
                  <img src={`/images/cigars/${id}.webp`} alt={`Zigarre ${name}`} loading="lazy" className="w-full transition-transform duration-500 group-hover:translate-x-2 sm:flex-1" />
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="self-start lg:sticky lg:top-28">
            <div className="rounded-3xl bg-ink p-6 text-center text-[#f3ead8]">
              <img src="/images/cigars/artwork.webp" alt="Luwedos Zigarren, Illustration" loading="lazy" className="mx-auto max-h-80 w-auto" />
              <Button asChild variant="gold" className="mt-6">
                <a href="http://www.luwe.ch/?a=1" target="_blank" rel="noopener noreferrer">Luwedos Zigarren <ExternalLink /></a>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
