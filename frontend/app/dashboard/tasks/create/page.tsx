'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskForm } from '../../../../components/tasks/task-form';
import { useCreateTask } from '../../../../hooks/task-hooks';


export default function CreateTaskPage() {
  const router = useRouter();
  const createTaskMutation = useCreateTask();

  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (taskData: any) => {
    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/tasks');
          router.refresh(); // Refresh to update the task list
        }, 2000);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create New <span className="premium-text-gradient">Task</span></h1>
            <p className="text-zinc-500 text-sm">Fill in the details below to add a new item to your list.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all active:scale-95"
            disabled={createTaskMutation.isPending}
            title="Go back"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Container */}
        <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Decorative gradient corner */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full"></div>

          {(createTaskMutation.isError || createTaskMutation.error) && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error: {(createTaskMutation.error as Error)?.message}</span>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-200/20 text-green-400 text-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Task created successfully! Redirecting...</span>
              </div>
            </div>
          )}

          <TaskForm
            onSubmit={handleSubmit}
            loading={createTaskMutation.isPending}
            initialValues={{ title: '', description: '', completed: false }}
          />
        </div>
      </div>
    </div>
  );
}