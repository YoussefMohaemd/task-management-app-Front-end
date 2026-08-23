import BrandLogo from '../BrandLogo';

export default function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50">
      <BrandLogo />
      <div
        role="status"
        aria-label="Loading application"
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600"
      />
    </div>
  );
}
