import { cn } from '../../../utils/cn';
import PriorityBadge from './PriorityBadge';
import { CalendarIcon, PencilIcon, TrashIcon } from '../../../components/ui/icons';
import { getDueDateMeta } from '../../../utils/formatDate';
import { TASK_STATUSES, STATUS_BADGE_STYLES } from '../../../types/task';

const DUE_TONE_STYLES = {
  neutral: 'bg-slate-100 text-slate-600',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700 font-semibold',
};

export default function TaskCard({ task, busy = false, onEdit, onDelete, onStatusChange }) {
  const dueMeta = getDueDateMeta(task);

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;
    if (nextStatus !== task.status) {
      onStatusChange(task._id, nextStatus);
    }
  };

  return (
    <article
      aria-busy={busy || undefined}
      className={cn(
        'flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition hover:border-slate-200 hover:shadow-lg',
        task.status === 'Done' && 'bg-slate-50/60',
        busy && 'pointer-events-none opacity-70'
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`status-${task._id}`}>
          Change status of {task.title}
        </label>
        <select
          id={`status-${task._id}`}
          value={task.status}
          onChange={handleStatusChange}
          disabled={busy}
          className={cn(
            'cursor-pointer appearance-none rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
            STATUS_BADGE_STYLES[task.status]
          )}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <PriorityBadge priority={task.priority} />
      </div>

      <h3
        className={cn(
          'mt-3 text-base font-semibold leading-snug text-slate-900',
          task.status === 'Done' && 'text-slate-500 line-through decoration-slate-400'
        )}
      >
        {task.title}
      </h3>

      {task.description ? (
        <p className="mt-1.5 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-slate-500">
          {task.description}
        </p>
      ) : (
        <p className="mt-1.5 text-sm italic text-slate-400">No description provided.</p>
      )}

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
              DUE_TONE_STYLES[dueMeta.tone]
            )}
          >
            <CalendarIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            {dueMeta.label}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`Edit task: ${task.title}`}
              title="Edit task"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              aria-label={`Delete task: ${task.title}`}
              title="Delete task"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
