import { cn } from '../../utils/cn';

export default function Badge({ label, tone = '', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tone,
        className
      )}
    >
      {label}
    </span>
  );
}
