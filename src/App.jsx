import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import MenuPage from '@/pages/MenuPage';
import Spezialitaeten from '@/pages/Spezialitaeten';
import Weine from '@/pages/Weine';
import Monatsweine from '@/pages/Monatsweine';
import AGin from '@/pages/AGin';
import Cocktails from '@/pages/Cocktails';
import Cigars from '@/pages/Cigars';
import Jobs from '@/pages/Jobs';
import Kontakt from '@/pages/Kontakt';
import View360 from '@/pages/View360';
import Shop from '@/pages/Shop';
import NotFound from '@/pages/NotFound';

// Admin-Bereich wird nur bei Bedarf geladen und ist nicht Teil des öffentlichen Bundles.
const AdminApp = lazy(() => import('@/pages/admin/AdminApp'));

export default function App() {
  return (
    <Routes>
      <Route path="admin/*" element={<Suspense fallback={null}><AdminApp /></Suspense>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tagesmenu" element={<MenuPage kind="tagesmenu" />} />
        <Route path="speisekarte" element={<MenuPage kind="speisekarte" />} />
        <Route path="getraenkekarte" element={<MenuPage kind="getraenkekarte" />} />
        <Route path="spezialitaeten" element={<Spezialitaeten />} />
        <Route path="weine" element={<Weine />} />
        <Route path="monatsweine" element={<Monatsweine />} />
        <Route path="a-gin" element={<AGin />} />
        <Route path="cocktails" element={<Cocktails />} />
        <Route path="luwedos-cigars" element={<Cigars />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="kontakt" element={<Kontakt />} />
        <Route path="360" element={<View360 />} />
        <Route path="shop" element={<Shop />} />
        {/* Alte WordPress-Adressen */}
        <Route path="speisekarte-aktuell" element={<Navigate to="/speisekarte" replace />} />
        <Route path="vino-veritas" element={<Navigate to="/weine" replace />} />
        <Route path="panorama" element={<Navigate to="/360" replace />} />
        <Route path="job" element={<Navigate to="/jobs" replace />} />
        <Route path="mein-konto" element={<Navigate to="/shop" replace />} />
        <Route path="warenkorb" element={<Navigate to="/shop" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
