import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function Login({ onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/admin/login', { method: 'POST', body: { password: new FormData(e.currentTarget).get('password') } });
      onDone();
    } catch (err) {
      setError(err.status === 404 || !err.status ? 'Der Admin-Bereich ist hier nicht verfügbar.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Lock className="size-5" aria-hidden="true" /></span>
          <h1 className="mt-4 text-3xl">Admin-Bereich</h1>
          <p className="mt-1 text-sm text-muted-foreground">Alexis &amp; Cana</p>
        </div>
        <Field label="Passwort" htmlFor="pw">
          <Input id="pw" name="password" type="password" required autoFocus autoComplete="current-password" />
        </Field>
        {error && <p role="alert" className="text-sm text-primary">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />} Anmelden</Button>
      </form>
    </main>
  );
}
