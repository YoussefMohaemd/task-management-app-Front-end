import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import Button from '../components/ui/Button';
import ThemeToggle from '../components/ui/ThemeToggle';
import { BellIcon, LogoutIcon, SearchIcon, SettingsIcon } from '../components/ui/icons';
import { useToast } from '../context/ToastContext';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

const NAV_ICON_BUTTON =
  'relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors duration-150 hover:bg-slate-100 hover:text-ink-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-ink-muted dark:hover:bg-white/[0.06] dark:hover:text-ink';

function NavIconButton({ label, onClick, children, indicator = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={NAV_ICON_BUTTON}
    >
      {children}
      {indicator ? (
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:bg-danger-400 dark:ring-night-850"
        />
      ) : null}
    </button>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full p-0.5 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 sm:pr-2 dark:hover:bg-white/[0.06]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-sky-600 text-[11px] font-bold text-white">
          {getInitials(user?.name)}
        </span>
        <span className="hidden max-w-[9rem] truncate text-[13px] font-semibold text-ink-body sm:block dark:text-ink">
          {user?.name}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`hidden h-3.5 w-3.5 text-ink-faint transition-transform sm:block ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Account options"
          className="animate-scale-in absolute right-0 z-40 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-line bg-white py-1 shadow-panel-light ring-1 ring-ink-heading/5 dark:border-line-dark dark:bg-night-750 dark:shadow-panel dark:ring-0"
        >
          <div className="border-b border-line px-4 py-3 dark:border-line-dark">
            <p className="truncate text-sm font-semibold text-ink-heading dark:text-ink">{user?.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink-muted">{user?.email}</p>
          </div>
          <div className="px-2 py-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                toast.info('Signed out', 'See you soon.');
              }}
              className="w-full justify-start font-medium"
            >
              <LogoutIcon className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const toast = useToast();

  const focusTaskSearch = () => {
    const input = document.getElementById('task-search');
    if (input) {
      input.focus();
      input.select();
    } else {
      toast.info('Search unavailable', 'Open the tasks page to search.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md transition-colors duration-200 dark:border-line-dark dark:bg-night-850/95">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <BrandLogo />

          <nav aria-label="Primary" className="hidden md:block">
            <ul role="list" className="flex items-center gap-1">
              <li>
                <span
                  aria-current="page"
                  className="inline-flex items-center rounded-lg bg-accent-50 px-3 py-1.5 text-[13px] font-semibold text-accent-700 ring-1 ring-inset ring-accent-100 dark:bg-accent-400/10 dark:text-accent-400 dark:ring-accent-400/20"
                >
                  Tasks
                </span>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <NavIconButton label="Search tasks ( / )" onClick={focusTaskSearch}>
              <SearchIcon className="h-4 w-4" />
            </NavIconButton>
            <NavIconButton
              label="Notifications"
              indicator
              onClick={() => toast.info('Notifications', 'You are all caught up.')}
            >
              <BellIcon className="h-4 w-4" />
            </NavIconButton>
            <NavIconButton
              label="Settings"
              onClick={() => toast.info('Settings', 'Workspace settings are coming soon.')}
            >
              <SettingsIcon className="h-4 w-4" />
            </NavIconButton>
            <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-line sm:block dark:bg-line-dark" />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-5 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-line transition-colors duration-200 dark:border-line-dark">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-1.5 px-4 py-4 text-[11px] text-ink-faint sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} TaskFlow Pro · Task Management</p>
          <p className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </p>
        </div>
      </footer>
    </div>
  );
}
