import { describe, expect, it } from 'vitest';
import {
  validateLoginForm,
  validateRegisterForm,
  validateTaskForm,
} from './validation';

describe('validateRegisterForm', () => {
  const valid = { name: 'Jane', email: 'jane@example.com', password: 'Password123', confirmPassword: 'Password123' };

  it('accepts a valid payload', () => {
    expect(validateRegisterForm(valid)).toEqual({});
  });

  it('rejects a short name', () => {
    expect(validateRegisterForm({ ...valid, name: 'J' }).name).toBeTruthy();
  });

  it('rejects an invalid email', () => {
    expect(validateRegisterForm({ ...valid, email: 'nope' }).email).toBeTruthy();
    expect(validateRegisterForm({ ...valid, email: '' }).email).toBeTruthy();
  });

  it('rejects weak passwords', () => {
    expect(validateRegisterForm({ ...valid, password: 'short1' }).password).toBeTruthy();
    expect(validateRegisterForm({ ...valid, password: 'nodigits' }).password).toBeTruthy();
  });

  it('rejects mismatched confirmation', () => {
    expect(
      validateRegisterForm({ ...valid, confirmPassword: 'Different123' }).confirmPassword
    ).toBe('Passwords do not match.');
  });
});

describe('validateLoginForm', () => {
  it('accepts valid credentials shape', () => {
    expect(validateLoginForm({ email: 'a@b.com', password: 'x' })).toEqual({});
  });

  it('requires email and password', () => {
    const errors = validateLoginForm({ email: '', password: '' });
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  it('rejects malformed emails', () => {
    expect(validateLoginForm({ email: 'bad', password: 'x' }).email).toBeTruthy();
  });
});

describe('validateTaskForm', () => {
  const valid = { title: 'Task', description: '', status: 'To Do', priority: 'High', dueDate: '2030-01-01' };

  it('accepts a valid task', () => {
    expect(validateTaskForm(valid)).toEqual({});
  });

  it('requires a title within limits', () => {
    expect(validateTaskForm({ ...valid, title: '  ' }).title).toBeTruthy();
    expect(validateTaskForm({ ...valid, title: 'x'.repeat(121) }).title).toBeTruthy();
  });

  it('rejects invalid status and priority values', () => {
    expect(validateTaskForm({ ...valid, status: 'Archived' }).status).toBeTruthy();
    expect(validateTaskForm({ ...valid, priority: 'Urgent' }).priority).toBeTruthy();
  });

  it('requires a parseable due date', () => {
    expect(validateTaskForm({ ...valid, dueDate: '' }).dueDate).toBeTruthy();
    expect(validateTaskForm({ ...valid, dueDate: 'not-a-date' }).dueDate).toBeTruthy();
  });
});
