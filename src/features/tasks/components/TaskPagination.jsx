import { ChevronLeftIcon, ChevronRightIcon } from '../../../components/ui/icons';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import {
  PAGE_SIZE_SELECT_OPTIONS,
  buildPaginationRange,
  buildShowingRange,
} from '../pagination';

const pageButtonBase =
  'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-1.5 text-sm font-medium tabular-nums transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-40';

export default function TaskPagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSize,
  disabled = false,
}) {
  const { page, total, totalPages } = pagination;

  if (total === 0) return null;

  const { start, end } = buildShowingRange({ page, limit: pagination.limit, total });
  const range = buildPaginationRange(page, totalPages);
  const isSinglePage = totalPages <= 1;

  return (
    <nav
      aria-label="Task pagination"
      className="flex flex-col gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <p
          data-testid="showing-range"
          aria-live="polite"
          className="text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400"
        >
          Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{start}</span>
          &ndash;
          <span className="font-semibold text-slate-700 dark:text-slate-200">{end}</span> of{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">{total}</span>{' '}
          {total === 1 ? 'task' : 'tasks'}
        </p>

        {onPageSizeChange ? (
          <Select
            id="page-size"
            aria-label="Tasks per page"
            options={PAGE_SIZE_SELECT_OPTIONS}
            value={String(pageSize ?? pagination.limit)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            disabled={disabled}
            className="w-[6.5rem] [&_select]:h-8 [&_select]:py-1"
          />
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Previous page"
          className={cn(
            pageButtonBase,
            'mr-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
          )}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {range.map((item, index) =>
            typeof item === 'number' ? (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => (item === page ? undefined : onPageChange(item))}
                disabled={disabled}
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={cn(
                  pageButtonBase,
                  item === page
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                )}
              >
                {item}
              </button>
            ) : (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="px-1 text-sm font-medium text-slate-400 dark:text-slate-500"
              >
                {item}
              </span>
            )
          )}
        </div>

        <p
          aria-live="polite"
          aria-label={`Page ${page} of ${totalPages}`}
          className="text-sm font-semibold tabular-nums text-slate-600 sm:hidden dark:text-slate-300"
        >
          {page} / {totalPages}
        </p>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Next page"
          className={cn(
            pageButtonBase,
            'ml-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
          )}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>

      <span className="sr-only">
        {isSinglePage ? 'Single page of results' : `Page ${page} of ${totalPages}`}
      </span>
    </nav>
  );
}
