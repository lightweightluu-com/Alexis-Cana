import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Platzhalter from '@/pages/Platzhalter';

// Alle Seiten der alten Website, damit keine URL ins Leere läuft.
const PAGES = [
  ['tagesmenu', 'Tagesmenu'],
  ['spezialitaeten', 'Spezialitäten'],
  ['speisekarte', 'Speisekarte'],
  ['monatsweine', 'Monatsweine'],
  ['weine', 'Weine'],
  ['a-gin', 'A Gin'],
  ['getraenkekarte', 'Getränkekarte'],
  ['luwedos-cigars', 'Luwedos Cigars'],
  ['cocktails', 'Cocktails'],
  ['jobs', 'Jobs'],
  ['kontakt', 'Kontakt'],
  ['360', '360° View'],
  ['shop', 'A-Shop']
];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {PAGES.map(([path, title]) => (
          <Route key={path} path={path} element={<Platzhalter title={title} />} />
        ))}
        <Route path="*" element={<Platzhalter title="Seite nicht gefunden" />} />
      </Route>
    </Routes>
  );
}
