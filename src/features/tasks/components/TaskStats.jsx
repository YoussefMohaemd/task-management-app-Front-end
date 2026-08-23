import { useMemo } from 'react';
import { cn } from '../../../utils/cn';
import {
  CheckCircleIcon,
  CircleDashedIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ListChecksIcon,
} from '../../../components/ui/icons';

const STAT_CARD_STYLES = {
  total: {
    icon: ListChecksIcon,
    iconWrap:
      'bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-ink-muted',
    value: 'text-ink-heading dark:text-ink',
  },
  todo: {
    icon: CircleDashedIcon,
    iconWrap:
      'bg-slate-100 text-slate-400 dark:bg-white/[0.05] dark:text-ink-faint',
    value: 'text-slate-600 dark:text-ink-muted',
  },
  inProgress: {
    icon: ClockIcon,
    iconWrap:
      'bg-accent-50 text-accent-600 ring-1 ring-inset ring-accent-100 dark:bg-accent-400/10 dark:text-accent-400 dark:ring-accent-400/20',
    value: 'text-accent-700 dark:text-accent-400',
  },
  done: {
    icon: CheckCircleIcon,
    iconWrap:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300/90',
    value: 'text-emerald-700 dark:text-emerald-300/90',
  },
  overdue: {
    icon: ExclamationTriangleIcon,
    iconWrap:
      'bg-danger-50 text-danger-600 ring-1 ring-inset ring-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/25',
    value: 'text-danger-600 dark:text-danger-400',
  },
};

export default function TaskStats({ stats }) {
  const cards = useMemo(
    () => [
      { key: 'total', label: 'Total Tasks', value: stats.total },
      { key: 'todo', label: 'To Do', value: stats.toDo },
      { key: 'inProgress', label: 'In Progress', value: stats.inProgress },
      { key: 'done', label: 'Done', value: stats.done },
      { key: 'overdue', label: 'Overdue', value: stats.overdue },
    ],
    [stats]
  );

  return (
    <section aria-label="Task statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const styles = STAT_CARD_STYLES[card.key];
        const IconComponent = styles.icon;
        return (
          <div
            key={card.key}
            className={cn(
              'group relative flex items-center justify-between gap-2 overflow-hidden rounded-xl border bg-white px-3.5 py-3 shadow-card transition-all duration-200 hover:-translate-y-px hover:shadow-card-hover dark:bg-night-750',
              card.key === 'overdue'
                ? 'border-danger-200/80 dark:border-danger-500/30 dark:bg-[#14090F]'
                : 'border-line dark:border-line-dark dark:hover:border-line-dark-strong'
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint dark:text-ink-muted">
                {card.label}
              </p>
              <p
                className={cn(
                  'mt-1 text-2xl font-bold leading-none tabular-nums tracking-tight',
                  styles.value
                )}
                data-testid={`stat-${card.key}`}
              >
                {card.value}
              </p>
            </div>
            <span
              aria-hidden="true"
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105',
                styles.iconWrap
              )}
            >
              <IconComponent className="h-4 w-4" />
            </span>
          </div>
        );
      })}
    </section>
  );
}
