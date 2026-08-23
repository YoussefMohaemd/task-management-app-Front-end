import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './ToastContext';

function Trigger({ onPush }) {
  const toast = useToast();
  return (
    <div>
      <button type="button" onClick={() => { toast.success('Task created'); onPush?.('success'); }}>
        success
      </button>
      <button type="button" onClick={() => { toast.error('Failed to load tasks', 'Server unreachable'); }}>
        error
      </button>
      <button type="button" onClick={() => { toast.info('Signed out'); }}>
        info
      </button>
    </div>
  );
}

describe('ToastContext', () => {
  it('renders success and error toasts with messages', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'success' }));
    expect(screen.getByText('Task created')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'error' }));
    expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
    expect(screen.getByText('Server unreachable')).toBeInTheDocument();
  });

  it('auto-dismisses toasts after the configured duration', () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Trigger />
        </ToastProvider>
      );

      fireEvent.click(screen.getByRole('button', { name: 'success' }));
      expect(screen.getByText('Task created')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.queryByText('Task created')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('supports manual dismissal', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'success' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Task created')).not.toBeInTheDocument();
  });
});
