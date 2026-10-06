import { Clock, Flame } from 'lucide-react';
import PageHero, { Section } from '@/components/sections/PageHero';
import MenuViewer from '@/components/sections/MenuViewer';
import { SITE } from '@/lib/site';

const PAGES = {
  tagesmenu: {
    eyebrow: 'Mittags',
    title: 'Tagesmenu',
    image: '/karten/tagesmenu.webp',
    pdf: '/karten/tagesmenu.pdf',
    alt: 'Mittagsmenü der aktuellen Woche',
    wide: true,
    intro: 'Aktuell: Woche vom 5. bis 9. Oktober 2026. Mittagsmenüs werden von Montag bis Freitag zwischen 11.00 und 14.00 Uhr serviert.',
    notes: [
      [Clock, 'Mo–Fr 11.00 bis 14.00 Uhr'],
      [Flame, SITE.kitchen]
    ]
  },
  speisekarte: {
    eyebrow: 'Alexi’s Restaurant',
    title: 'Speisekarte',
    image: '/karten/speisekarte.webp',
    pdf: '/karten/speisekarte.pdf',
    alt: 'Speisekarte von Alexi’s Restaurant & Winebar',
    intro: 'Unsere Angebotskarte. Fragen zu Allergenen beantwortet Ihnen unser Service gerne.',
    notes: [[Flame, SITE.kitchen]]
  },
  getraenkekarte: {
    eyebrow: 'Restaurant & Bar',
    title: 'Getränkekarte',
    image: '/karten/getraenkekarte.webp',
    pdf: '/karten/getraenkekarte.pdf',
    alt: 'Getränkekarte von Alexis und Cana',
    wide: true,
    intro: 'Weine, Gin, Cocktails und mehr. Unsere Getränkekarte für Restaurant und Cana Bar.',
    notes: []
  }
};

export default function MenuPage({ kind }) {
  const p = PAGES[kind];
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title}>
        <p>{p.intro}</p>
        {p.notes.length > 0 && (
          <ul className="mt-5 space-y-2 text-sm text-white/65">
            {p.notes.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="size-4 text-[#e8c07a]" aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        )}
      </PageHero>
      <Section>
        <MenuViewer image={p.image} pdf={p.pdf} alt={p.alt} wide={p.wide} />
      </Section>
    </>
  );
}
