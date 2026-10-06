import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Kopfbereich der Unterseiten: dunkles Bordeaux mit sanft schwebendem Licht.
export default function PageHero({ eyebrow, title, children, image }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink px-4 pb-14 pt-36 text-white sm:px-6 sm:pb-20 sm:pt-44 lg:px-8">
      {image && <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-35" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#5a1020]/80 via-ink/70 to-ink" />
      <motion.div
        aria-hidden="true"
        className="absolute -right-24 top-10 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(232,192,122,.28),transparent_65%)]"
        animate={{ y: [0, 24, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="mx-auto max-w-7xl">
        {eyebrow && (
          <motion.p
            className="text-xs uppercase tracking-[0.25em] text-[#e8c07a]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
        )}
        <div className="overflow-hidden pb-2">
          <motion.h1
            className="mt-3 text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] tracking-tight"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
          >
            {title}
          </motion.h1>
        </div>
        {children && (
          <motion.div
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function Section({ children, className = '', tone = 'default', id }) {
  const tones = { default: 'bg-background', muted: 'bg-muted', dark: 'bg-ink text-[#f3ead8]' };
  return (
    <section id={id} className={`px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${tones[tone]} ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function Heading({ eyebrow, title, children, className = '' }) {
  return (
    <div className={className}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
      <h2 className="mt-2 text-4xl leading-tight sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 max-w-2xl text-muted-foreground">{children}</p>}
    </div>
  );
}
