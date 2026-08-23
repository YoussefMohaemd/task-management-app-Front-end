import BrandLogo from '../BrandLogo';

export default function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#F4F7FB] dark:bg-night-900">
      <BrandLogo />
      <div
        role="status"
        aria-label="Loading application"
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-600 dark:border-accent-400/20 dark:border-t-accent-400"
      />
    </div>
  );
}
