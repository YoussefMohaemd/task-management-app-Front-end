import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../services/taskService', () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

vi.mock('../services/authService', () => ({
  getToken: vi.fn(() => null),
  clearSession: vi.fn(),
  setUnauthorizedHandler: vi.fn(),
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  fetchProfile: vi.fn(),
  logoutUser: vi.fn(),
}));

import * as taskService from '../services/taskService';

const TASKS = [
  {
    _id: 't1',
    title: 'Buy milk',
    description: 'Two liters',
    status: 'To Do',
    priority: 'High',
    dueDate: '2026-08-20',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    _id: 't2',
    title: 'Ship release',
    description: '',
    status: 'Done',
    priority: 'Medium',
    dueDate: '2030-06-01',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
  },
];

const STATS = { total: 4, toDo: 1, inProgress: 1, done: 2, overdue: 1 };

const makeResponse = ({ tasks = TASKS, stats = STATS, total = 4, totalPages = 1, page = 1 } = {}) => ({
  tasks,
  total,
  stats,
  pagination: { page, limit: 10, total, totalPages },
});

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="url-probe">{location.search}</span>;
}

const renderDashboard = ({ initialEntry = '/tasks' } = {}) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <LocationProbe />
            <Routes>
              <Route path="/tasks" element={<DashboardPage />} />
              <Route path="*" element={<div>elsewhere</div>} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  taskService.listTasks.mockResolvedValue(makeResponse());
});

describe('DashboardPage - rendering', () => {
  it('renders dashboard statistics from the API payload without extra requests', async () => {
    renderDashboard();

    await screen.findByText('Buy milk');

    expect(screen.getByTestId('stat-total')).toHaveTextContent('4');
    expect(screen.getByTestId('stat-todo')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-inProgress')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-done')).toHaveTextContent('2');
    expect(screen.getByTestId('stat-overdue')).toHaveTextContent('1');
    expect(taskService.listTasks).toHaveBeenCalledTimes(1);
  });

  it('renders the completion progress percentage', async () => {
    renderDashboard();

    expect(await screen.findByText('50%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: '2 of 4 tasks completed' })).toBeInTheDocument();
  });

  it('renders zero-task progress correctly', async () => {
    taskService.listTasks.mockResolvedValue(
      makeResponse({ tasks: [], stats: { total: 0, toDo: 0, inProgress: 0, done: 0, overdue: 0 }, total: 0 })
    );
    renderDashboard();

    expect(await screen.findByText('0%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'No tasks yet' })).toBeInTheDocument();
  });
});

describe('DashboardPage - states', () => {
  it('shows a loading skeleton before data arrives', async () => {
    let resolveList;
    taskService.listTasks.mockReturnValue(new Promise((resolve) => { resolveList = resolve; }));

    renderDashboard();

    expect(screen.getByRole('status', { name: 'Loading tasks' })).toBeInTheDocument();
    resolveList(makeResponse({ tasks: [] }));
    await waitFor(() => expect(screen.queryByRole('status', { name: 'Loading tasks' })).toBeNull());
  });

  it('shows an error alert with working retry', async () => {
    const user = userEvent.setup();
    taskService.listTasks
      .mockRejectedValueOnce(new Error('Cannot reach the server'))
      .mockResolvedValueOnce(makeResponse());

    renderDashboard();

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load your tasks/i);

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
    expect(taskService.listTasks).toHaveBeenCalledTimes(2);
  });

  it('differentiates between no tasks at all and no filter matches', async () => {
    const emptyResponse = {
      tasks: [],
      total: 0,
      stats: { total: 0, toDo: 0, inProgress: 0, done: 0, overdue: 0 },
    };

    taskService.listTasks.mockResolvedValue(makeResponse(emptyResponse));
    const first = renderDashboard();
    expect(await screen.findByText('No tasks found')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create your first task/i })
    ).toBeInTheDocument();
    first.unmount();

    taskService.listTasks.mockClear();
    taskService.listTasks.mockResolvedValue(makeResponse(emptyResponse));
    renderDashboard({ initialEntry: '/tasks?search=zzz' });

    expect(await screen.findByText(/no matching tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/clear search & filters/i)).toBeInTheDocument();
    expect(taskService.listTasks).toHaveBeenCalledWith(expect.objectContaining({ search: 'zzz' }));
  }, 20000);
});

describe('DashboardPage - query interactions', () => {
  it('debounces search input into a single API call and persists it to the URL', async () => {
    vi.useFakeTimers();
    try {
      renderDashboard();
      expect(taskService.listTasks).toHaveBeenCalledTimes(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(screen.getByText('Buy milk')).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText('Search tasks by title'), {
        target: { value: 'meeting' },
      });
      expect(taskService.listTasks).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('url-probe')).not.toHaveTextContent('search=meeting');

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(taskService.listTasks).toHaveBeenCalledTimes(2);
      expect(taskService.listTasks).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: 'meeting' })
      );
      expect(screen.getByTestId('url-probe')).toHaveTextContent('search=meeting');
    } finally {
      vi.useRealTimers();
    }
  }, 20000);

  it('writes the status filter to the URL and resets pagination', async () => {
    const user = userEvent.setup();
    renderDashboard({ initialEntry: '/tasks?page=3' });
    await screen.findByText('Buy milk');

    await user.selectOptions(screen.getByLabelText('Filter tasks by status'), 'Done');

    await waitFor(() => expect(screen.getByTestId('url-probe')).toHaveTextContent('status=Done'));
    expect(taskService.listTasks).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'Done' }));
  });

  it('sends backend sort parameters when the sort option changes', async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText('Buy milk');

    await user.selectOptions(screen.getByLabelText('Sort tasks'), 'Priority (high first)');

    expect(taskService.listTasks).toHaveBeenLastCalledWith(
      expect.objectContaining({ sortBy: 'priority', order: 'desc' })
    );
    expect(screen.getByTestId('url-probe')).toHaveTextContent('sortBy=priority');
  });

  it('requests page 2 through the pagination controls', async () => {
    taskService.listTasks.mockImplementation((params) =>
      makeResponse({ total: 30, totalPages: 3, page: params?.page ?? 1 })
    );
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText('Buy milk');

    expect(screen.getByTestId('showing-range')).toHaveTextContent('Showing 1–10 of 30 tasks');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toHaveAttribute(
      'aria-current',
      'page'
    );

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(taskService.listTasks).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, limit: 10 })
    );
    expect(screen.getByTestId('url-probe')).toHaveTextContent('page=2');
    expect(await screen.findByTestId('showing-range')).toHaveTextContent(
      'Showing 11–20 of 30 tasks'
    );
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('changes the page size and resets to the first page', async () => {
    const user = userEvent.setup();
    renderDashboard({ initialEntry: '/tasks?page=2&limit=20' });
    await screen.findByText('Buy milk');
    taskService.listTasks.mockClear();

    await user.selectOptions(screen.getByLabelText('Tasks per page'), '5');

    expect(taskService.listTasks).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 5, page: 1 })
    );
    expect(screen.getByTestId('url-probe')).toHaveTextContent('limit=5');
  });

  it('snaps an out-of-range page back to the last valid page', async () => {
    taskService.listTasks.mockResolvedValue(makeResponse({ tasks: [], total: 4, totalPages: 1 }));
    renderDashboard({ initialEntry: '/tasks?page=99' });

    await waitFor(() =>
      expect(screen.getByTestId('url-probe')).not.toHaveTextContent('page=99')
    );
    expect(screen.getByTestId('url-probe')).toHaveTextContent('page=1');
  });

  it('clears all filters back to the unfiltered view', async () => {
    const user = userEvent.setup();
    renderDashboard({ initialEntry: '/tasks?search=milk&status=To%20Do&priority=High&overdue=true&page=2' });
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: /clear/i }));

    await waitFor(() => expect(screen.getByTestId('url-probe')).toHaveTextContent(/^$/));
  });
});

describe('DashboardPage - mutations and shortcuts', () => {
  it('deletes a task only after confirmation', async () => {
    const user = userEvent.setup();
    taskService.deleteTask?.mockResolvedValue?.({});
    vi.mocked(await import('../services/taskService')).deleteTask.mockResolvedValue({ success: true });
    renderDashboard();
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: 'Delete task: Buy milk' }));
    expect(screen.getByRole('dialog', { name: 'Delete this task?' })).toBeInTheDocument();
    expect(taskService.deleteTask).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /^Delete task$/ }));
    expect(taskService.deleteTask).toHaveBeenCalledWith('t1');
    expect(await screen.findByText('Task deleted')).toBeInTheDocument();
  });

  it('opens the create modal with the N key outside inputs', async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText('Buy milk');

    await user.keyboard('n');

    expect(screen.getByRole('dialog', { name: 'Create a new task' })).toBeInTheDocument();
  });

  it('does not open the modal when typing N inside the search field', async () => {
    const user = userEvent.setup();
    renderDashboard();
    await screen.findByText('Buy milk');

    await user.type(screen.getByLabelText('Search tasks by title'), 'n');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
