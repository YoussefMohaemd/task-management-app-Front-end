import { cn } from '../../utils/cn';
import { ExclamationTriangleIcon } from './icons';

export default function ErrorAlert({ title = 'Something went wrong', message, onRetry, className }) {
  return (
    <div
      role="alert"
      className={cn(
        'animate-fade-in flex flex-col gap-3 rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50 to-white px-4 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-rose-500/30 dark:from-rose-500/10 dark:to-slate-900',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300">
          <ExclamationTriangleIcon aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">{title}</p>
          {message ? <p className="mt-0.5 text-sm text-rose-700 dark:text-rose-300">{message}</p> : null}
        </div>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 active:translate-y-0 sm:self-auto"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
