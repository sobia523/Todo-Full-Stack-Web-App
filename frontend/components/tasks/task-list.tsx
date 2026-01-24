'use client';

import { Task } from '@/types/task';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, data: any) => void;
  onDelete: (id: number) => void;
  onToggleCompletion: (id: number, completed: boolean) => void;
}

export function TaskList({ tasks, onUpdate, onDelete, onToggleCompletion }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 shadow-inner">
          <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Workspace is Clear</h3>
        <p className="text-zinc-500 text-center max-w-sm">No tasks found. Enjoy your productive peace or start something new!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}