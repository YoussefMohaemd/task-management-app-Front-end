import BrandLogo from '../components/BrandLogo';
import { CheckIcon } from '../components/ui/icons';

const HIGHLIGHTS = [
  'Create, edit and delete tasks in seconds',
  'Search instantly and filter by status or priority',
  'Your tasks stay private to your account',
];

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 lg:flex xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl"
        />
        <div className="relative">
          <BrandLogo dark />
        </div>
        <div className="relative">
          <h1 className="max-w-md text-3xl font-bold leading-tight text-white xl:text-4xl">
            Stay on top of your work, every single day.
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-indigo-100">
            A focused workspace to plan, track and finish what matters — without the noise.
          </p>
          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm text-indigo-50">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-inset ring-white/25">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-indigo-200">© {new Date().getFullYear()} TaskFlow</p>
      </aside>

      <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:py-10">
        <div className="lg:hidden">
          <BrandLogo />
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}

