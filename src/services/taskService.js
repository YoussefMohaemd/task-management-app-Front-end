import apiClient from './apiClient';

export const createTask = async (payload) => {
  const response = await apiClient.post('/tasks', payload);
  return response.data.data.task;
};

export const listTasks = async ({ search, status, priority } = {}) => {
  const params = {};
  if (search && search.trim()) params.search = search.trim();
  if (status) params.status = status;
  if (priority) params.priority = priority;

  const response = await apiClient.get('/tasks', { params });
  return { tasks: response.data.data.tasks, total: response.data.count };
};

export const updateTask = async (taskId, payload) => {
  const response = await apiClient.put(`/tasks/${taskId}`, payload);
  return response.data.data.task;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};
