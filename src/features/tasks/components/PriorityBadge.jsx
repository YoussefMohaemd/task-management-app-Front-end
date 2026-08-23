import Badge from '../../../components/ui/Badge';
import { PRIORITY_BADGE_STYLES } from '../../../types/task';

export default function PriorityBadge({ priority }) {
  return <Badge label={priority} tone={PRIORITY_BADGE_STYLES[priority]} />;
}
