import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

export default function CountUp({ to, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = to;
      return;
    }
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => (ref.current.textContent = Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className={className}>0</span>;
}
