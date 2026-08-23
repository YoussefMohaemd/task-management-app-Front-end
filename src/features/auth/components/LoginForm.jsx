import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Input from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { validateLoginForm } from '../../../utils/validation';

const INITIAL_FORM = { email: '', password: '' };

export default function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateLoginForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await login({ email: form.email.trim(), password: form.password });
      toast.success('Logged in successfully', 'Welcome back to TaskFlow.');
      const from = location.state?.from;
      navigate(from || '/tasks', { replace: true });
    } catch (error) {
      toast.error('Authentication failed', error.message || 'Please check your credentials.');
      setFormError(error.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Sign in to manage your tasks.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {formError ? (
          <ErrorAlert title="Sign in failed" message={formError} />
        ) : null}

        <Input
          label="Email address"
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />

        <PasswordInput
          label="Password"
          id="login-password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          state={location.state}
          className="rounded font-semibold text-accent-700 hover:text-accent-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 dark:text-accent-400 dark:hover:text-accent-300"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}

