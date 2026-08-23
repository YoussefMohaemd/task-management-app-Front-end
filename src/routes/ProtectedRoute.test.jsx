import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import ProtectedRoute from './ProtectedRoute';

vi.mock('../services/authService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getToken: vi.fn(() => null),
    fetchProfile: vi.fn(),
    setUnauthorizedHandler: vi.fn(),
    clearSession: vi.fn(),
    logoutUser: vi.fn(),
    loginUser: vi.fn(),
    registerUser: vi.fn(),
  };
});

import { getToken, fetchProfile } from '../services/authService';

const renderRoutes = () =>
  render(
    <MemoryRouter initialEntries={['/tasks']}>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/tasks" element={<div>protected content</div>} />
            </Route>
            <Route path="/login" element={<div>login page</div>} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  it('redirects unauthenticated visitors to login', () => {
    getToken.mockReturnValue(null);

    renderRoutes();

    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('renders protected content once the session is restored', async () => {
    getToken.mockReturnValue('valid-token');
    fetchProfile.mockResolvedValue({ _id: '1', name: 'Jane', email: 'jane@example.com' });

    renderRoutes();

    expect(await screen.findByText('protected content')).toBeInTheDocument();
    expect(fetchProfile).toHaveBeenCalledTimes(1);
  });

  it('clears the session when the profile restore fails with 401', async () => {
    getToken.mockReturnValue('expired-token');
    fetchProfile.mockRejectedValue(Object.assign(new Error('Session expired'), { status: 401 }));

    renderRoutes();

    expect(await screen.findByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });
});
