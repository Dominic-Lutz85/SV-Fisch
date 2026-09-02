import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full  border border-linie bg-flaeche-hoch px-3.5 py-2.5 text-sm text-text placeholder:text-text-leise focus:border-text focus:outline-none";

interface BaseProps {
  label: string;
  name: string;
  hint?: string;
}

export function TextField({
  label,
  name,
  hint,
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-text">
        {label}
        {rest.required && <span aria-hidden="true" className="text-text"> *</span>}
      </label>
      <input id={name} name={name} className={fieldClass} {...rest} />
      {hint && <span className="text-xs text-text-leise">{hint}</span>}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  hint,
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-text">
        {label}
        {rest.required && <span aria-hidden="true" className="text-text"> *</span>}
      </label>
      <textarea id={name} name={name} rows={5} className={fieldClass} {...rest} />
      {hint && <span className="text-xs text-text-leise">{hint}</span>}
    </div>
  );
}

export function Honeypot() {
  return (
    <div className="hidden" aria-hidden="true">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
