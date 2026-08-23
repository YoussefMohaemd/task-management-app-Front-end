import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Input from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import ErrorAlert from '../../../components/ui/ErrorAlert';
import { validateRegisterForm } from '../../../utils/validation';

const INITIAL_FORM = { name: '', email: '', password: '', confirmPassword: '' };

export default function RegisterForm() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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

    const errors = validateRegisterForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success('Account created', 'Welcome to TaskFlow.');
      navigate('/tasks', { replace: true });
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setFieldErrors((current) => ({ ...current, ...error.fieldErrors }));
      }
      setFormError(
        error.message || 'Unable to create your account. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create your account</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Start organizing your tasks in less than a minute.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {formError ? (
          <ErrorAlert title="Registration failed" message={formError} />
        ) : null}

        <Input
          label="Full name"
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Johnson"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
        />

        <Input
          label="Email address"
          id="register-email"
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
          id="register-password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          hint="At least 8 characters, with one letter and one number."
        />

        <PasswordInput
          label="Confirm password"
          id="register-confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="rounded font-semibold text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
