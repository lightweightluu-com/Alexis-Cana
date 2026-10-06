import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { NAV, SITE } from '@/lib/site';
import { cn } from '@/lib/utils';

function Dropdown({ items, light }) {
  return (
    <div
      className={cn(
        'invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200',
        'group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
        'group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100'
      )}
    >
      <ul className="rounded-2xl border border-border bg-card/95 p-2 text-foreground shadow-2xl shadow-black/20 backdrop-blur-xl">
        {items.map((c, i) =>
          c.group ? (
            <li key={i} className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-gold first:pt-2">
              {c.group}
            </li>
          ) : (
            <li key={c.to + c.label}>
              <Link
                to={c.to}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                {c.label}
                {c.badge && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                    {c.badge}
                  </span>
                )}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <a
        href="#inhalt"
        className="sr-only z-[60] rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Zum Inhalt springen
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500 pt-[env(safe-area-inset-top)]',
          overHero ? 'bg-transparent' : 'border-b border-border bg-background/80 shadow-sm backdrop-blur-xl'
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Alexis & Cana – Startseite" className="shrink-0">
            <img
              src="/images/AC_Alexis_Neu_Website_Logo.png"
              alt="Alexis Restaurant & Winebar – Cana Cocktailbar & Fumoir"
              width="420"
              height="180"
              className={cn(
                'h-11 w-auto transition-all duration-500 sm:h-12',
                overHero ? 'brightness-0 invert' : 'dark:brightness-0 dark:invert'
              )}
            />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className={cn('flex items-center gap-1', overHero ? 'text-white' : 'text-foreground')}>
              {NAV.map((item) => (
                <li key={item.label} className="group relative">
                  <NavLink
                    to={item.to ?? item.children[0].to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-full px-4 py-2 text-sm tracking-wide transition-colors hover:bg-white/10',
                        !overHero && 'hover:bg-muted',
                        isActive && item.to && 'text-gold'
                      )
                    }
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                    {item.children && <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" aria-hidden="true" />}
                  </NavLink>
                  {item.children && <Dropdown items={item.children} />}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className={cn(
                'hidden items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors sm:flex',
                overHero ? 'border-white/30 text-white hover:bg-white/10' : 'border-border text-foreground hover:bg-muted'
              )}
            >
              <Phone className="size-4" aria-hidden="true" />
              Reservation
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Menü öffnen"
              aria-expanded={open}
              className={cn('flex size-11 items-center justify-center rounded-full lg:hidden', overHero ? 'text-white' : 'text-foreground')}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-ink px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-[#f3ead8] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
          >
            <div className="flex items-center justify-between">
              <img src="/images/AC_Alexis_Neu_Website_Logo.png" alt="" width="420" height="180" className="h-11 w-auto brightness-0 invert" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Menü schliessen" className="flex size-11 items-center justify-center rounded-full">
                <X className="size-6" />
              </button>
            </div>
            <nav aria-label="Mobile Navigation" className="mt-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="border-b border-white/10 py-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5 }}
                >
                  <Link to={item.to ?? item.children[0].to} className="flex items-center gap-3 font-serif text-3xl">
                    <item.icon className="size-5 text-gold" aria-hidden="true" />
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mt-3 flex flex-wrap gap-2 pl-8">
                      {item.children
                        .filter((c) => c.to)
                        .map((c) => (
                          <li key={c.to + c.label}>
                            <Link to={c.to} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </nav>
            <a href={SITE.phoneHref} className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#e8c07a] py-4 font-medium text-[#2a1418]">
              <Phone className="size-4" aria-hidden="true" />
              Reservation · {SITE.phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
