import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import LoginForm from './LoginForm';

vi.mock('../../../services/authService', () => ({
  getToken: vi.fn(() => null),
  clearSession: vi.fn(),
  setUnauthorizedHandler: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  fetchProfile: vi.fn(),
  logoutUser: vi.fn(),
}));

import { loginUser } from '../../../services/authService';

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/tasks" element={<div>dashboard content</div>} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows client-side validation errors without calling the API', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.'));
    expect(loginUser).not.toHaveBeenCalled();
  });

  it('submits credentials and navigates to the dashboard on success', async () => {
    const user = userEvent.setup();
    loginUser.mockResolvedValue({ _id: '1', name: 'Jane', email: 'jane@example.com' });
    renderLogin();

    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Logged in successfully')).toBeInTheDocument();
    expect(loginUser).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'Password123',
    });
    expect(await screen.findByText('dashboard content')).toBeInTheDocument();
  });

  it('shows a toast and inline alert when authentication fails', async () => {
    const user = userEvent.setup();
    loginUser.mockRejectedValue(
      Object.assign(new Error('Invalid email or password.'), { status: 401 })
    );
    renderLogin();

    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'WrongPass1');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid email or password/i);
    expect(screen.getByText('Authentication failed')).toBeInTheDocument();
  });

  it('keeps the typed value when toggling password visibility before submit', async () => {
    const user = userEvent.setup();
    renderLogin();

    const password = screen.getByLabelText(/^password$/i);
    await user.type(password, 'Password123');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(password).toHaveValue('Password123');
  });
});
