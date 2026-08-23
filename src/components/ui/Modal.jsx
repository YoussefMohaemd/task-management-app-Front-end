import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { XMarkIcon } from './icons';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      const firstField = panelRef.current.querySelector('input, textarea, select');
      (firstField ?? panelRef.current).focus();
    }
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <div
        className="animate-fade-in absolute inset-0 bg-[#0A1220]/50 backdrop-blur-sm dark:bg-night-950/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'animate-scale-in relative w-full overflow-hidden rounded-2xl bg-white shadow-panel-light outline-none ring-1 ring-ink-heading/10 dark:bg-night-750 dark:shadow-panel dark:ring-line-dark',
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 sm:px-6 dark:border-line-dark">
          <h2 className="text-[15px] font-semibold text-ink-heading dark:text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-ink-faint transition hover:bg-slate-100 hover:text-ink-body focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:hover:bg-night-700 dark:hover:text-ink-muted"
          >
            <XMarkIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
