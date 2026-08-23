import { useEffect, useMemo, useState } from 'react';

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

  /* Animate the fill from 0 on first paint for a subtle load-in effect. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      aria-label="Overall completion"
      className="rounded-xl border border-line bg-white px-4 py-3 shadow-card dark:border-line-dark dark:bg-night-750"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Overall Completion
        </p>
        <div className="flex flex-1 items-center gap-3 sm:gap-4">
          <div
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={message}
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400 transition-[width] duration-700 ease-out dark:from-accent-500 dark:to-accent-DEFAULT"
              style={{ width: `${mounted ? percent : 0}%` }}
            />
          </div>
          <span
            className="w-11 shrink-0 text-right text-sm font-bold tabular-nums text-accent-700 dark:text-accent-400"
            aria-hidden="true"
          >
            {percent}%
          </span>
        </div>
      </div>
    </section>
  );
}
