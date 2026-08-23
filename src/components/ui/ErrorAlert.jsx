import { cn } from '../../utils/cn';
import { ExclamationTriangleIcon } from './icons';

export default function ErrorAlert({ title = 'Something went wrong', message, onRetry, className }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
        <div>
          <p className="text-sm font-semibold text-rose-800">{title}</p>
          {message ? <p className="mt-0.5 text-sm text-rose-700">{message}</p> : null}
        </div>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 sm:self-auto"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
