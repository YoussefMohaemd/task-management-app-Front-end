import { ChevronLeftIcon, ChevronRightIcon } from '../../../components/ui/icons';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import {
  PAGE_SIZE_SELECT_OPTIONS,
  buildPaginationRange,
  buildShowingRange,
} from '../pagination';

const pageButtonBase =
  'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full px-1.5 text-[13px] font-medium tabular-nums transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-not-allowed disabled:opacity-40';

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
      className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
    >
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <p
          data-testid="showing-range"
          aria-live="polite"
          className="text-xs font-medium tabular-nums text-ink-muted"
        >
          Showing <span className="font-semibold text-ink-body dark:text-ink">{start}</span>
          &ndash;
          <span className="font-semibold text-ink-body dark:text-ink">{end}</span> of{' '}
          <span className="font-semibold text-ink-body dark:text-ink">{total}</span>{' '}
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
            className="w-[6.25rem] shrink-0 [&>div>select]:h-8 [&>div>select]:py-0 [&>div>select]:text-xs"
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
            'mr-1 text-ink-muted hover:bg-slate-100 hover:text-ink-heading dark:text-ink-muted dark:hover:bg-night-700 dark:hover:text-ink'
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
                    ? 'bg-accent-600 text-white shadow-sm shadow-accent-600/30 dark:bg-accent-400 dark:text-night-900 dark:shadow-none'
                    : 'text-ink-muted hover:bg-slate-100 hover:text-ink-heading dark:text-ink-muted dark:hover:bg-night-700 dark:hover:text-ink'
                )}
              >
                {item}
              </button>
            ) : (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className="px-1 text-sm font-medium text-ink-faint"
              >
                {item}
              </span>
            )
          )}
        </div>

        <p
          aria-live="polite"
          aria-label={`Page ${page} of ${totalPages}`}
          className="text-[13px] font-semibold tabular-nums text-ink-body sm:hidden dark:text-ink"
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
            'ml-1 text-ink-muted hover:bg-slate-100 hover:text-ink-heading dark:text-ink-muted dark:hover:bg-night-700 dark:hover:text-ink'
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
