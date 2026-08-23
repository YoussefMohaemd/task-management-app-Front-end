export default function EmptyState({ icon: IconComponent, title, description, action }) {
  return (
    <div className="animate-fade-up relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-500/10"
      />
      {IconComponent ? (
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-glow">
          <IconComponent className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="relative text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description ? (
        <p className="relative mt-1 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
      {action ? <div className="relative mt-5">{action}</div> : null}
    </div>
  );
}
