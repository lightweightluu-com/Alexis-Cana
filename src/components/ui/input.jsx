import * as React from 'react';
import { cn } from '@/lib/utils';

const fieldClass =
  'w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 disabled:opacity-50';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input ref={ref} type={type} className={cn(fieldClass, className)} {...props} />
));
Input.displayName = 'Input';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldClass, 'min-h-32 resize-y', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export function Field({ label, required, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="text-primary" aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  );
}
