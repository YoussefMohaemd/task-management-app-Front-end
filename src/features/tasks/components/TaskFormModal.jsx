import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../../types/task';
import { validateTaskForm } from '../../../utils/validation';
import { toDateInputValue } from '../../../utils/formatDate';

const buildInitialValues = (task) =>
  task
    ? {
        title: task.title ?? '',
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? toDateInputValue(task.dueDate) : '',
      }
    : {
        title: '',
        description: '',
        status: TASK_STATUSES[0],
        priority: 'Medium',
        dueDate: '',
      };

export default function TaskFormModal({ open, task, onClose, onSubmit }) {
  const isEditing = Boolean(task);

  const [values, setValues] = useState(() => buildInitialValues(task));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(buildInitialValues(task));
      setFieldErrors({});
      setFormError(null);
    }
  }, [open, task]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateTaskForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setFieldErrors((current) => ({ ...current, ...error.fieldErrors }));
      }
      setFormError(error.message || 'Unable to save the task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit task' : 'Create a new task'}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 px-5 py-5 sm:px-6">
          {formError ? <ErrorAlert title="Could not save task" message={formError} /> : null}

          <Input
            label="Title"
            id="task-title"
            name="title"
            type="text"
            placeholder="What needs to be done?"
            maxLength={120}
            value={values.title}
            onChange={handleChange}
            error={fieldErrors.title}
          />

          <Textarea
            label={
              <>
                Description{' '}
                <span className="font-normal text-slate-400">(optional)</span>
              </>
            }
            id="task-description"
            name="description"
            rows={3}
            maxLength={1000}
            placeholder="Add more details…"
            value={values.description}
            onChange={handleChange}
            error={fieldErrors.description}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Status"
              id="task-status"
              name="status"
              options={TASK_STATUSES.map((status) => ({ value: status, label: status }))}
              value={values.status}
              onChange={handleChange}
              error={fieldErrors.status}
            />
            <Select
              label="Priority"
              id="task-priority"
              name="priority"
              options={TASK_PRIORITIES.map((priority) => ({ value: priority, label: priority }))}
              value={values.priority}
              onChange={handleChange}
              error={fieldErrors.priority}
            />
          </div>

          <Input
            label="Due date"
            id="task-due-date"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
            error={fieldErrors.dueDate}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEditing ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
