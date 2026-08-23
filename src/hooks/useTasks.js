import { useCallback, useEffect, useRef, useState } from 'react';
import * as taskService from '../services/taskService';
import { useDebouncedValue } from './useDebouncedValue';
import { useToast } from '../context/ToastContext';

export const DEFAULT_FILTERS = { search: '', status: 'All', priority: 'All' };

const buildQueryParams = ({ search, status, priority }) => ({
  search: search.trim(),
  status: status === 'All' ? undefined : status,
  priority: priority === 'All' ? undefined : priority,
});

const countActiveFilters = ({ status, priority }) =>
  (status !== 'All' ? 1 : 0) + (priority !== 'All' ? 1 : 0);

export function useTasks() {
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [taskPendingDeletion, setTaskPendingDeletion] = useState(null);

  const debouncedSearch = useDebouncedValue(filters.search.trim(), 400);

  const hasCompletedInitialLoadRef = useRef(false);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let isStale = false;

    const loadTasks = async () => {
      if (hasCompletedInitialLoadRef.current) {
        setUpdating(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await taskService.listTasks(
          buildQueryParams({
            search: debouncedSearch,
            status: filters.status,
            priority: filters.priority,
          })
        );
        if (!isStale) {
          setTasks(result.tasks);
          setTotal(result.total);
          hasCompletedInitialLoadRef.current = true;
        }
      } catch (loadError) {
        if (!isStale) {
          setError(loadError.message || 'Failed to load tasks.');
        }
      } finally {
        if (!isStale) {
          setLoading(false);
          setUpdating(false);
        }
      }
    };

    loadTasks();
    return () => {
      isStale = true;
    };
  }, [debouncedSearch, filters.status, filters.priority, reloadToken]);

  const setSearch = useCallback((search) => {
    setFilters((current) => ({ ...current, search }));
  }, []);

  const setStatusFilter = useCallback((status) => {
    setFilters((current) => ({ ...current, status }));
  }, []);

  const setPriorityFilter = useCallback((priority) => {
    setFilters((current) => ({ ...current, priority }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const createTask = useCallback(
    async (payload) => {
      setSaving(true);
      try {
        await taskService.createTask(payload);
        toast.success('Task created');
        refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh, toast]
  );

  const updateTaskById = useCallback(
    async (taskId, payload) => {
      setSaving(true);
      try {
        await taskService.updateTask(taskId, payload);
        toast.success('Task updated');
        refresh();
      } finally {
        setSaving(false);
      }
    },
    [refresh, toast]
  );

  const changeStatus = useCallback(
    async (taskId, nextStatus) => {
      if (mutatingId) return;
      setMutatingId(taskId);
      try {
        await taskService.updateTask(taskId, { status: nextStatus });
        toast.success('Status updated');
        refresh();
      } catch (statusError) {
        toast.error('Could not update status', statusError.message);
      } finally {
        setMutatingId(null);
      }
    },
    [mutatingId, refresh, toast]
  );

  const requestDeleteTask = useCallback((task) => setTaskPendingDeletion(task), []);

  const cancelDeleteTask = useCallback(() => {
    if (!deleting) {
      setTaskPendingDeletion(null);
    }
  }, [deleting]);

  const confirmDeleteTask = useCallback(async () => {
    if (!taskPendingDeletion) return;
    setDeleting(true);
    try {
      await taskService.deleteTask(taskPendingDeletion._id);
      toast.success('Task deleted');
      setTaskPendingDeletion(null);
      refresh();
    } catch (deleteError) {
      toast.error('Could not delete task', deleteError.message);
    } finally {
      setDeleting(false);
    }
  }, [refresh, taskPendingDeletion, toast]);

  const activeFilters = countActiveFilters(filters);
  const hasNoTasksAtAll = !error && total === 0 && activeFilters === 0 && !debouncedSearch;

  return {
    tasks,
    total,
    loading,
    updating,
    error,
    retry: refresh,
    filters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    clearFilters,
    activeFilters,
    debouncedSearch,
    hasNoTasksAtAll,
    saving,
    deleting,
    mutatingId,
    createTask,
    updateTaskById,
    changeStatus,
    taskPendingDeletion,
    requestDeleteTask,
    cancelDeleteTask,
    confirmDeleteTask,
  };
}
