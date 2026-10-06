import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Cigarette, Flame, Glasses, MapPin, Martini, Phone, Star, Utensils, Wine } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import { Heading, Section } from '@/components/sections/PageHero';
import Reveal from '@/components/effects/Reveal';
import CountUp from '@/components/effects/CountUp';
import { Button } from '@/components/ui/button';
import { HOURS_DISPLAY, SITE } from '@/lib/site';

const SEATS = [
  { n: 30, label: 'Plätze im Restaurant' },
  { n: 30, label: 'Plätze auf der Terrasse im Sommer' },
  { n: 30, label: 'Plätze in der Cana Bar (Fumoir)' }
];

const SPECIALS = ['Beefsteak Tatar', 'Hot Stone', 'Spare Ribs', 'Wiener Schnitzel', 'Käsefondue', 'Fitnessteller', 'Apfelstrudel'];

const COCKTAILS = ['mojito', 'mai-tai', 'pina-colada', 'daiquiri', 'latin-lover', 'caipirinha', 'rise-of-tiki'];

export default function Home() {
  return (
    <>
      <Hero />
      <div id="inhalt-weiter" />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Heading eyebrow="Willkommen" title="Ein Haus, zwei Welten" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Unser Restaurant Alexi’s &amp; Weinbar liegt mitten im Herzen von Zürich. Der Barbereich Cana Bar (Fumoir) ist separat.
              Wir sind ein beliebtes Speiselokal mit einem breiten Publikum, und hohe Qualität in Küche und Service ist für uns die Voraussetzung.
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link to="/kontakt">
                So finden Sie uns <ArrowRight />
              </Link>
            </Button>
          </Reveal>
          <ul className="grid grid-cols-3 gap-4 self-center">
            {SEATS.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 0.12}>
                <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
                  <CountUp to={s.n} className="font-serif text-5xl text-primary sm:text-6xl" />
                  <p className="mt-2 text-xs leading-snug text-muted-foreground sm:text-sm">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <Link to="/speisekarte" className="group relative block h-full overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl sm:p-10">
              <Utensils className="size-8 text-gold" aria-hidden="true" />
              <h3 className="mt-6 text-4xl">Alexi’s Restaurant &amp; Winebar</h3>
              <p className="mt-3 max-w-md text-muted-foreground">Mittagsmenü, Spezialitäten vom Hot Stone bis zum Beefsteak Tatar, dazu Weine aus dem eigenen Keller.</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Zur Speisekarte <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <Link to="/cocktails" className="group relative block h-full overflow-hidden rounded-3xl bg-ink p-8 text-[#f3ead8] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl sm:p-10">
              <img src="/images/cocktails/palme.webp" alt="" className="absolute -right-6 -top-4 h-60 opacity-20 transition-transform duration-700 group-hover:scale-110" />
              <Martini className="size-8 text-[#e8c07a]" aria-hidden="true" />
              <h3 className="mt-6 text-4xl">Cana Cocktailbar &amp; Fumoir</h3>
              <p className="mt-3 max-w-md text-white/70">Karibische Cocktails, der eigene A Gin und handgerollte Zigarren von Luwedos.</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#e8c07a]">
                Zu den Cocktails <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Link to="/tagesmenu" className="group relative mx-auto block max-w-xl overflow-hidden rounded-2xl border border-border shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
              <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary-foreground">Aktuell</span>
              <img src="/karten/tagesmenu.webp" alt="Aktuelles Mittagsmenü" loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-[1.03]" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Heading eyebrow="Mittags" title="Das Tagesmenu">
              Jeden Werktag von 11.00 bis 14.00 Uhr: Suppe oder Salat und ein Hauptgang, frisch und abwechslungsreich.
            </Heading>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Clock className="size-4 text-gold" aria-hidden="true" /> Mo–Fr 11.00 bis 14.00 Uhr</li>
              <li className="flex items-center gap-2"><Flame className="size-4 text-gold" aria-hidden="true" /> {SITE.kitchen}</li>
            </ul>
            <Button asChild className="mt-8">
              <Link to="/tagesmenu">
                Menü ansehen <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      <section className="overflow-hidden border-y border-border bg-card py-6" aria-label="Spezialitäten">
        <motion.div className="flex w-max gap-10 font-serif text-3xl italic text-primary sm:text-4xl" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
          {[...SPECIALS, ...SPECIALS].map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              {s}
              <Star className="size-4 text-gold" aria-hidden="true" />
            </span>
          ))}
        </motion.div>
      </section>

      <Section tone="dark">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Heading eyebrow="Aus der Distillerie Seetal" title="A Gin">
              <span className="text-white/70">Mit Wacholder, Hopfen, Aronia, Chili, Orangenschale und Tormentill: unser eigener Gin mit Charakter.</span>
            </Heading>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold">
                <Link to="/a-gin">Die Geschichte des Gins</Link>
              </Button>
              <Button asChild variant="glass">
                <Link to="/shop">Im A-Shop kaufen</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-end justify-center gap-6 sm:gap-10">
              {['flasche-s', 'flasche-m', 'flasche-xl'].map((f, i) => (
                <motion.img key={f} src={`/images/gin/${f}.webp`} alt="" loading="lazy" className="h-auto w-[26%] max-w-[170px] drop-shadow-2xl" whileHover={{ y: -10, rotate: i === 1 ? 0 : i === 0 ? -3 : 3 }} transition={{ type: 'spring', stiffness: 250 }} />
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Heading eyebrow="Cana Bar" title="Cocktails &amp; Fumoir" />
        </Reveal>
        <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
          {COCKTAILS.map((c, i) => (
            <Reveal key={c} delay={i * 0.05} className="w-40 shrink-0 snap-center sm:w-auto">
              <Link to="/cocktails" className="group block rounded-2xl border border-border bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <img src={`/images/cocktails/${c}.webp`} alt={c.replace(/-/g, ' ')} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-110" />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/cocktails">Alle Cocktails</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/luwedos-cigars">
              <Cigarette /> Luwedos Cigars
            </Link>
          </Button>
        </Reveal>
      </Section>

      <Section tone="muted">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-card p-8">
              <Clock className="size-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 text-3xl">Öffnungszeiten</h3>
              <dl className="mt-5 space-y-3 text-sm">
                {HOURS_DISPLAY.map((h) => (
                  <div key={h.days}>
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-sm text-muted-foreground">{SITE.kitchen}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl bg-primary p-8 text-primary-foreground">
              <Phone className="size-6 text-[#e8c07a]" aria-hidden="true" />
              <h3 className="mt-4 text-3xl">Reservation</h3>
              <p className="mt-3 text-sm text-primary-foreground/80">Gerne reservieren wir Ihnen einen Tisch, telefonisch oder per E-Mail.</p>
              <a href={SITE.phoneHref} className="mt-5 block font-serif text-4xl hover:text-[#e8c07a]">{SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="mt-2 block text-sm underline underline-offset-4">{SITE.email}</a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-full rounded-3xl border border-border bg-card p-8">
              <MapPin className="size-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 text-3xl">Anfahrt</h3>
              <address className="mt-3 text-sm not-italic text-muted-foreground">{SITE.street}<br />{SITE.city}</address>
              <Button asChild variant="outline" className="mt-5">
                <Link to="/360"><Glasses /> 360° View</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal className="text-center">
          <Wine className="mx-auto size-8 text-gold" aria-hidden="true" />
          <h2 className="mt-4 text-4xl sm:text-5xl">Wie hat es Ihnen gefallen?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Bewerten Sie uns. Wir freuen uns über Ihre Rückmeldung.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {SITE.reviews.map((r) => (
              <Button key={r.label} asChild variant="outline">
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  <Star /> {r.label}
                </a>
              </Button>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
