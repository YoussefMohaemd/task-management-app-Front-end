import { useMemo } from 'react';
import { cn } from '../../../utils/cn';

const STAT_CARD_STYLES = {
  total: {
    value: 'text-slate-900 dark:text-white',
    accent: 'bg-gradient-to-br from-slate-400 to-slate-500',
  },
  todo: {
    value: 'text-slate-700 dark:text-slate-300',
    accent: 'bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700',
  },
  inProgress: {
    value: 'text-blue-700 dark:text-blue-300',
    accent: 'bg-gradient-to-br from-blue-400 to-blue-500',
  },
  done: {
    value: 'text-emerald-700 dark:text-emerald-300',
    accent: 'bg-gradient-to-br from-emerald-400 to-emerald-500',
  },
  overdue: {
    value: 'text-rose-700 dark:text-rose-300',
    accent: 'bg-gradient-to-br from-rose-400 to-rose-500',
  },
};

export default function TaskStats({ stats }) {
  const cards = useMemo(
    () => [
      { key: 'total', label: 'Total tasks', value: stats.total },
      { key: 'todo', label: 'To Do', value: stats.toDo },
      { key: 'inProgress', label: 'In Progress', value: stats.inProgress },
      { key: 'done', label: 'Done', value: stats.done },
      { key: 'overdue', label: 'Overdue', value: stats.overdue },
    ],
    [stats]
  );

  return (
    <section aria-label="Task statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const styles = STAT_CARD_STYLES[card.key];
        return (
          <div
            key={card.key}
            className="relative overflow-hidden rounded-xl border border-slate-100 bg-white px-3.5 py-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
          >
            <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-[3px]', styles.accent)} />
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {card.label}
            </p>
            <p
              className={cn('mt-0.5 text-xl font-bold tabular-nums tracking-tight', styles.value)}
              data-testid={`stat-${card.key}`}
            >
              {card.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
