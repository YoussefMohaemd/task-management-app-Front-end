import Modal from './Modal';
import Button from './Button';
import { ExclamationTriangleIcon } from './icons';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-600 ring-1 ring-inset ring-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/25"
          >
            <ExclamationTriangleIcon className="h-[18px] w-[18px]" />
          </span>
          <p className="text-sm leading-relaxed text-ink-body dark:text-ink-muted">{message}</p>
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6 dark:border-line-dark">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button variant="danger" loading={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
