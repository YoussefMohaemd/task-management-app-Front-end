import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { SpinnerIcon } from './icons';

const VARIANTS = {
  primary:
    'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-600/30 hover:from-indigo-400 hover:to-indigo-500 hover:shadow-md hover:shadow-indigo-600/35 hover:-translate-y-px focus-visible:ring-indigo-300 active:translate-y-0 active:from-indigo-600 active:to-indigo-700',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 shadow-sm hover:bg-slate-50 hover:ring-slate-400/70 hover:-translate-y-px focus-visible:ring-slate-400 active:translate-y-0 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:ring-slate-600',
  danger:
    'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-600/30 hover:from-rose-400 hover:to-rose-500 hover:-translate-y-px focus-visible:ring-rose-300 active:translate-y-0 active:from-rose-600 active:to-rose-700',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
  link: 'text-indigo-600 underline-offset-2 hover:text-indigo-500 hover:underline focus-visible:ring-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  icon: 'p-2',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, ...props },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={props.type || 'button'}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        VARIANTS[variant],
        SIZES[size],
        isDisabled && 'cursor-not-allowed opacity-60',
        className
      )}
      {...props}
    >
      {loading ? <SpinnerIcon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
});

export default Button;
