import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '@/components/tasks/task-form';

describe('TaskForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders correctly', () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows validation error for empty title', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit when form is submitted with valid data', async () => {
    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        completed: false
      });
    });
  });
});