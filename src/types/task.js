export const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUS_BADGE_STYLES = {
  'To Do':
    'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/[0.06] dark:text-ink-muted dark:ring-line-dark',
  'In Progress':
    'bg-accent-50 text-accent-700 ring-accent-200 dark:bg-accent-400/10 dark:text-accent-400 dark:ring-accent-400/25',
  Done:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/80 dark:bg-emerald-400/10 dark:text-emerald-300/90 dark:ring-emerald-400/20',
};

export const OVERDUE_BADGE_STYLES =
  'bg-danger-50 text-danger-600 ring-danger-200 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/30';

export const PRIORITY_BADGE_STYLES = {
  Low: 'bg-slate-100 text-slate-500 ring-slate-200 dark:bg-white/[0.04] dark:text-ink-faint dark:ring-line-dark',
  Medium:
    'bg-amber-50 text-amber-700 ring-amber-200/80 dark:bg-amber-400/10 dark:text-amber-300/90 dark:ring-amber-400/20',
  High:
    'bg-danger-50 text-danger-600 ring-danger-200 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/25',
};
