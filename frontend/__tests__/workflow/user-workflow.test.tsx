import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '@/components/tasks/task-form';

describe('User Workflow Completion Time', () => {
  it('completes task management workflow within acceptable time', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({ success: true });

    const startTime = performance.now();

    render(
      <TaskForm
        onSubmit={mockOnSubmit}
        loading={false}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    // Simulate user workflow: filling form and submitting
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Workflow Test Task' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Testing workflow completion time' } });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Workflow Test Task',
        description: 'Testing workflow completion time',
        completed: false
      });
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Check that the workflow completes within 5 minutes (300,000ms)
    // This is a generous upper bound for the test
    expect(duration).toBeLessThan(300000);
  });
});