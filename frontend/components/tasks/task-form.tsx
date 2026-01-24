'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TaskFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  initialValues?: {
    title: string;
    description: string;
    completed: boolean;
  };
}

export function TaskForm({ onSubmit, loading = false, initialValues }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: initialValues || {
      title: '',
      description: '',
      completed: false
    }
  });

  const onSubmitHandler = (data: any) => {
    onSubmit(data);
    if (!loading) {
      reset(); // Reset form after successful submission
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
      <div className="space-y-6">
        <div className="group space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-zinc-400 group-focus-within:text-indigo-400 transition-colors">
            Task Name
          </label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="What needs to be done?"
            disabled={loading}
            className="bg-white/5 border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white placeholder:text-zinc-600 h-12 rounded-xl transition-all"
          />
          {errors.title && (
            <p className="text-red-400/80 text-xs pl-1 mt-1 animate-in fade-in slide-in-from-left-1">{String(errors.title.message)}</p>
          )}
        </div>

        <div className="group space-y-2">
          <label htmlFor="description" className="text-sm font-semibold text-zinc-400 group-focus-within:text-indigo-400 transition-colors">
            Details <span className="text-zinc-600 font-normal ml-1">(Optional)</span>
          </label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Add more context about this task..."
            disabled={loading}
            className="bg-white/5 border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-white placeholder:text-zinc-600 min-h-[120px] rounded-xl transition-all resize-none"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 premium-gradient hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-95"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving Task...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{initialValues?.title ? 'Update Task' : 'Create Task'}</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}