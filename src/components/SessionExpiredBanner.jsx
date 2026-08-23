import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { InfoIcon, XMarkIcon } from '../components/ui/icons';

export default function SessionExpiredBanner({ visible, onDismiss }) {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onDismiss();
    navigate('/login');
  };

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={cn(
        'mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between'
      )}
    >
      <div className="flex items-start gap-3">
        <InfoIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-800">
          Your session has expired. Please sign in again to continue.
        </p>
      </div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={handleSignIn}
          className="rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
