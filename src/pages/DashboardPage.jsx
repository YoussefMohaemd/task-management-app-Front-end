import { useCallback, useMemo, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SessionExpiredBanner from '../components/SessionExpiredBanner';
import TaskToolbar from '../features/tasks/components/TaskToolbar';
import TaskList from '../features/tasks/components/TaskList';
import TaskFormModal from '../features/tasks/components/TaskFormModal';
import TaskStats from '../features/tasks/components/TaskStats';
import TaskPagination from '../features/tasks/components/TaskPagination';
import CompletionProgress from '../features/tasks/components/CompletionProgress';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorAlert from '../components/ui/ErrorAlert';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { TaskGridSkeleton } from '../components/ui/Skeletons';
import { ClipboardListIcon, PlusIcon, SearchXIcon } from '../components/ui/icons';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function DashboardPage() {
  const { user, sessionExpired, dismissSessionExpired } = useAuth();
  const tasks = useTasks();
  const [formState, setFormState] = useState({ open: false, task: null });

  const openCreateForm = () => setFormState({ open: true, task: null });
  const openEditForm = (task) => setFormState({ open: true, task });
  const closeForm = () => setFormState((current) => ({ ...current, open: false }));

  const handleFormSubmit = async (payload) => {
    if (formState.task) {
      await tasks.updateTaskById(formState.task._id, payload);
    } else {
      await tasks.createTask(payload);
    }
  };

  const focusSearch = useCallback(() => {
    document.getElementById('task-search')?.focus();
    return true;
  }, []);

  const shortcuts = useMemo(
    () => ({
      n: () => {
        openCreateForm();
        return true;
      },
      '/': focusSearch,
    }),
    [focusSearch]
  );
  useKeyboardShortcuts(shortcuts);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <SessionExpiredBanner visible={sessionExpired} onDismiss={dismissSessionExpired} />

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Dashboard
            </p>
            <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              My Tasks
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Here is what you have
              on your plate.
            </p>
          </div>
        </div>

        <CompletionProgress doneCount={tasks.stats.done} totalCount={tasks.stats.total} />

        {!tasks.loading && !tasks.error ? <TaskStats stats={tasks.stats} /> : null}

        <div className="sticky top-[70px] z-20 -mx-1 px-1 py-0.5">
          <TaskToolbar
            filters={tasks.filters}
            onSearchChange={tasks.setSearch}
            onStatusChange={tasks.setStatusFilter}
            onPriorityChange={tasks.setPriorityFilter}
            onSortChange={tasks.setSorting}
            onToggleOverdue={tasks.toggleOverdueFilter}
            onCreateClick={openCreateForm}
            activeFilters={tasks.activeFilters}
            onClearFilters={tasks.clearFilters}
            updating={tasks.updating}
          />
        </div>

        {!tasks.loading && !tasks.error ? (
          <p
            aria-live="polite"
            className="-mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
          >
            {tasks.pagination.total} {tasks.pagination.total === 1 ? 'task' : 'tasks'}
            {tasks.activeFilters > 0 || tasks.debouncedSearch ? ' matching current view' : ''}
          </p>
        ) : null}

        {tasks.error ? (
          <ErrorAlert title="Could not load your tasks" message={tasks.error} onRetry={tasks.retry} />
        ) : null}

        {tasks.loading ? (
          <TaskGridSkeleton />
        ) : !tasks.error && tasks.tasks.length === 0 ? (
          tasks.hasNoTasksAtAll ? (
            <EmptyState
              icon={ClipboardListIcon}
              title="No tasks found"
              description="Create your first task to get started and keep everything in one place."
              action={
                <Button onClick={openCreateForm}>
                  <PlusIcon className="h-4 w-4" />
                  Create your first task
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={SearchXIcon}
              title="No matching tasks"
              description="Nothing matches your current search or filters. Try adjusting them or clear everything to see all tasks."
              action={
                <Button variant="secondary" onClick={tasks.clearFilters}>
                  Clear search &amp; filters
                </Button>
              }
            />
          )
        ) : (
          <div
            className={
              tasks.updating
                ? 'pointer-events-none opacity-50 transition-opacity duration-200'
                : 'transition-opacity duration-200'
            }
          >
            <TaskList
              tasks={tasks.tasks}
              mutatingId={tasks.mutatingId}
              onEdit={openEditForm}
              onDelete={tasks.requestDeleteTask}
              onStatusChange={tasks.changeStatus}
            />
            <div className="mt-4">
              <TaskPagination
                pagination={tasks.pagination}
                onPageChange={tasks.goToPage}
                onPageSizeChange={tasks.setPageSize}
                pageSize={tasks.pageSize}
                disabled={tasks.updating}
              />
            </div>
          </div>
        )}
      </div>

      <TaskFormModal
        open={formState.open}
        task={formState.task}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={Boolean(tasks.taskPendingDeletion)}
        title="Delete this task?"
        message={`Are you sure you want to delete "${
          tasks.taskPendingDeletion?.title ?? ''
        }"? This action cannot be undone.`}
        confirmLabel="Delete task"
        busy={tasks.deleting}
        onConfirm={tasks.confirmDeleteTask}
        onCancel={tasks.cancelDeleteTask}
      />
    </DashboardLayout>
  );
}
