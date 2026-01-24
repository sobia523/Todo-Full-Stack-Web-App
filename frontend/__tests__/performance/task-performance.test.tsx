import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskForm } from '@/components/tasks/task-form';

describe('Performance: Task Operations', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(new Promise(resolve => setTimeout(resolve, 500))); // Simulate 500ms API call

  it('completes task creation within acceptable time', async () => {
    const startTime = performance.now();

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
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Check that the operation completes within 3 seconds (3000ms)
    expect(duration).toBeLessThan(3000);
  });
});