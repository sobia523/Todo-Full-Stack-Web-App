import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskForm } from '@/components/tasks/task-form';

describe('Loading State Implementation', () => {
  it('shows loading state when loading prop is true', () => {
    render(
      <TaskForm
        onSubmit={vi.fn()}
        loading={true}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/saving/i);
  });

  it('shows normal state when loading prop is false', () => {
    render(
      <TaskForm
        onSubmit={vi.fn()}
        loading={false}
        initialValues={{ title: '', description: '', completed: false }}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create task/i });
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent(/create task/i);
  });
});