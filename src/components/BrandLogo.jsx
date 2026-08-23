import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { CheckIcon } from './ui/icons';

export default function BrandLogo({ dark = false, className }) {
  return (
    <Link
      to="/"
      className={cn(
        'group inline-flex items-center gap-2 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        className
      )}
      aria-label="TaskFlow Pro home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-sky-600 text-white shadow-glow-accent transition-transform duration-200 group-hover:scale-105">
        <CheckIcon className="h-[18px] w-[18px]" strokeWidth={2.6} />
      </span>
      <span className="flex items-baseline gap-1.5">
        <span
          className={cn(
            'text-[15px] font-bold tracking-tight',
            dark ? 'text-white' : 'text-ink-heading dark:text-white'
          )}
        >
          TaskFlow
        </span>
        <span
          className={cn(
            'rounded px-1 py-px text-[10px] font-bold uppercase leading-3 tracking-wide',
            dark
              ? 'bg-accent-400/15 text-accent-300'
              : 'bg-accent-100 text-accent-700 dark:bg-accent-400/15 dark:text-accent-400'
          )}
        >
          Pro
        </span>
      </span>
    </Link>
  );
}
