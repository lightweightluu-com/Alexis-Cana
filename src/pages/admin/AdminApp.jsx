import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Inbox as InboxIcon, Loader2, LogOut, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import Login from './Login';
import Inbox from './Inbox';
import MenuEditor from './MenuEditor';

export default function AdminApp() {
  const [auth, setAuth] = useState('checking');
  const [tab, setTab] = useState('inbox');
  const [newCount, setNewCount] = useState(0);
  const onCount = useCallback((n) => setNewCount(n), []);

  useEffect(() => {
    document.title = 'Admin · Alexis & Cana';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  const check = useCallback(() => {
    api('/api/admin/me')
      .then(() => setAuth('in'))
      .catch(() => setAuth('out'));
  }, []);
  useEffect(check, [check]);

  const logout = async () => {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setAuth('out');
  };

  if (auth === 'checking') return <div className="grid min-h-dvh place-items-center bg-background"><Loader2 className="size-6 animate-spin text-gold" aria-label="Lädt" /></div>;
  if (auth === 'out') return <Login onDone={() => { setAuth('in'); }} />;

  const tabs = [
    ['inbox', 'Anfragen', InboxIcon, newCount],
    ['menus', 'Karten', UtensilsCrossed, 0]
  ];

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <h1 className="font-serif text-2xl">Admin</h1>
          <nav className="flex gap-1" aria-label="Bereiche">
            {tabs.map(([k, l, Icon, n]) => (
              <button key={k} type="button" aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)} className={cn('flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors', tab === k ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
                <Icon className="size-4" aria-hidden="true" /> {l}
                {n > 0 && <span className={cn('rounded-full px-1.5 text-xs', tab === k ? 'bg-white/25' : 'bg-primary text-primary-foreground')} aria-label={`${n} neu`}>{n}</span>}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="ghost" size="sm"><Link to="/" target="_blank"><ExternalLink /> Website</Link></Button>
            <Button variant="ghost" size="sm" onClick={logout}><LogOut /> Abmelden</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {tab === 'inbox' ? <Inbox onCount={onCount} /> : <MenuEditor />}
      </main>
    </div>
  );
}
