import { TASK_PRIORITIES, TASK_STATUSES } from '../types/task';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).*$/;

export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = 'Name is required.';
  } else if (trimmedName.length < 2 || trimmedName.length > 50) {
    errors.name = 'Name must be between 2 and 50 characters.';
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8 || password.length > 64) {
    errors.password = 'Password must be between 8 and 64 characters.';
  } else if (!PASSWORD_PATTERN.test(password)) {
    errors.password = 'Password must contain at least one letter and one number.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return errors;
};

export const validateTaskForm = ({ title, description, status, priority, dueDate }) => {
  const errors = {};

  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Title cannot exceed 120 characters.';
  }

  if (description && description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters.';
  }

  if (!TASK_STATUSES.includes(status)) {
    errors.status = 'Select a valid status.';
  }

  if (!TASK_PRIORITIES.includes(priority)) {
    errors.priority = 'Select a valid priority.';
  }

  if (!dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (Number.isNaN(new Date(dueDate).getTime())) {
    errors.dueDate = 'Enter a valid date.';
  }

  return errors;
};
