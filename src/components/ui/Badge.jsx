import { cn } from '../../utils/cn';

export default function Badge({ label, tone = '', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase leading-4 tracking-wide ring-1 ring-inset',
        tone,
        className
      )}
    >
      {label}
    </span>
  );
}
