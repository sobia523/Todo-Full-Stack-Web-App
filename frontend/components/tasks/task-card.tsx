'use client';

import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onToggleCompletion, onDelete }: TaskCardProps) {
  return (
    <div className="group relative glass-card p-6 rounded-3xl transition-all duration-500 hover:scale-[1.01] hover:bg-white/5 active:scale-[0.99] border border-white/5 overflow-hidden" role="listitem">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/5 group-hover:to-violet-500/5 transition-all duration-700" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start gap-5">
          {/* Custom Animated Checkbox */}
          <div className="relative mt-1">
            <input
              type="checkbox"
              id={`task-${task.id}-completed`}
              checked={task.completed}
              onChange={(e) => onToggleCompletion(task.id, e.target.checked)}
              className="peer h-6 w-6 rounded-lg border-white/10 bg-zinc-900 text-indigo-500 focus:ring-offset-0 focus:ring-indigo-500/50 appearance-none border-2 transition-all checked:bg-indigo-500 checked:border-indigo-500 cursor-pointer"
              aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            <svg className="absolute left-1.5 top-1.5 w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-all transform scale-50 peer-checked:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-1.5">
            <h3
              className={`text-lg font-bold tracking-tight transition-all duration-500 ${task.completed ? 'text-zinc-600 line-through opacity-70' : 'text-zinc-100'}`}
              id={`task-${task.id}-title`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-sm tracking-wide leading-relaxed transition-all duration-500 ${task.completed ? 'text-zinc-800 line-through opacity-50' : 'text-zinc-400'}`}
                id={`task-${task.id}-description`}
              >
                {task.description}
              </p>
            )}

            {/* Metadata Badges */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {new Date(task.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {task.completed && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 active:scale-90"
          aria-label={`Delete task "${task.title}"`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}