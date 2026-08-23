import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import BrandLogo from '../components/BrandLogo';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <BrandLogo />
      <p className="mt-12 text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        404 — Page not found
      </p>
      <h1 className="mt-3 max-w-md text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
        The page you are looking for does not exist.
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        It may have been moved, or the address might be incorrect.
      </p>
      <Link to="/tasks" className="mt-8">
        <Button>Back to my tasks</Button>
      </Link>
    </div>
  );
}

