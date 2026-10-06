import { Link } from 'react-router-dom';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';

// Wird Seite für Seite durch die echten Inhalte ersetzt.
export default function Platzhalter({ title }) {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-start justify-center px-4 pb-16 pt-36 sm:px-6">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Im Aufbau</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">Dieser Bereich wird nach der Freigabe des Hero-Bereichs gebaut.</p>
        <Button asChild className="mt-8">
          <Link to="/">Zur Startseite</Link>
        </Button>
      </Reveal>
    </section>
  );
}
