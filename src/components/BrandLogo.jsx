import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { CheckIcon } from './ui/icons';

export default function BrandLogo({ dark = false, className }) {
  return (
    <Link
      to="/"
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300',
        className
      )}
      aria-label="TaskFlow home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/40 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <CheckIcon className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span
        className={cn(
          'text-lg font-bold tracking-tight',
          dark ? 'text-white' : 'text-slate-900 dark:text-white'
        )}
      >
        Task<span className="text-gradient">Flow</span>
      </span>
    </Link>
  );
}
