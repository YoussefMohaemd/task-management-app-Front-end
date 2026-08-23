import Badge from '../../../components/ui/Badge';
import { cn } from '../../../utils/cn';
import {
  OVERDUE_BADGE_STYLES,
  STATUS_BADGE_STYLES,
} from '../../../types/task';
import { getDueDateMeta } from '../../../utils/formatDate';

export default function StatusBadge({ task, className }) {
  const isOverdue = getDueDateMeta(task).tone === 'danger';
  const label = isOverdue ? 'Overdue' : task.status;
  const tone = isOverdue ? OVERDUE_BADGE_STYLES : STATUS_BADGE_STYLES[task.status];

  return (
    <Badge label={label} tone={cn(tone, className)} />
  );
}
