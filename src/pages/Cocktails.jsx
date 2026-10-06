import { Link } from 'react-router-dom';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

const COCKTAILS = [
  ['mojito', 'Mojito'],
  ['caipirinha', 'Caipirinha'],
  ['daiquiri', 'Daiquiri'],
  ['el-presidente', 'El Presidente'],
  ['latin-lover', 'Latin Lover'],
  ['mai-tai', 'Mai Tai'],
  ['pina-colada', 'Piña Colada'],
  ['cana-bana', 'Cana Bana'],
  ['rise-of-tiki', 'Rise of Tiki']
];

export default function Cocktails() {
  return (
    <>
      <PageHero eyebrow="Cana Cocktailbar" title="Cocktails" image="/images/wein/bar.webp">
        Karibische Klassiker und Hausspezialitäten, frisch gemixt in der Cana Bar.
      </PageHero>
      <Section>
        <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {COCKTAILS.map(([id, name], i) => (
            <Reveal as="li" key={id} delay={(i % 3) * 0.08}>
              <div className="group rounded-3xl border border-border bg-card p-4 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <img src={`/images/cocktails/${id}.webp`} alt={name} loading="lazy" className="mx-auto w-full max-w-[280px] transition-transform duration-500 group-hover:scale-110" />
                <h2 className="mt-2 font-serif text-3xl text-primary">{name}</h2>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/getraenkekarte">Zur Getränkekarte</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/a-gin">A Gin</Link></Button>
        </Reveal>
      </Section>
    </>
  );
}
