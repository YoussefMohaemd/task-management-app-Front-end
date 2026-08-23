import { cn } from '../../utils/cn';

export default function TaskCardSkeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-xl border border-slate-100 bg-white p-4 shadow-card dark:border-slate-800 dark:bg-slate-900', className)}
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-4 h-4 w-3/4 rounded-md bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded-md bg-slate-100 dark:bg-slate-800" />
        <div className="h-3 w-5/6 rounded-md bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

export function TaskGridSkeleton({ count = 6 }) {
  return (
    <div
      role="status"
      aria-label="Loading tasks"
      className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </div>
  );
}
