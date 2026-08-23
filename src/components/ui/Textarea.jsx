import { cn } from '../../utils/cn';
import { FieldError } from './Input';

const TEXTAREA_BASE =
  'block w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-ink-heading placeholder:text-ink-faint shadow-sm transition-colors duration-150 hover:border-line-strong focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-ink-faint dark:bg-night-800 dark:text-ink dark:placeholder:text-ink-faint dark:disabled:bg-night-700';

const stateClasses = (hasError) =>
  hasError
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/20 dark:border-danger-500/50'
    : 'border-line hover:border-line-strong focus:border-accent-600 focus:ring-accent-500/25 dark:border-line-dark dark:hover:border-line-dark-strong dark:focus:border-accent-400';

export default function Textarea({ label, id, error, className, rows = 3, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink-body dark:text-ink-muted">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        className={cn(TEXTAREA_BASE, stateClasses(error))}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
