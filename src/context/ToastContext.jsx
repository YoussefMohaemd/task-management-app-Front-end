import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import { CheckCircleIcon, ExclamationTriangleIcon, InfoIcon, XMarkIcon } from '../components/ui/icons';

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: {
    container:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-[#0F231C] dark:text-emerald-200',
    icon: 'text-emerald-500 dark:text-emerald-400',
  },
  error: {
    container:
      'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-[#2A1315] dark:text-rose-200',
    icon: 'text-rose-500 dark:text-rose-400',
  },
  info: {
    container:
      'border-line bg-white text-ink-body dark:border-line-dark dark:bg-night-750 dark:text-ink',
    icon: 'text-accent-600 dark:text-accent-400',
  },
};

const TOAST_ICONS = {
  success: CheckCircleIcon,
  error: ExclamationTriangleIcon,
  info: InfoIcon,
};

let nextToastId = 0;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    },
    []
  );

  const dismissToast = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ type = 'info', title, message, duration = 4500 }) => {
      const id = ++nextToastId;
      setToasts((current) => [...current, { id, type, title, message }]);
      const timer = setTimeout(() => dismissToast(id), duration);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismissToast]
  );

  const api = useMemo(
    () => ({
      success: (title, message) => pushToast({ type: 'success', title, message }),
      error: (title, message) => pushToast({ type: 'error', title, message }),
      info: (title, message) => pushToast({ type: 'info', title, message }),
    }),
    [pushToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-[68px] z-[70] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        {toasts.map((toast) => {
          const Icon = TOAST_ICONS[toast.type] ?? InfoIcon;
          const styles = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info;
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                'pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
                styles.container
              )}
            >
              <Icon aria-hidden="true" className={cn('mt-0.5 h-5 w-5 shrink-0', styles.icon)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message ? (
                  <p className="mt-0.5 text-sm opacity-80 break-words">{toast.message}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-md p-1 opacity-60 transition hover:bg-black/5 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:hover:bg-white/10"
              >
                <XMarkIcon aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
