import { useTheme } from '../../context/ThemeContext';
import { MoonIcon, SunIcon } from './icons';

export default function ThemeToggle({ className = '' }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors duration-150 hover:bg-slate-100 hover:text-ink-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-ink-muted dark:hover:bg-night-700 dark:hover:text-ink ${className}`}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
