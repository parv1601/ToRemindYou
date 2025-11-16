import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../../frontend/src/App';
import * as api from '../../frontend/src/api';

jest.mock('../../frontend/src/api');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders greeting, tasks, countdown, wish form, and phrase', async () => {
    api.fetchUser.mockResolvedValue({ name: 'Brinda' });
    api.fetchTasks.mockResolvedValue([
      { _id: '1', name: 'Task 1', recurrenceDays: 3 },
      { _id: '2', name: 'Task 2', recurrenceDays: 7 }
    ]);
    api.addTask.mockResolvedValue({ _id: '3', name: 'Task 3', recurrenceDays: 1 });
    api.submitWish.mockResolvedValue({ success: true });

    render(<App />);

    expect(screen.getByText(/loading user/i)).toBeInTheDocument();

    // Wait for user and tasks to load
    await waitFor(() => expect(screen.getByText(/hello, brinda!/i)).toBeInTheDocument());

    // Check tasks
    expect(screen.getByText(/task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/every 3 days/i)).toBeInTheDocument();

    expect(screen.getByText(/task 2/i)).toBeInTheDocument();
    expect(screen.getByText(/every 7 days/i)).toBeInTheDocument();

    // Check countdown
    expect(screen.getByText(/days until 17th/i)).toBeInTheDocument();

    // Check wish form
    expect(screen.getByRole('textbox', { name: /your wish/i })).toBeInTheDocument();

    // Check personalized phrase (one of two)
    const phrase1 = 'Overactions u shouldn\'t do 😉';
    const phrase2 = 'Cute u r 🥰';
    expect(screen.getByText((content) => content === phrase1 || content === phrase2)).toBeInTheDocument();

    // Add task form test
    fireEvent.change(screen.getByLabelText(/task name/i), { target: { value: 'Task 3' } });
    fireEvent.change(screen.getByLabelText(/recurrence/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => expect(api.addTask).toHaveBeenCalled());

    expect(screen.getByText(/task 3/i)).toBeInTheDocument();

    // Submit wish test
    fireEvent.change(screen.getByRole('textbox', { name: /your wish/i }), { target: { value: 'Good luck!' } });
    fireEvent.click(screen.getByRole('button', { name: /send wish/i }));

    await waitFor(() => expect(api.submitWish).toHaveBeenCalledWith({ message: 'Good luck!' }));

    expect(screen.getByText(/wish sent successfully/i)).toBeInTheDocument();
  });
});
