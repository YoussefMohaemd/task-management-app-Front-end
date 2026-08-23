import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDate, getDueDateMeta, toDateInputValue } from './formatDate';

afterEach(() => {
  vi.useRealTimers();
});

describe('getDueDateMeta', () => {
  it.each([
    ['2026-08-20', 'To Do', 'danger'],
    ['2026-08-20', 'In Progress', 'danger'],
  ])('marks past due dates as overdue unless done (%s, %s)', (dueDate, status, tone) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-23T15:00:00'));

    const meta = getDueDateMeta({ dueDate, status });

    expect(meta.tone).toBe(tone);
    expect(meta.label).toMatch(/^Overdue/);
  });

  it('never marks Done tasks as overdue', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-23T15:00:00'));

    const meta = getDueDateMeta({ dueDate: '2020-01-01', status: 'Done' });

    expect(meta.tone).toBe('neutral');
    expect(meta.label).not.toMatch(/Overdue/);
  });

  it('flags tasks due today as warning', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-23T10:00:00'));

    const meta = getDueDateMeta({ dueDate: '2026-08-23', status: 'To Do' });

    expect(meta.label).toBe('Due today');
    expect(meta.tone).toBe('warning');
  });

  it('counts down the next few days as warning', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-23T10:00:00'));

    const meta = getDueDateMeta({ dueDate: '2026-08-25', status: 'To Do' });

    expect(meta.label).toBe('Due in 2 days');
    expect(meta.tone).toBe('warning');
  });

  it('uses a neutral tone for distant future dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-23T10:00:00'));

    const meta = getDueDateMeta({ dueDate: '2030-01-01', status: 'To Do' });

    expect(meta.tone).toBe('neutral');
    expect(meta.label).toBe(formatDate('2030-01-01'));
  });
});

describe('toDateInputValue', () => {
  it('formats a date as YYYY-MM-DD in local time', () => {
    const value = toDateInputValue(new Date(2026, 7, 23, 14, 30));
    expect(value).toBe('2026-08-23');
  });

  it('falls back to today for empty input', () => {
    const value = toDateInputValue('');
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
