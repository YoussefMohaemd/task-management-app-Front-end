import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SessionExpiredBanner from '../components/SessionExpiredBanner';
import TaskToolbar from '../features/tasks/components/TaskToolbar';
import TaskList from '../features/tasks/components/TaskList';
import TaskFormModal from '../features/tasks/components/TaskFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorAlert from '../components/ui/ErrorAlert';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { TaskGridSkeleton } from '../components/ui/Skeletons';
import { ClipboardListIcon, PlusIcon, SearchXIcon } from '../components/ui/icons';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';

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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <SessionExpiredBanner visible={sessionExpired} onDismiss={dismissSessionExpired} />

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My Tasks</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Here is what you have
              on your plate.
            </p>
          </div>
        </div>

        <TaskToolbar
          filters={tasks.filters}
          onSearchChange={tasks.setSearch}
          onStatusChange={tasks.setStatusFilter}
          onPriorityChange={tasks.setPriorityFilter}
          onCreateClick={openCreateForm}
        />

        {!tasks.loading && !tasks.error ? (
          <p aria-live="polite" className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {tasks.total} {tasks.total === 1 ? 'task' : 'tasks'}
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
