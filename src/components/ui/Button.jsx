import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { SpinnerIcon } from './icons';

const VARIANTS = {
  primary:
    'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-indigo-300 active:bg-indigo-700',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:ring-rose-300 active:bg-rose-700',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-300',
  link: 'text-indigo-600 underline-offset-2 hover:text-indigo-500 hover:underline focus-visible:ring-indigo-300',
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
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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
