import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as taskService from '../services/taskService';
import { useDebouncedValue } from './useDebouncedValue';
import { useToast } from '../context/ToastContext';
import {
  DEFAULT_SORT_PRESET,
  resolveSortParams,
  resolveSortPreset,
} from '../features/tasks/sortPresets';
import { DEFAULT_PAGE_SIZE, normalizePageSize } from '../features/tasks/pagination';

export const DEFAULT_FILTERS = { search: '', status: 'All', priority: 'All' };

const SEARCH_DEBOUNCE_MS = 400;

const countActiveFilters = ({ status, priority }) =>
  (status !== 'All' ? 1 : 0) + (priority !== 'All' ? 1 : 0);

export function useTasks() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') ?? '';
  const urlStatus = searchParams.get('status') ?? 'All';
  const urlPriority = searchParams.get('priority') ?? 'All';
  const urlOverdue = searchParams.get('overdue') === 'true';
  const sortPreset = resolveSortPreset(
    searchParams.get('sortBy') ?? undefined,
    searchParams.get('order') ?? undefined
  );
  const rawPage = Number.parseInt(searchParams.get('page'), 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const pageSize = normalizePageSize(searchParams.get('limit'));

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, toDo: 0, inProgress: 0, done: 0, overdue: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState(null);

  const [taskPendingDeletion, setTaskPendingDeletion] = useState(null);

  const debouncedSearchInput = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);
  const lastCommittedSearchRef = useRef(urlSearch);

  const updateParams = useCallback(
    (changes) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
              next.delete(key);
            } else {
              next.set(key, value);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (debouncedSearchInput === lastCommittedSearchRef.current) return;
    lastCommittedSearchRef.current = debouncedSearchInput;
    updateParams({ search: debouncedSearchInput, page: null });
  }, [debouncedSearchInput, updateParams]);

  useEffect(() => {
    if (urlSearch === lastCommittedSearchRef.current) return;
    lastCommittedSearchRef.current = urlSearch;
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const hasCompletedInitialLoadRef = useRef(false);
  const [reloadToken, setReloadToken] = useState(0);
  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const { sortBy, order } = resolveSortParams(sortPreset);

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
        const result = await taskService.listTasks({
          search: urlSearch,
          status: urlStatus === 'All' ? undefined : urlStatus,
          priority: urlPriority === 'All' ? undefined : urlPriority,
          overdue: urlOverdue || undefined,
          sortBy,
          order,
          page,
          limit: pageSize,
        });
        if (!isStale) {
          setTasks(result.tasks);
          setStats(result.stats);
          setPagination(result.pagination);
          hasCompletedInitialLoadRef.current = true;
        }
      } catch (loadError) {
        if (!isStale) {
          setError(loadError.message || 'Failed to load tasks.');
          toast.error('Failed to load tasks', loadError.message);
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
  }, [urlSearch, urlStatus, urlPriority, urlOverdue, sortPreset, page, pageSize, reloadToken]);

  const setSearch = useCallback((value) => setSearchInput(value), []);

  const setStatusFilter = useCallback(
    (status) => updateParams({ status: status === 'All' ? null : status, page: null }),
    [updateParams]
  );

  const setPriorityFilter = useCallback(
    (priority) => updateParams({ priority: priority === 'All' ? null : priority, page: null }),
    [updateParams]
  );

  const toggleOverdueFilter = useCallback(
    () => updateParams({ overdue: urlOverdue ? null : 'true', page: null }),
    [updateParams, urlOverdue]
  );

  const setSorting = useCallback(
    (preset) => {
      const next = resolveSortParams(preset);
      updateParams({ sortBy: next.sortBy ?? null, order: next.order ?? null, page: null });
    },
    [updateParams]
  );

  const goToPage = useCallback((nextPage) => updateParams({ page: nextPage }), [updateParams]);

  useEffect(() => {
    if (loading || error) return;
    if (tasks.length > 0 || pagination.total === 0 || page <= 1) return;
    const lastValidPage = Math.max(Math.ceil(pagination.total / pageSize), 1);
    if (page > lastValidPage) {
      goToPage(lastValidPage);
    }
  }, [loading, error, tasks.length, pagination.total, page, pageSize, goToPage]);

  const setPageSize = useCallback(
    (size) =>
      updateParams({ limit: normalizePageSize(size) === DEFAULT_PAGE_SIZE ? null : size, page: null }),
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    lastCommittedSearchRef.current = '';
    setSearchInput('');
  }, [setSearchParams]);

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

  const filters = {
    search: searchInput,
    status: urlStatus,
    priority: urlPriority,
    overdueOnly: urlOverdue,
    sortPreset,
  };
  const activeFilters = countActiveFilters(filters) + (urlOverdue ? 1 : 0);
  const hasNoTasksAtAll =
    !error && pagination.total === 0 && activeFilters === 0 && !debouncedSearchInput && !urlSearch;

  return {
    tasks,
    stats,
    pagination,
    pageSize,
    loading,
    updating,
    error,
    retry: refresh,
    filters,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    toggleOverdueFilter,
    setSorting,
    goToPage,
    setPageSize,
    clearFilters,
    activeFilters,
    debouncedSearch: debouncedSearchInput,
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
