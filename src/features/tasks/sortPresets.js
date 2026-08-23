export const SORT_PRESETS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first', sortBy: 'createdAt', order: 'asc' },
  { value: 'due-asc', label: 'Due date (soonest)', sortBy: 'dueDate', order: 'asc' },
  { value: 'due-desc', label: 'Due date (latest)', sortBy: 'dueDate', order: 'desc' },
  { value: 'priority-desc', label: 'Priority (high first)', sortBy: 'priority', order: 'desc' },
  { value: 'priority-asc', label: 'Priority (low first)', sortBy: 'priority', order: 'asc' },
  { value: 'title-asc', label: 'Title (A-Z)', sortBy: 'title', order: 'asc' },
  { value: 'title-desc', label: 'Title (Z-A)', sortBy: 'title', order: 'desc' },
];

export const DEFAULT_SORT_PRESET = 'newest';

const NO_SORT_PARAMS = { sortBy: undefined, order: undefined };

const findPreset = (presetValue) => SORT_PRESETS.find((preset) => preset.value === presetValue);

export const resolveSortParams = (presetValue) => {
  const preset = findPreset(presetValue);
  if (!preset || !preset.sortBy) return NO_SORT_PARAMS;
  return { sortBy: preset.sortBy, order: preset.order };
};

export const resolveSortPreset = (sortBy, order) => {
  if (!sortBy) return DEFAULT_SORT_PRESET;
  const match = SORT_PRESETS.find((preset) => preset.sortBy === sortBy && preset.order === order);
  return match ? match.value : DEFAULT_SORT_PRESET;
};
