import { cn } from '../../utils/cn';

const SELECT_BASE =
  'block w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-8 text-[13px] font-medium text-ink-body shadow-sm transition-colors duration-150 hover:border-line-strong focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-ink-faint dark:bg-night-750 dark:text-ink dark:disabled:bg-night-800 dark:[&>option]:bg-night-750';

const stateClasses = (hasError) =>
  hasError
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500/20 dark:border-danger-500/50'
    : 'border-line focus:border-accent-600 focus:ring-accent-500/25 dark:border-line-dark dark:focus:border-accent-400';

function ChevronIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Select({ label, id, error, options, className, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink-body dark:text-ink-muted">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={cn(SELECT_BASE, stateClasses(error))}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-danger-600 dark:text-danger-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
