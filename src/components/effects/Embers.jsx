import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Deterministischer Zufall, damit die Funken bei jedem Render gleich bleiben.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Aufsteigende Funken wie von Kerzen und Fumoir-Glut.
export default function Embers({ count = 18 }) {
  const reduce = useReducedMotion();
  const embers = useMemo(() => {
    const rnd = mulberry32(1963);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rnd() * 100,
      size: 2 + rnd() * 3,
      duration: 9 + rnd() * 9,
      delay: rnd() * 10,
      drift: (rnd() - 0.5) * 120
    }));
  }, [count]);

  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((e) => (
        <motion.span
          key={e.id}
          className="absolute bottom-[-4%] rounded-full bg-[#ffb35c]"
          style={{ left: `${e.left}%`, width: e.size, height: e.size, boxShadow: '0 0 10px 2px rgba(255,160,70,.7)' }}
          animate={{ y: ['0vh', '-85vh'], x: [0, e.drift], opacity: [0, 0.9, 0] }}
          transition={{ duration: e.duration, delay: e.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}
