import { Banknote, ChefHat, CircleCheck, Eye, GlassWater, KeyRound, Smile, Star, Utensils } from 'lucide-react';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Accordion } from '@/components/ui/accordion';
import MailForm from '@/components/sections/MailForm';

const TASKS = [
  [ChefHat, 'Erstellen der Mise en place'],
  [Smile, 'Beraten und bedienen unserer Gäste'],
  [Utensils, 'À la carte Service'],
  [KeyRound, 'Führen einer eigenen Servicestation'],
  [GlassWater, 'Zubereitung von Drinks'],
  [Eye, 'Einhalten unserer hohen Qualitäts- und Hygienestandards'],
  [Banknote, 'Verantwortlich für Kasse/Tagesabrechnung']
];

const PROFILE = [
  'Erste Berufserfahrung an der Bar von Vorteil',
  'Positives und sicheres Auftreten sowie ein gepflegtes Erscheinungsbild',
  'Zu Ihren Stärken zählen Kreativität, eigenständiges Arbeiten und Flexibilität',
  'Sie lieben den Kundenkontakt und behalten in hektischen Momenten immer ein Lächeln',
  'Bar- und Serviceerfahrung sowie gute Deutschkenntnisse sind Voraussetzung',
  'Bereitschaft vor allem abends zu arbeiten',
  'Alter zwischen 25 und 45'
];

const OFFER = [
  'Gute Sozialleistungen',
  'Flexible Arbeitszeiten',
  'Abwechslungsreiche sowie verantwortungsvolle Tätigkeit in einem motivierten Team',
  'Arbeitsumfeld mit internationalen Gästen'
];

const INFO = [
  {
    title: 'Beschrieb',
    content: (
      <>
        <p>Unser Restaurant Alexi’s &amp; Weinbar liegt mitten im Herzen von Zürich mit 30 Innenplätzen und einer Terrasse, die im Sommer nochmals 30 Plätze bietet.</p>
        <p className="mt-2">Der Barbereich Cana Bar (Fumoir) ist separat und umfasst ebenfalls 30 Plätze.</p>
        <p className="mt-2">Wir sind ein beliebtes Speiselokal mit einem breiten Publikum. Hohe Qualität aus der Küche und im Servicebereich ist für uns Voraussetzung.</p>
      </>
    )
  }
];

const FIELDS = [
  { name: 'name', label: 'Name', required: true, autoComplete: 'family-name' },
  { name: 'vorname', label: 'Vorname', required: true, autoComplete: 'given-name' },
  { name: 'betreff', label: 'Betreff', full: true },
  { name: 'email', label: 'Ihre E-Mail-Adresse', type: 'email', required: true, autoComplete: 'email' },
  { name: 'telefon', label: 'Telefon', type: 'tel', required: true, autoComplete: 'tel' },
  { name: 'nachricht', label: 'Ihre Nachricht', type: 'textarea' }
];

function List({ title, children }) {
  return (
    <Reveal>
      <h2 className="mb-4 border-b border-border pb-2 text-3xl text-primary">{title}</h2>
      {children}
    </Reveal>
  );
}

export default function Jobs() {
  return (
    <>
      <PageHero eyebrow="Jobs" title="Bar-/Serviceaushilfe">
        <p>bis 100 % (m/w), nach Vereinbarung, zur Unterstützung unseres 14-köpfigen Teams.</p>
      </PageHero>
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-12">
            <List title="Ihre Aufgaben">
              <ul className="space-y-3">
                {TASKS.map(([Icon, t]) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="size-4" aria-hidden="true" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </List>
            <List title="Ihr Profil">
              <ul className="space-y-3">
                {PROFILE.map((t) => (
                  <li key={t} className="flex gap-3"><CircleCheck className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </List>
            <List title="Wir bieten">
              <ul className="space-y-3">
                {OFFER.map((t) => (
                  <li key={t} className="flex gap-3"><Star className="mt-0.5 size-5 shrink-0 fill-primary text-primary" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </List>
            <List title="Infos für die Bewerbung">
              <Accordion items={INFO} />
            </List>
          </div>

          <Reveal className="self-start lg:sticky lg:top-28">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
              <h2 className="text-3xl text-primary">Online bewerben</h2>
              <p className="mt-2 text-sm text-muted-foreground">Interesse? Dann füllen Sie bitte das Formular aus und bewerben sich online. Ihre Unterlagen (Lebenslauf, Zeugnisse) senden Sie bitte als Anhang an die vorbereitete E-Mail.</p>
              <div className="mt-6">
                <MailForm fields={FIELDS} subject="Bewerbung Bar-/Serviceaushilfe" submitLabel="Bewerbung senden" />
              </div>
              <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
                <p>Oder schicken Sie uns Ihre Unterlagen an:</p>
                <address className="mt-2 not-italic text-foreground">
                  Alexi’s Restaurant &amp; Weinbar<br />Herr Erich Palz<br />Niederdorfstrasse 40<br />8001 Zürich
                </address>
                <p className="mt-3">Herr Erich Palz freut sich, Sie persönlich kennen zu lernen.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
