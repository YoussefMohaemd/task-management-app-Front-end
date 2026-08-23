import BrandLogo from '../components/BrandLogo';
import { CheckIcon } from '../components/ui/icons';

const HIGHLIGHTS = [
  'Create, edit and delete tasks in seconds',
  'Search instantly and filter by status or priority',
  'Your tasks stay private to your account',
];

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F4F7FB] dark:bg-night-900">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-night-850 p-10 lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="animate-float pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-accent-500/50 to-sky-600/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-float-delayed pointer-events-none absolute -bottom-40 -left-28 h-[26rem] w-[26rem] rounded-full bg-gradient-to-tr from-cyan-400/25 to-blue-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />

        <div className="relative">
          <BrandLogo dark />
        </div>

        <div className="relative">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium tracking-wide text-sky-200 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Simple, fast and focused
          </p>
          <h1 className="max-w-md text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
            Stay on top of your work,{' '}
            <span className="text-gradient">every single day.</span>
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300">
            A focused workspace to plan, track and finish what matters — without the noise.
          </p>
          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm text-slate-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-sky-600 shadow-glow-accent">
                  <CheckIcon className="h-3 w-3" strokeWidth={2.5} />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} TaskFlow</p>
      </aside>

      <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:py-10">
        <div className="lg:hidden">
          <BrandLogo />
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="animate-fade-up w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
