import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  const setup = (props = {}) => ({
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...props,
  });

  it('renders title, message and actions', () => {
    const handlers = setup();
    render(
      <ConfirmDialog
        open
        title="Delete Task?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        {...handlers}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Delete Task?' })).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirmed', async () => {
    const user = userEvent.setup();
    const handlers = setup();
    render(<ConfirmDialog open title="Delete Task?" message="Sure?" {...handlers} />);

    await user.click(screen.getByRole('button', { name: /confirm/i }));
    expect(handlers.onConfirm).toHaveBeenCalledTimes(1);
    expect(handlers.onCancel).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancelled or dismissed via close button', async () => {
    const user = userEvent.setup();
    const handlers = setup();
    render(<ConfirmDialog open title="Delete Task?" message="Sure?" {...handlers} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handlers.onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(handlers.onCancel).toHaveBeenCalledTimes(2);
  });

  it('disables cancel and shows busy state while processing', () => {
    render(
      <ConfirmDialog open title="Delete Task?" message="Sure?" busy onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /confirm/i })).toHaveAttribute('aria-busy', 'true');
  });
});
