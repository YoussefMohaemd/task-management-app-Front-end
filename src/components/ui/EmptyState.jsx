export default function EmptyState({ icon: IconComponent, title, description, action }) {
  return (
    <div className="animate-fade-up relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-white px-6 py-12 text-center shadow-card dark:border-line-dark dark:bg-night-750">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent-100/60 blur-3xl dark:bg-accent-400/10"
      />
      {IconComponent ? (
        <div className="relative mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-sky-600 text-white shadow-glow-accent dark:from-accent-400/90 dark:to-accent-600">
          <IconComponent className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="relative text-base font-semibold text-ink-heading dark:text-ink">{title}</h3>
      {description ? (
        <p className="relative mt-1 max-w-sm text-sm leading-relaxed text-ink-muted dark:text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="relative mt-5">{action}</div> : null}
    </div>
  );
}
