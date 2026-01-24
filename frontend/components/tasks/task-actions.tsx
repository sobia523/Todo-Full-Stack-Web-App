'use client';

import { Task } from '@/types/task';

interface TaskActionsProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleCompletion: (id: number, completed: boolean) => void;
}

export function TaskActions({ task, onEdit, onDelete, onToggleCompletion }: TaskActionsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(task)}
        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
      >
        Edit
      </button>
      <button
        onClick={() => onToggleCompletion(task.id, !task.completed)}
        className={`${task.completed ? 'text-green-500' : 'text-yellow-500'} hover:opacity-80 text-sm font-medium`}
      >
        {task.completed ? 'Undo' : 'Complete'}
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Delete
      </button>
    </div>
  );
}