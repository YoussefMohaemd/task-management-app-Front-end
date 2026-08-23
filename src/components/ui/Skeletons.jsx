import { cn } from '../../utils/cn';

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-line px-4 py-3 last:border-b-0 dark:border-line-dark">
      {/* title + description */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="h-3 w-2/5 rounded bg-slate-200 dark:bg-night-600" />
        <div className="h-2.5 w-3/5 rounded bg-slate-100 dark:bg-night-700" />
      </div>
      {/* status */}
      <div className="hidden h-[18px] w-[86px] shrink-0 rounded-md bg-slate-100 md:block dark:bg-night-700" />
      {/* priority */}
      <div className="hidden h-[18px] w-[70px] shrink-0 rounded-md bg-slate-100 md:block dark:bg-night-700" />
      {/* due date */}
      <div className="hidden h-3 w-[92px] shrink-0 rounded bg-slate-100 sm:block dark:bg-night-700" />
      {/* actions */}
      <div className="flex shrink-0 gap-1.5">
        <div className="h-7 w-7 rounded-md bg-slate-100 dark:bg-night-700" />
        <div className="h-7 w-7 rounded-md bg-slate-100 dark:bg-night-700" />
      </div>
    </div>
  );
}

export function TaskTableSkeleton({ count = 8, className }) {
  return (
    <div
      role="status"
      aria-label="Loading tasks"
      aria-busy="true"
      className={cn(
        'animate-pulse overflow-hidden rounded-xl border border-line bg-white shadow-card dark:border-line-dark dark:bg-night-800',
        className
      )}
    >
      {Array.from({ length: count }).map((_unused, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  );
}

export default function TaskCardSkeleton({ className }) {
  return <TaskTableSkeleton count={6} className={className} />;
}
