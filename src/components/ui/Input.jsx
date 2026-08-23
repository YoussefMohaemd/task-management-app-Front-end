import { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { EyeIcon, EyeSlashIcon } from './icons';

const FIELD_BASE =
  'block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-400/70 focus:hover:border-transparent focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800/60';

const stateClasses = (hasError) =>
  hasError
    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-500/50'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15 dark:border-slate-700 dark:focus:border-indigo-400';

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
      {message}
    </p>
  );
}

export const PasswordVisibilityButton = ({ visible, onToggle, targetId }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={visible ? 'Hide password' : 'Show password'}
    aria-pressed={visible}
    aria-controls={targetId}
    tabIndex={0}
    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:hover:bg-slate-800 dark:hover:text-slate-300"
  >
    {visible ? <EyeSlashIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
  </button>
);

const Input = forwardRef(function Input(
  { label, id, error, hint, className, type = 'text', ...props },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId ?? hintId}
        className={cn(FIELD_BASE, stateClasses(error))}
        {...props}
      />
      {hint && !error ? (
        <p
          id={hintId}
          className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-5M12 8h.01" />
          </svg>
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
});

export default Input;

export function PasswordInput({ label, id, error, hint, className, ...props }) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId ?? hintId}
          className={cn(FIELD_BASE, stateClasses(error), 'pr-11')}
          {...props}
        />
        <PasswordVisibilityButton
          visible={visible}
          onToggle={() => setVisible((current) => !current)}
          targetId={inputId}
        />
      </div>
      {hint && !error ? (
        <p
          id={hintId}
          className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-5M12 8h.01" />
          </svg>
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
