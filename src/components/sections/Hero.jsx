import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Flame, MapPin, Martini, Phone, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Embers from '@/components/effects/Embers';
import { SITE, getOpenStatus } from '@/lib/site';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1];
const LINES = [['Mitten', 'im', 'Herzen'], ['von', 'Zürich']];

function Headline() {
  let n = 0;
  return (
    <h1 className="text-[clamp(2.9rem,9vw,7.5rem)] font-medium leading-[0.95] tracking-tight text-white">
      {LINES.map((words, li) => (
        <span key={li} className="block">
          {words.map((w) => {
            const i = n++;
            const accent = li === 1 && w === 'Zürich';
            return (
              <span key={w} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={cn('inline-block', accent && 'italic text-[#e8c07a]')}
                  initial={{ y: '110%', rotate: 4 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 1.1, delay: 0.5 + i * 0.12, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function OpenBadge() {
  const [status, setStatus] = useState(() => getOpenStatus());
  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-xs tracking-wide text-white/90 backdrop-blur-md">
      <span className="relative flex size-2">
        {status.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
        <span className={cn('relative inline-flex size-2 rounded-full', status.open ? 'bg-emerald-400' : 'bg-amber-400')} />
      </span>
      {status.label}
    </span>
  );
}

const VENUES = [
  { icon: Utensils, title: 'Alexi’s Restaurant & Winebar', text: 'Mittagsmenü, Spezialitäten und Weine', to: '/tagesmenu' },
  { icon: Martini, title: 'Cana Cocktailbar & Fumoir', text: 'Cocktails, A Gin und Zigarren', to: '/cocktails' }
];

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 180]);
  const contentY = useTransform(scrollY, [0, 700], [0, -60]);
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0]);

  // Mausfolgendes Licht (nur mit echter Maus, nicht auf Touch-Geräten).
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const glow = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(255,175,95,0.16), transparent 62%)`;
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section
      onPointerMove={onMove}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
      aria-labelledby="hero-title"
    >
      {/* Hintergrundfoto mit Zoom-Intro und Parallax */}
      <motion.div className="absolute inset-0 -z-30" style={{ y: reduce ? 0 : bgY }}>
        <motion.img
          src="/images/hero-niederdorf.jpg"
          alt="Abendstimmung vor der Cana-Bar und dem Restaurant Alexis an der Niederdorfstrasse in Zürich"
          width="2000"
          height="848"
          fetchpriority="high"
          className="h-[112%] w-full object-cover object-[22%_center] md:object-[35%_center]"
          initial={{ scale: reduce ? 1.04 : 1.22 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 3.4, ease: EASE }}
        />
      </motion.div>

      {/* Verläufe für Lesbarkeit und Stimmung */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink via-ink/35 via-45% to-ink/10" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-ink/70 via-ink/10 via-60% to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-20 h-40 bg-gradient-to-b from-ink/60 to-transparent" />

      {/* Flackerndes Laternen- und Fensterlicht */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -z-10 mix-blend-screen"
            style={{ left: '66%', top: '8%', width: '26vw', height: '26vw', background: 'radial-gradient(circle, rgba(255,150,60,.55), transparent 65%)' }}
            animate={{ opacity: [0.45, 0.85, 0.55, 0.95, 0.5], scale: [1, 1.08, 0.97, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -z-10 mix-blend-screen"
            style={{ left: '28%', top: '36%', width: '30vw', height: '24vw', background: 'radial-gradient(circle, rgba(255,140,50,.4), transparent 68%)' }}
            animate={{ opacity: [0.35, 0.7, 0.4, 0.75, 0.35] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}
      <motion.div aria-hidden="true" className="absolute inset-0 -z-10 hidden md:block" style={{ background: glow }} />
      <Embers count={typeof window !== 'undefined' && window.innerWidth < 640 ? 8 : 18} />

      {/* Inhalt */}
      <motion.div
        className="relative mx-auto w-full max-w-7xl px-4 pb-6 pt-28 sm:pb-10 sm:pt-32 sm:px-6 lg:px-8"
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
      >
        <motion.div
          className="mb-6 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <OpenBadge />
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-[#e8c07a]">
            <MapPin className="size-3.5" aria-hidden="true" />
            Niederdorf · Zürich
          </span>
        </motion.div>

        <span id="hero-title" className="sr-only">
          Alexis Restaurant & Winebar – Cana Cocktailbar & Fumoir
        </span>
        <Headline />

        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
        >
          Restaurant, Winebar, Cocktailbar und Fumoir unter einem Dach: vom Mittagsmenü bis zum letzten Cocktail.
          <span className="mt-1 flex items-center gap-2 text-sm text-white/60">
            <Flame className="size-4 text-[#e8c07a]" aria-hidden="true" />
            {SITE.kitchen}
          </span>
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: EASE }}
        >
          <Button asChild size="lg" variant="gold">
            <a href={SITE.phoneHref}>
              <Phone /> Tisch reservieren
            </a>
          </Button>
          <Button asChild size="lg" variant="glass">
            <Link to="/speisekarte">
              Speisekarte ansehen <ArrowRight />
            </Link>
          </Button>
        </motion.div>

        <motion.ul
          className="mt-8 grid gap-2 sm:mt-10 sm:gap-3 md:max-w-3xl md:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.75, ease: EASE }}
        >
          {VENUES.map((v) => (
            <li key={v.to}>
              <Link
                to={v.to}
                className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-black/25 p-3 text-white sm:p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#e8c07a]/60 hover:bg-white/[0.12] hover:shadow-2xl hover:shadow-black/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#e8c07a]/15 text-[#e8c07a] transition-transform duration-300 group-hover:scale-110">
                  <v.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg leading-tight sm:text-xl">{v.title}</span>
                  <span className="hidden text-sm text-white/60 sm:block">{v.text}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-white/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#e8c07a]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.a
        href="#inhalt-weiter"
        aria-label="Nach unten scrollen"
        className="absolute bottom-4 right-6 hidden text-white/60 transition-colors hover:text-white md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2.2 }, y: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 2.2 } }}
      >
        <ChevronDown className="size-7" />
      </motion.a>
    </section>
  );
}
