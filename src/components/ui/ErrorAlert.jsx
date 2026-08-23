import { cn } from '../../utils/cn';
import { ExclamationTriangleIcon } from './icons';

export default function ErrorAlert({ title = 'Something went wrong', message, onRetry, className }) {
  return (
    <div
      role="alert"
      className={cn(
        'animate-fade-in flex flex-col gap-3 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-danger-500/25 dark:bg-danger-500/10',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger-100 text-danger-600 dark:bg-danger-500/15 dark:text-danger-400">
          <ExclamationTriangleIcon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-danger-700 dark:text-danger-300">{title}</p>
          {message ? <p className="mt-0.5 text-[13px] text-danger-600 dark:text-danger-400">{message}</p> : null}
        </div>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-lg bg-danger-600 px-3 py-1.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-danger-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-300 focus-visible:ring-offset-2 sm:self-auto"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
