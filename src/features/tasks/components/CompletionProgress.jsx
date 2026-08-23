import { useMemo } from 'react';

export default function CompletionProgress({ doneCount = 0, totalCount = 0 }) {
  const percent = useMemo(() => {
    if (!totalCount) return 0;
    return Math.round((doneCount / totalCount) * 100);
  }, [doneCount, totalCount]);

  const message =
    totalCount === 0
      ? 'No tasks yet'
      : percent === 100
        ? 'All tasks completed'
        : `${doneCount} of ${totalCount} ${totalCount === 1 ? 'task' : 'tasks'} completed`;

  return (
    <div aria-label="Task completion progress" className="rounded-xl border border-slate-100 bg-white/70 px-4 py-2.5 shadow-card dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Completion</p>
        <span className="sr-only">{`${percent} percent complete`}</span>
        <div className="flex flex-1 items-center gap-3">
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={message}
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-[width] duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400" aria-hidden="true">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
}
