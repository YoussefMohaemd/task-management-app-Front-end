import { cn } from '../../utils/cn';

const FIELD_BASE =
  'block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

const stateClasses = (hasError) =>
  hasError
    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-200'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200';

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
      {message}
    </p>
  );
}

export default function Input({
  label,
  id,
  error,
  hint,
  className,
  type = 'text',
  ...props
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        className={cn(FIELD_BASE, stateClasses(error))}
        {...props}
      />
      {hint && !error ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
