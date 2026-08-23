import { cn } from '../../utils/cn';
import { FieldError } from './Input';

export default function Textarea({ label, id, error, className, rows = 3, ...props }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        className={cn(
          'block w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
        )}
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
