import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { api, backendUnavailable } from '@/lib/api';
import { SITE } from '@/lib/site';

// Sendet die Anfrage an den Worker und speichert sie im Admin-Bereich.
// Ist das Backend nicht erreichbar, wird stattdessen das Mailprogramm vorbereitet.
export default function InquiryForm({ type, fields, subject, submitLabel = 'Senden', note, successText }) {
  const [state, setState] = useState({ status: 'idle', message: '' });

  const mailFallback = (form) => {
    const data = new FormData(form);
    const lines = fields.filter((f) => f.type !== 'file' && data.get(f.name)).map((f) => `${f.label}: ${data.get(f.name)}`);
    const subj = data.get('betreff') || subject;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ status: 'sending', message: '' });
    const data = new FormData(form);
    data.set('type', type);
    try {
      await api('/api/inquiries', { method: 'POST', form: data });
      form.reset();
      setState({ status: 'ok', message: successText ?? 'Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns so rasch wie möglich.' });
    } catch (err) {
      if (backendUnavailable(err)) {
        mailFallback(form);
        setState({ status: 'fallback', message: `Ihr Mailprogramm wurde geöffnet. Bitte senden Sie die vorbereitete Nachricht dort ab (Anhänge fügen Sie bitte selbst hinzu). Oder rufen Sie uns an: ${SITE.phone}.` });
      } else {
        setState({ status: 'error', message: err.message });
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.full || f.type === 'file' ? 'sm:col-span-2' : ''}>
            <Field label={f.label} required={f.required} htmlFor={`f-${type}-${f.name}`}>
              {f.type === 'textarea' ? (
                <Textarea id={`f-${type}-${f.name}`} name={f.name} required={f.required} rows={5} maxLength={5000} />
              ) : f.type === 'file' ? (
                <Input id={`f-${type}-${f.name}`} name="file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="file:mr-3 file:rounded-full file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm" />
              ) : (
                <Input id={`f-${type}-${f.name}`} name={f.name} type={f.type ?? 'text'} required={f.required} autoComplete={f.autoComplete} maxLength={200} />
              )}
            </Field>
            {f.type === 'file' && <p className="mt-1 text-xs text-muted-foreground">PDF, Word, JPG oder PNG, maximal 5 MB.</p>}
          </div>
        ))}
      </div>
      {/* Honigtopf gegen Spam-Bots, für Menschen unsichtbar */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
      <Button type="submit" size="lg" disabled={state.status === 'sending'}>
        {state.status === 'sending' ? <Loader2 className="animate-spin" /> : <Send />} {submitLabel}
      </Button>
      <AnimatePresence>
        {state.message && (
          <motion.p
            role={state.status === 'error' ? 'alert' : 'status'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            {state.status === 'error' ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
            )}
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
