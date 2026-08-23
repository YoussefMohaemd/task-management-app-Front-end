import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  buildPaginationRange,
  buildShowingRange,
  normalizePageSize,
} from './pagination';

describe('normalizePageSize', () => {
  it.each([5, 10, 20])('accepts allowed size %s', (size) => {
    expect(normalizePageSize(size)).toBe(size);
    expect(normalizePageSize(String(size))).toBe(size);
  });

  it.each(['999', '-3', 'abc', '', null, undefined])('falls back to %s for invalid input', (input) => {
    const result = normalizePageSize(input);
    expect(PAGE_SIZE_OPTIONS).toContain(result);
    expect(result).toBe(DEFAULT_PAGE_SIZE);
  });
});

describe('buildPaginationRange', () => {
  it('lists every page when there are few pages', () => {
    expect(buildPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPaginationRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('keeps the window near the start with a trailing ellipsis', () => {
    expect(buildPaginationRange(2, 12)).toEqual([1, 2, 3, 4, 5, '\u2026', 12]);
    expect(buildPaginationRange(4, 12)).toEqual([1, 2, 3, 4, 5, '\u2026', 12]);
  });

  it('keeps the window near the end with a leading ellipsis', () => {
    expect(buildPaginationRange(12, 12)).toEqual([1, '\u2026', 8, 9, 10, 11, 12]);
    expect(buildPaginationRange(9, 12)).toEqual([1, '\u2026', 8, 9, 10, 11, 12]);
  });

  it('surrounds the current page with ellipses in the middle', () => {
    expect(buildPaginationRange(6, 12)).toEqual([1, '\u2026', 5, 6, 7, '\u2026', 12]);
  });

  it('clamps out-of-range pages instead of breaking', () => {
    expect(buildPaginationRange(0, 12)).toEqual([1, 2, 3, 4, 5, '\u2026', 12]);
    expect(buildPaginationRange(99, 12)).toEqual([1, '\u2026', 8, 9, 10, 11, 12]);
  });

  it('returns an empty range for empty results', () => {
    expect(buildPaginationRange(1, 0)).toEqual([]);
  });
});

describe('buildShowingRange', () => {
  it('computes the visible slice bounds', () => {
    expect(buildShowingRange({ page: 1, limit: 10, total: 47 })).toEqual({ start: 1, end: 10 });
    expect(buildShowingRange({ page: 5, limit: 10, total: 47 })).toEqual({ start: 41, end: 47 });
  });

  it('handles empty result sets', () => {
    expect(buildShowingRange({ page: 1, limit: 10, total: 0 })).toEqual({ start: 0, end: 0 });
  });
});
