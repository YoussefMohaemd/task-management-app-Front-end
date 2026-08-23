import { cn } from '../../../utils/cn';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { CalendarIcon, PencilIcon, TrashIcon } from '../../../components/ui/icons';
import { getDueDateMeta } from '../../../utils/formatDate';

const DUE_TONE_STYLES = {
  neutral: 'text-ink-muted',
  warning: 'text-amber-600 dark:text-amber-400/90',
  danger: 'font-semibold text-danger-600 dark:text-danger-400',
};

const COLUMNS = [
  { key: 'task', label: 'Task', className: 'md:w-auto' },
  { key: 'status', label: 'Status', className: 'md:w-[118px]' },
  { key: 'priority', label: 'Priority', className: 'md:w-[100px]' },
  { key: 'dueDate', label: 'Due Date', className: 'md:w-[124px]' },
  { key: 'actions', label: 'Actions', className: 'md:w-[88px]' },
];

const HEADER_CELL =
  'px-4 pb-2 pt-3 text-left text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-faint dark:text-ink-muted';

const ICON_BUTTON =
  'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-night-800';

function TaskRowActions({ task, busy, onEdit, onDelete }) {
  return (
    <div className="ml-auto flex items-center gap-1 transition-opacity duration-150 md:ml-0 md:justify-end md:opacity-45 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
      <button
        type="button"
        onClick={() => onEdit(task)}
        disabled={busy}
        aria-label={`Edit task: ${task.title}`}
        title="Edit task"
        className={cn(
          ICON_BUTTON,
          'text-ink-muted hover:bg-accent-50 hover:text-accent-700 focus-visible:ring-accent-500 dark:hover:bg-accent-400/10 dark:hover:text-accent-400'
        )}
      >
        <PencilIcon className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        disabled={busy}
        aria-label={`Delete task: ${task.title}`}
        title="Delete task"
        className={cn(
          ICON_BUTTON,
          'text-ink-muted hover:bg-danger-50 hover:text-danger-600 focus-visible:ring-danger-500 dark:hover:bg-danger-500/10 dark:hover:text-danger-400'
        )}
      >
        <TrashIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function DueDateCell({ dueMeta }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap text-xs tabular-nums',
        DUE_TONE_STYLES[dueMeta.tone]
      )}
    >
      <CalendarIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-70" />
      <span className="truncate">{dueMeta.label}</span>
    </span>
  );
}

/* Hairline under every data cell; omitted on the final row. */
const CELL_DIVIDER = 'md:border-b md:border-line dark:md:border-line-dark';

/* Shared cell chrome: stacked flex item on mobile, real table cell from md up. */
const CELL_BASE = 'flex items-center align-middle md:table-cell md:px-2.5 md:py-3';

export default function TaskList({ tasks, mutatingId, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card dark:border-line-dark dark:bg-night-800">
      <table className="w-full border-collapse text-left align-middle">
        {/* Column headings — visually hidden on mobile, restored from md up */}
        <thead className="sr-only md:table-header-group md:not-sr-only">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key} scope="col" className={cn(HEADER_CELL, column.className)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tasks.map((task, index) => {
            const dueMeta = getDueDateMeta(task);
            const busy = mutatingId === task._id;
            const isOverdue = dueMeta.tone === 'danger';
            const isLast = index === tasks.length - 1;

            return (
              <tr
                key={task._id}
                aria-busy={busy || undefined}
                style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
                className={cn(
                  'animate-fade-up group transition-colors duration-150',
                  /* Mobile: compact card */
                  'flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-lg px-3 py-2.5',
                  /* Desktop: real table row */
                  'md:table-row md:gap-x-0 md:gap-y-0 md:rounded-none md:px-0 md:py-0',
                  isOverdue
                    ? 'border-l-[3px] border-l-danger-500 bg-danger-50/60 hover:bg-danger-100/60 dark:border-l-danger-500 dark:bg-danger-500/[0.07] dark:hover:bg-danger-500/[0.12] md:border-l-0 md:bg-danger-50/50 md:hover:bg-danger-100/70 md:dark:bg-danger-500/[0.08] md:dark:hover:bg-danger-500/[0.13]'
                    : 'bg-slate-50/70 hover:bg-accent-50/50 dark:bg-night-750/50 dark:hover:bg-night-700/90 md:bg-transparent md:dark:hover:bg-night-700/60',
                  busy && 'pointer-events-none opacity-60'
                )}
              >
                {/* Task — title + description preview */}
                <td
                  className={cn(
                    'relative min-w-0 basis-full pr-2 md:table-cell md:w-auto md:py-3 md:pl-4 md:pr-4',
                    !isLast && CELL_DIVIDER,
                    isOverdue && 'md:shadow-[inset_2px_0_0_#FF5B5B]'
                  )}
                >
                  <h3
                    className={cn(
                      'truncate text-[13.5px] font-semibold leading-snug',
                      task.status === 'Done' ? 'text-ink-muted' : 'text-ink-heading'
                    )}
                  >
                    {task.title}
                  </h3>
                  {task.description ? (
                    <p className="mt-0.5 truncate text-xs leading-relaxed text-ink-muted dark:text-ink-muted">
                      {task.description}
                    </p>
                  ) : null}
                </td>

                {/* Status */}
                <td className={cn(CELL_BASE, !isLast && CELL_DIVIDER)}>
                  <StatusBadge task={task} />
                </td>

                {/* Priority */}
                <td className={cn(CELL_BASE, !isLast && CELL_DIVIDER)}>
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Due date */}
                <td className={cn(CELL_BASE, !isLast && CELL_DIVIDER)}>
                  <DueDateCell dueMeta={dueMeta} />
                </td>

                {/* Actions */}
                <td className={cn(CELL_BASE, !isLast && CELL_DIVIDER)}>
                  <TaskRowActions task={task} busy={busy} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
