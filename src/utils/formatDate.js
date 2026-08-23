const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
};

export const toDateInputValue = (value) => {
  const date = value ? new Date(value) : new Date();
  const offsetAdjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetAdjusted.toISOString().slice(0, 10);
};

export const getDueDateMeta = ({ dueDate, status }) => {
  const formatted = formatDate(dueDate);

  if (!dueDate || status === 'Done') {
    return { label: formatted, tone: 'neutral' };
  }

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));
  const diffDays = Math.round((due.getTime() - today.getTime()) / DAY_MS);

  if (diffDays < 0) {
    return { label: `Overdue · ${formatted}`, tone: 'danger' };
  }
  if (diffDays === 0) {
    return { label: 'Due today', tone: 'warning' };
  }
  if (diffDays <= 3) {
    return { label: `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`, tone: 'warning' };
  }
  return { label: formatted, tone: 'neutral' };
};
