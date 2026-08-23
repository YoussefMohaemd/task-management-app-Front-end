import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { validateLoginForm } from '../../../utils/validation';

const INITIAL_FORM = { email: '', password: '' };

export default function LoginForm() {
  const { login } = useAuth();
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
      const from = location.state?.from;
      navigate(from || '/tasks', { replace: true });
    } catch (error) {
      setFormError(error.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
      <p className="mt-1.5 text-sm text-slate-500">
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

        <Input
          label="Password"
          id="login-password"
          name="password"
          type="password"
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

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded"
        >
          Create one now
        </Link>
      </p>
    </div>
  );
}
