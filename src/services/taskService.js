import apiClient from './apiClient';

export const createTask = async (payload) => {
  const response = await apiClient.post('/tasks', payload);
  return response.data.data.task;
};

export const listTasks = async ({ search, status, priority, overdue, sortBy, order, page, limit } = {}) => {
  const params = {};
  if (search && search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (overdue) params.overdue = 'true';
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  if (page && page > 1) params.page = page;
  if (limit) params.limit = limit;

  const response = await apiClient.get('/tasks', { params });
  const { tasks, stats, pagination } = response.data.data;

  return {
    tasks,
    total: response.data.count,
    stats: stats ?? { total: 0, toDo: 0, inProgress: 0, done: 0, overdue: 0 },
    pagination: pagination ?? { page: 1, limit: 20, total: 0, totalPages: 1 },
  };
};

export const updateTask = async (taskId, payload) => {
  const response = await apiClient.put(`/tasks/${taskId}`, payload);
  return response.data.data.task;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};
