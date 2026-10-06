import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Textarea } from '@/components/ui/input';
import { SITE } from '@/lib/site';

// Formular, das die Anfrage vorbereitet und im Mailprogramm öffnet.
// Sobald das Admin-Backend steht, wird hier per fetch() gesendet und gespeichert.
export default function MailForm({ fields, subject, submitLabel = 'Senden', note }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = fields.filter((f) => data.get(f.name)).map((f) => `${f.label}: ${data.get(f.name)}`);
    const subj = data.get('betreff') || subject;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.full ? 'sm:col-span-2' : ''}>
            <Field label={f.label} required={f.required} htmlFor={`f-${f.name}`}>
              {f.type === 'textarea' ? (
                <Textarea id={`f-${f.name}`} name={f.name} required={f.required} rows={5} />
              ) : (
                <Input id={`f-${f.name}`} name={f.name} type={f.type ?? 'text'} required={f.required} autoComplete={f.autoComplete} />
              )}
            </Field>
          </div>
        ))}
      </div>
      {note && <p className="text-sm text-muted-foreground">{note}</p>}
      <Button type="submit" size="lg">
        <Send /> {submitLabel}
      </Button>
      <AnimatePresence>
        {sent && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
            Ihr Mailprogramm wurde geöffnet. Bitte senden Sie die vorbereitete Nachricht dort ab. Alternativ erreichen Sie uns unter {SITE.phone}.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
