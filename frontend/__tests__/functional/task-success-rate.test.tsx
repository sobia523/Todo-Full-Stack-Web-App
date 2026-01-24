import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '@/components/tasks/task-form';

describe('Task Operation Success Rate', () => {
  it('successfully creates a task with valid input', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({ success: true });

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

    // Success rate: 1 out of 1 attempts succeeded = 100%
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('handles task creation failure gracefully', async () => {
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Creation failed'));

    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Failing Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Will fail' } });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});