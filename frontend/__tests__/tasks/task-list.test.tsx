import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskList } from '@/components/tasks/task-list';

const mockTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Test Description 1',
    completed: false,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Test Description 2',
    completed: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

describe('TaskList', () => {
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnToggleCompletion = vi.fn();

  it('renders correctly when there are tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
      />
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
  });

  it('shows empty state when there are no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
      />
    );

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating a new task.')).toBeInTheDocument();
  });

  it('renders completed tasks with strikethrough', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleCompletion={mockOnToggleCompletion}
      />
    );

    const completedTask = screen.getByText('Test Task 2');
    expect(completedTask).toHaveClass('line-through');
  });
});