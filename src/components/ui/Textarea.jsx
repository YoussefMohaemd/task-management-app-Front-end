import { cn } from '../../utils/cn';
import { FieldError } from './Input';

const TEXTAREA_BASE =
  'block w-full resize-y rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-400/70 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800/60';

const stateClasses = (hasError) =>
  hasError
    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-500/50'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15 dark:border-slate-700 dark:focus:border-indigo-400';

export default function Textarea({ label, id, error, className, rows = 3, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
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
