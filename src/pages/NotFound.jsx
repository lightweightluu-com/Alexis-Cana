import { Link } from 'react-router-dom';
import PageHero, { Section } from '@/components/sections/PageHero';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Fehler 404" title="Seite nicht gefunden">Diese Seite gibt es nicht (mehr). Hier geht es zurück zum Genuss.</PageHero>
      <Section>
        <Button asChild size="lg"><Link to="/">Zur Startseite</Link></Button>
      </Section>
    </>
  );
}
