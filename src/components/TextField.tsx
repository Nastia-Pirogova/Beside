import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, className = '', ...props }: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-ink-700">{label}</label>
      <input
        className={`w-full px-4 py-3.5 text-base bg-cream-50 border-2 rounded-2xl outline-none transition-colors placeholder:text-ink-400 ${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-ink-200 focus:border-coral-400'
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-sm text-ink-500">{hint}</p>}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function SelectField({ label, options, error, className = '', ...props }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-ink-700">{label}</label>
      <select
        className={`w-full px-4 py-3.5 text-base bg-cream-50 border-2 rounded-2xl outline-none transition-colors appearance-none ${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-ink-200 focus:border-coral-400'
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%238A7B6E' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          paddingRight: '48px',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

export function TextAreaField({ label, error, rows = 4, className = '', ...props }: TextAreaProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-ink-700">{label}</label>
      <textarea
        rows={rows}
        className={`w-full px-4 py-3.5 text-base bg-cream-50 border-2 rounded-2xl outline-none transition-colors placeholder:text-ink-400 resize-none ${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-ink-200 focus:border-coral-400'
        } ${className}`}
        {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
}
