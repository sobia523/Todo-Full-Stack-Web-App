'use client';

import { useTasks, useUpdateTask, useDeleteTask, useToggleTaskCompletion } from '../../../hooks/task-hooks';
import { TaskList } from '../../../components/tasks/task-list';


export default function TasksPage() {
  const { data: tasks = [], isLoading, error } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskCompletionMutation = useToggleTaskCompletion();

  const handleTaskUpdate = async (taskId: number, updatedData: any) => {
    updateTaskMutation.mutate({ id: taskId, data: updatedData });
  };

  const handleTaskDelete = async (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleToggleCompletion = async (taskId: number, completed: boolean) => {
    toggleTaskCompletionMutation.mutate({ id: taskId, completed });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-indigo-500/5 blur-xl animate-pulse"></div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-white font-bold tracking-tight">Syncing Tasks</p>
          <p className="text-zinc-500 text-sm">Please wait while we fetch your workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 glass-card rounded-3xl border-white/5 animate-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/10">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Workspace Offline</h3>
        <p className="text-zinc-500 max-w-sm mb-8">
          {(error as Error).message || "We couldn't reach the server. Please check your connection and try again."}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
          >
            Retry Connection
          </button>
          <a href="/" className="px-6 py-2.5 rounded-2xl text-zinc-400 hover:text-white font-bold transition-all">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">My <span className="premium-text-gradient">Tasks</span></h1>
          <p className="text-zinc-500 text-sm">Organize your workflow and stay productive.</p>
        </div>
        <a
          href="/dashboard/tasks/create"
          className="group flex items-center space-x-2 premium-gradient hover:opacity-90 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Task</span>
        </a>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <TaskList
          tasks={tasks}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          onToggleCompletion={handleToggleCompletion}
        />
      </div>
    </div>
  );
}