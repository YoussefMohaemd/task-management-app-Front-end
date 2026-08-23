import { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';
import { EyeIcon, EyeSlashIcon } from './icons';

const FIELD_BASE =
  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-heading placeholder:text-ink-faint shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-ink-faint dark:bg-night-800 dark:text-ink dark:placeholder:text-ink-faint dark:disabled:bg-night-700';

const stateClasses = (hasError) =>
  hasError
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/20 dark:border-danger-500/50'
    : 'border-line hover:border-line-strong focus:border-accent-600 focus:ring-accent-500/25 dark:border-line-dark dark:hover:border-line-dark-strong dark:focus:border-accent-400';

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-danger-600 dark:text-danger-400">
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
    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-faint transition hover:bg-slate-100 hover:text-ink-body focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:hover:bg-night-700 dark:hover:text-ink-muted"
  >
    {visible ? <EyeSlashIcon className="h-[18px] w-[18px]" /> : <EyeIcon className="h-[18px] w-[18px]" />}
  </button>
);

const HintLine = ({ id, children }) => (
  <p id={id} className="mt-1.5 flex items-center gap-1 text-xs text-ink-faint">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-5M12 8h.01" />
    </svg>
    {children}
  </p>
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
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink-body dark:text-ink-muted">
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
      {hint && !error ? <HintLine id={hintId}>{hint}</HintLine> : null}
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
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-ink-body dark:text-ink-muted">
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
      {hint && !error ? <HintLine id={hintId}>{hint}</HintLine> : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
