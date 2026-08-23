import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import { CheckIcon } from './ui/icons';

export default function BrandLogo({ dark = false, className }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2.5', className)} aria-label="TaskFlow home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
        <CheckIcon className="h-5 w-5" />
      </span>
      <span className={cn('text-lg font-bold tracking-tight', dark ? 'text-white' : 'text-slate-900')}>
        TaskFlow
      </span>
    </Link>
  );
}
