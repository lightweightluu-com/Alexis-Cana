import { Link } from 'react-router-dom';
import { Clock, Glasses, Mail, MapPin, Phone, Printer } from 'lucide-react';
import PageHero, { Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import { Button } from '@/components/ui/button';
import InquiryForm from '@/components/sections/InquiryForm';
import { HOURS_DISPLAY, SITE } from '@/lib/site';

const FIELDS = [
  { name: 'name', label: 'Ihr Name', required: true, autoComplete: 'name' },
  { name: 'email', label: 'Ihre E-Mail-Adresse', type: 'email', required: true, autoComplete: 'email' },
  { name: 'betreff', label: 'Betreff', full: true },
  { name: 'nachricht', label: 'Ihre Nachricht', type: 'textarea', required: true }
];

export default function Kontakt() {
  return (
    <>
      <PageHero eyebrow="Kontakt" title="Wir freuen uns auf Sie">
        Reservationen, Fragen oder Anregungen: Rufen Sie uns an oder schreiben Sie uns.
      </PageHero>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <Reveal>
              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="text-3xl text-primary">Kontaktinfos</h2>
                <address className="mt-5 space-y-3 not-italic">
                  <p className="flex items-center gap-3"><MapPin className="size-5 text-gold" aria-hidden="true" />{SITE.street}, {SITE.city}</p>
                  <p><a href={SITE.phoneHref} className="flex items-center gap-3 hover:text-primary"><Phone className="size-5 text-gold" aria-hidden="true" />Telefon: +41 (0)44 252 37 88</a></p>
                  <p className="flex items-center gap-3"><Printer className="size-5 text-gold" aria-hidden="true" />Fax: +41 (0)44 252 37 87</p>
                  <p><a href={`mailto:${SITE.email}`} className="flex items-center gap-3 hover:text-primary"><Mail className="size-5 text-gold" aria-hidden="true" />{SITE.email}</a></p>
                </address>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-border bg-card p-8">
                <h2 className="flex items-center gap-3 text-3xl text-primary"><Clock className="size-6 text-gold" aria-hidden="true" />Öffnungszeiten</h2>
                <dl className="mt-5 space-y-3">
                  {HOURS_DISPLAY.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4 border-b border-border pb-3 last:border-0">
                      <dt className="text-muted-foreground">{h.days}</dt>
                      <dd className="font-medium">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm text-muted-foreground">{SITE.kitchen}</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <Button asChild variant="outline" size="lg"><Link to="/360"><Glasses /> 360° View ansehen</Link></Button>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
              <h2 className="text-3xl text-primary">Kontakt-Formular</h2>
              <div className="mt-6">
                <InquiryForm type="contact" fields={FIELDS} subject="Anfrage über die Website" />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
