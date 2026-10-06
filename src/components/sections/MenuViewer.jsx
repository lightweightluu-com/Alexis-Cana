import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/effects/Reveal';

// Zeigt eine Karte als Bild (lesbar auf jedem Gerät) mit PDF-Download.
export default function MenuViewer({ image, pdf, alt, wide = false }) {
  return (
    <div className="mx-auto max-w-5xl">
      <Reveal>
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${alt} als PDF öffnen`}
          className={`group relative mx-auto block overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${wide ? 'w-full' : 'max-w-xl'}`}
        >
          <img src={image} alt={alt} className="w-full transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
          <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <ExternalLink className="size-3.5" aria-hidden="true" /> Vollbild
          </span>
        </a>
      </Reveal>
      <div className="mt-8 flex justify-center">
        <Button asChild>
          <a href={pdf} download>
            <Download /> Als PDF herunterladen
          </a>
        </Button>
      </div>
    </div>
  );
}
