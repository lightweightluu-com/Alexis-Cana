import Reveal from '@/components/effects/Reveal';

const ALLERGENS =
  'A: glutenhaltiges Getreide, B: Krebstiere, C: Eier, D: Fisch, E: Erdnüsse, F: Sojabohnen, G: Milch, H: Hartschalenobst, K: Kürbiskerne, L: Sellerie, M: Senf, N: Sesam, O: Schwefeldioxid und Sulfite, P: Lupinen, R: Weichtiere';

// Karte aus der Datenbank (im Admin-Bereich pflegbar).
export default function DigitalMenu({ sections, showAllergens = false }) {
  return (
    <div className="mx-auto max-w-3xl space-y-14">
      {sections.map((s) => (
        <Reveal key={s.id}>
          <section aria-labelledby={`sec-${s.id}`}>
            <h2 id={`sec-${s.id}`} className="border-b border-border pb-3 text-4xl text-primary">{s.title}</h2>
            {s.subtitle && <p className="mt-2 text-sm text-muted-foreground">{s.subtitle}</p>}
            <ul className="mt-6 space-y-6">
              {s.items.map((i) => (
                <li key={i.id}>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-serif text-2xl leading-snug">
                      {i.name}
                      {i.badge && <span className="ml-2 rounded bg-primary px-2 py-0.5 align-middle font-sans text-[10px] font-medium uppercase tracking-wider text-primary-foreground">{i.badge}</span>}
                    </h3>
                    <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-0.25em] border-b border-dotted border-border" />
                    {i.price && <span className="shrink-0 font-medium tabular-nums">{/^[\d.,]+$/.test(i.price) ? `CHF ${i.price}` : i.price}</span>}
                  </div>
                  {i.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{i.description}</p>}
                  {i.allergens && <p className="mt-1 text-xs tracking-wider text-gold" title="Allergene">{i.allergens}</p>}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      ))}
      {showAllergens && <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">Allergene: {ALLERGENS}</p>}
    </div>
  );
}
