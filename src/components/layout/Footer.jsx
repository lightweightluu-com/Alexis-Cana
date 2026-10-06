import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { HOURS_DISPLAY, SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-serif text-2xl">Kontakt</h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="size-4 text-gold" aria-hidden="true" />{SITE.street}, {SITE.city}</p>
            <p><a className="flex items-center gap-2 hover:text-foreground" href={SITE.phoneHref}><Phone className="size-4 text-gold" aria-hidden="true" />{SITE.phone}</a></p>
            <p><a className="flex items-center gap-2 hover:text-foreground" href={`mailto:${SITE.email}`}><Mail className="size-4 text-gold" aria-hidden="true" />{SITE.email}</a></p>
          </address>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Öffnungszeiten</h2>
          <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
            {HOURS_DISPLAY.map((h) => (
              <div key={h.days} className="flex justify-between gap-4"><dt>{h.days}</dt><dd className="text-foreground">{h.time}</dd></div>
            ))}
          </dl>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4 text-gold" aria-hidden="true" />{SITE.kitchen}</p>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Links</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {[...SITE.links, ...SITE.reviews].map((l) => (
              <li key={l.href}><a className="hover:text-foreground" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-muted-foreground">© {new Date().getFullYear()} Alexis Cana · Alle Rechte vorbehalten</p>
    </footer>
  );
}
