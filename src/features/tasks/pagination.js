export const PAGE_SIZE_OPTIONS = [5, 10, 20];

export const PAGE_SIZE_SELECT_OPTIONS = [
  { value: '5', label: '5 / page' },
  { value: '10', label: '10 / page' },
  { value: '20', label: '20 / page' },
];

export const DEFAULT_PAGE_SIZE = 10;

const ELLIPSIS = '\u2026';

export const normalizePageSize = (value) =>
  (PAGE_SIZE_OPTIONS.includes(Number(value)) ? Number(value) : DEFAULT_PAGE_SIZE);

export const buildPaginationRange = (currentPage, totalPages) => {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_unused, index) => index + 1);
  }

  const page = Math.min(Math.max(currentPage, 1), totalPages);

  if (page <= 4) {
    return [1, 2, 3, 4, 5, ELLIPSIS, totalPages];
  }
  if (page >= totalPages - 3) {
    return [1, ELLIPSIS, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, ELLIPSIS, page - 1, page, page + 1, ELLIPSIS, totalPages];
};

export const buildShowingRange = ({ page = 1, limit = DEFAULT_PAGE_SIZE, total = 0 }) => {
  if (total <= 0) return { start: 0, end: 0 };
  const start = (page - 1) * limit + 1;
  return { start, end: Math.min(page * limit, total) };
};
