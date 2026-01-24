import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskList } from '@/components/tasks/task-list';

describe('Empty State Handling', () => {
  it('displays empty state message when no tasks are provided', () => {
    render(
      <TaskList
        tasks={[]}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onToggleCompletion={vi.fn()}
      />
    );

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating a new task.')).toBeInTheDocument();
  });

  it('does not display empty state when tasks are provided', () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onToggleCompletion={vi.fn()}
      />
    );

    expect(screen.queryByText('No tasks yet')).not.toBeInTheDocument();
    expect(screen.queryByText('Get started by creating a new task.')).not.toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});