import Button from '../../../components/ui/Button';
import { PlusIcon, SearchIcon } from '../../../components/ui/icons';
import Select from '../../../components/ui/Select';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../../types/task';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  ...TASK_STATUSES.map((status) => ({ value: status, label: status })),
];

const PRIORITY_FILTER_OPTIONS = [
  { value: 'All', label: 'All priorities' },
  ...TASK_PRIORITIES.map((priority) => ({ value: priority, label: priority })),
];

export default function TaskToolbar({
  filters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCreateClick,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <label htmlFor="task-search" className="sr-only">
          Search tasks by title
        </label>
        <input
          id="task-search"
          type="search"
          placeholder="Search by title…"
          value={filters.search}
          onChange={(event) => onSearchChange(event.target.value)}
          autoComplete="off"
          className="block h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:w-auto">
        <Select
          id="filter-status"
          aria-label="Filter tasks by status"
          options={STATUS_FILTER_OPTIONS}
          value={filters.status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="sm:w-40"
        />
        <Select
          id="filter-priority"
          aria-label="Filter tasks by priority"
          options={PRIORITY_FILTER_OPTIONS}
          value={filters.priority}
          onChange={(event) => onPriorityChange(event.target.value)}
          className="sm:w-44"
        />
      </div>

      <Button
        onClick={onCreateClick}
        size="md"
        className="h-11 w-full shrink-0 sm:w-auto"
      >
        <PlusIcon className="h-4 w-4" />
        New task
      </Button>
    </div>
  );
}
