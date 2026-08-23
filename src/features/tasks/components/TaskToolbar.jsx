import Button from '../../../components/ui/Button';
import { SearchIcon } from '../../../components/ui/icons';
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
      title="Show only overdue tasks"
      className={cn(
        'inline-flex h-[34px] items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-[13px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-400',
        active
          ? 'border-danger-600 bg-danger-600 text-white shadow-sm shadow-danger-600/30 hover:bg-danger-500'
          : 'border-line bg-white text-danger-600 hover:border-danger-300 hover:bg-danger-50 dark:border-line-dark dark:bg-night-750 dark:text-danger-400 dark:hover:border-danger-500/40 dark:hover:bg-danger-500/10'
      )}
    >
      <span
        aria-hidden="true"
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', active ? 'bg-white' : 'bg-danger-500')}
      />
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
  activeFilters = 0,
  onClearFilters,
  updating = false,
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-white p-2.5 shadow-card transition-opacity duration-200 dark:border-line-dark dark:bg-night-750',
        updating && 'pointer-events-none opacity-60'
      )}
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
        {/* Search */}
        <div className="relative flex-1 lg:min-w-[200px] lg:max-w-xs">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          />
          <label htmlFor="task-search" className="sr-only">
            Search tasks by title
          </label>
          <input
            id="task-search"
            type="search"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            autoComplete="off"
            className="block h-[34px] w-full rounded-lg border border-line bg-slate-50/60 pl-9 pr-9 text-[13px] text-ink-heading placeholder:text-ink-faint transition-colors duration-150 hover:border-line-strong focus:border-accent-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/25 [&::-webkit-search-cancel-button]:hidden dark:border-line-dark dark:bg-night-800 dark:text-ink dark:focus:border-accent-400 dark:focus:bg-night-800"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-faint sm:block dark:border-line-dark dark:bg-night-700"
          >
            /
          </kbd>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <OverdueChip active={filters.overdueOnly} onClick={onToggleOverdue} />
          <Select
            id="sort-tasks"
            aria-label="Sort tasks"
            options={SORT_PRESETS}
            value={filters.sortPreset}
            onChange={(event) => onSortChange(event.target.value)}
            className="[&>div>select]:h-[34px] [&>div>select]:py-0 sm:w-36"
          />
          <Select
            id="filter-priority"
            aria-label="Filter tasks by priority"
            options={PRIORITY_FILTER_OPTIONS}
            value={filters.priority}
            onChange={(event) => onPriorityChange(event.target.value)}
            className="[&>div>select]:h-[34px] [&>div>select]:py-0 sm:w-32"
          />
          <Select
            id="filter-status"
            aria-label="Filter tasks by status"
            options={STATUS_FILTER_OPTIONS}
            value={filters.status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="col-span-2 [&>div>select]:h-[34px] [&>div>select]:py-0 sm:col-span-1 sm:w-32"
          />
        </div>

        {/* Reset */}
        <div className="flex lg:ml-auto">
          {activeFilters > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              aria-label="Clear all filters"
              title="Clear all filters"
              className="h-[34px] px-2.5 text-ink-muted hover:text-accent-700 dark:hover:text-accent-400"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path d="M4 5h16M7 12h6M10 19h2" />
                <path d="m16 16 4 4M20 16l-4 4" />
              </svg>
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
