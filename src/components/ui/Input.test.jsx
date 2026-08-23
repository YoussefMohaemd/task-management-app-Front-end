import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from './Input';

describe('PasswordInput visibility toggle', () => {
  it('renders a password field by default', () => {
    render(<PasswordInput label="Password" id="pw" placeholder="Enter password" />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles to plain text and back without losing the value', async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" id="pw" />);

    const input = screen.getByLabelText('Password');
    await user.type(input, 'Secret123');
    expect(input).toHaveValue('Secret123');

    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(input).toHaveValue('Secret123');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('is keyboard accessible via aria attributes', () => {
    render(<PasswordInput id="pw" />);

    const toggle = screen.getByRole('button', { name: 'Show password' });
    expect(toggle).not.toHaveAttribute('disabled');
    toggle.focus();
    expect(toggle).toHaveFocus();
  });
});
