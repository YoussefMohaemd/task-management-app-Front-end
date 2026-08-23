import Button from '../../../components/ui/Button';
import { PlusIcon, SearchIcon } from '../../../components/ui/icons';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../../types/task';
import { SORT_PRESETS } from '../sortPresets';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All statuses' },
  ...TASK_STATUSES.map((status) => ({ value: status, label: status })),
];

const PRIORITY_FILTER_OPTIONS = [
  { value: 'All', label: 'All priorities' },
  ...TASK_PRIORITIES.map((priority) => ({ value: priority, label: priority })),
];

function OverdueChip({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-[42px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-3 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300',
        active
          ? 'border-rose-500 bg-rose-500 text-white shadow-sm shadow-rose-600/30 hover:bg-rose-600'
          : 'border-slate-300 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-500/50 dark:hover:text-rose-300'
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', active ? 'bg-white' : 'bg-rose-500')} aria-hidden="true" />
      Overdue
    </button>
  );
}

export default function TaskToolbar({
  filters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onToggleOverdue,
  onCreateClick,
  activeFilters = 0,
  onClearFilters,
  updating = false,
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/70 bg-white/95 p-3 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-900/95',
        updating && 'opacity-70 transition-opacity duration-200'
      )}
    >
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
            placeholder="Search by title…  ( / )"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            autoComplete="off"
            className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 [&::-webkit-search-cancel-button]:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400"
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
            className="sm:w-40"
          />
          <Select
            id="sort-tasks"
            aria-label="Sort tasks"
            options={SORT_PRESETS}
            value={filters.sortPreset}
            onChange={(event) => onSortChange(event.target.value)}
            className="col-span-2 sm:col-span-1 sm:w-48"
          />
          <OverdueChip active={filters.overdueOnly} onClick={onToggleOverdue} />
        </div>

        <div className="flex gap-3">
          {activeFilters > 0 ? (
            <Button variant="secondary" onClick={onClearFilters} size="md" className="h-11 flex-1 sm:flex-initial">
              Clear
            </Button>
          ) : null}
          <Button onClick={onCreateClick} size="md" className="h-11 flex-1 shrink-0 sm:flex-auto sm:px-4">
            <PlusIcon className="h-4 w-4" />
            New task
          </Button>
        </div>
      </div>
    </div>
  );
}
