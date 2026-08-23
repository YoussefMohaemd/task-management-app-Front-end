import { describe, expect, it } from 'vitest';
import { DEFAULT_SORT_PRESET, resolveSortParams, resolveSortPreset, SORT_PRESETS } from './sortPresets';

describe('resolveSortParams', () => {
  it('maps preset values to backend sortBy/order pairs', () => {
    expect(resolveSortParams('due-asc')).toEqual({ sortBy: 'dueDate', order: 'asc' });
    expect(resolveSortParams('priority-desc')).toEqual({ sortBy: 'priority', order: 'desc' });
    expect(resolveSortParams('title-asc')).toEqual({ sortBy: 'title', order: 'asc' });
    expect(resolveSortParams('oldest')).toEqual({ sortBy: 'createdAt', order: 'asc' });
  });

  it('returns no sort params for the default newest preset', () => {
    expect(resolveSortParams('newest')).toEqual({ sortBy: undefined, order: undefined });
  });

  it('falls back safely for unknown presets', () => {
    expect(resolveSortParams('hacker-field')).toEqual({ sortBy: undefined, order: undefined });
  });

  it('only offers whitelisted backend sort fields', () => {
    const allowed = new Set(['createdAt', 'updatedAt', 'dueDate', 'title', 'status', 'priority']);
    SORT_PRESETS.filter((preset) => preset.value !== 'newest').forEach((preset) => {
      const { sortBy } = resolveSortParams(preset.value);
      expect(allowed.has(sortBy), `${preset.value} -> ${sortBy}`).toBe(true);
    });
  });

  it('round-trips through resolveSortPreset', () => {
    SORT_PRESETS.forEach(({ value }) => {
      const { sortBy, order } = resolveSortParams(value);
      const restored = resolveSortPreset(sortBy, order);
      if (!sortBy) {
        expect(restored).toBe(DEFAULT_SORT_PRESET);
      } else {
        expect(restored).toBe(value);
      }
    });
  });

  it('falls back to the default preset for unknown backend values', () => {
    expect(resolveSortPreset('$where', 'desc')).toBe(DEFAULT_SORT_PRESET);
  });
});
