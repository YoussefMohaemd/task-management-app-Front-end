import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { SpinnerIcon } from './icons';

const VARIANTS = {
  primary:
    'bg-accent-600 text-white shadow-sm shadow-accent-600/30 hover:bg-accent-500 hover:shadow-md hover:shadow-accent-600/35 focus-visible:ring-accent-300 active:bg-accent-700 dark:bg-accent-400 dark:text-night-900 dark:shadow-none dark:hover:bg-accent-300 dark:focus-visible:ring-accent-300 dark:active:bg-accent-500',
  secondary:
    'bg-white text-ink-body ring-1 ring-inset ring-line shadow-sm hover:bg-[#F7FAFD] hover:ring-line-strong focus-visible:ring-accent-500 dark:bg-night-750 dark:text-ink dark:ring-line-dark dark:hover:bg-night-700 dark:hover:ring-line-dark-strong',
  danger:
    'bg-danger-600 text-white shadow-sm shadow-danger-600/30 hover:bg-danger-500 hover:shadow-md hover:shadow-danger-600/35 focus-visible:ring-danger-300 active:bg-danger-700',
  ghost:
    'text-ink-muted hover:bg-slate-100 hover:text-ink-heading focus-visible:ring-accent-500 dark:text-ink-muted dark:hover:bg-night-700 dark:hover:text-ink',
  link: 'text-accent-700 underline-offset-2 hover:text-accent-600 hover:underline focus-visible:ring-accent-300 dark:text-accent-400 dark:hover:text-accent-300',
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs gap-1 rounded-lg',
  sm: 'px-3 py-1.5 text-[13px] gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-1.5',
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
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-night-900',
        VARIANTS[variant],
        SIZES[size],
        isDisabled && 'cursor-not-allowed opacity-55',
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
