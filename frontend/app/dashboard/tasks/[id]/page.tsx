'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTask, useUpdateTask, useDeleteTask, useToggleTaskCompletion } from '../../../../hooks/task-hooks';
import { TaskForm } from '../../../../components/tasks/task-form';


export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: task, isLoading, error } = useTask(Number(id));
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskCompletionMutation = useToggleTaskCompletion();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (updatedData: any) => {
    updateTaskMutation.mutate(
      { id: Number(id), data: updatedData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(Number(id), {
        onSuccess: () => {
          router.push('/dashboard/tasks');
        },
      });
    }
  };

  const handleToggleCompletion = async () => {
    if (task) {
      toggleTaskCompletionMutation.mutate({ id: Number(id), completed: !task.completed });
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading task...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {(error as Error).message}</div>;
  if (!task) return <div className="text-center py-10">Task not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Details</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Back to Tasks
          </button>
        </div>

        {(error || updateTaskMutation.error || deleteTaskMutation.error || toggleTaskCompletionMutation.error) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            Error: {((error || updateTaskMutation.error || deleteTaskMutation.error || toggleTaskCompletionMutation.error) as Error)?.message}
          </div>
        )}

        {isEditing ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <TaskForm
              onSubmit={handleUpdate}
              loading={updateTaskMutation.isPending}
              initialValues={{
                title: task.title,
                description: task.description || '',
                completed: task.completed
              }}
            />
            <div className="mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800 underline mr-4"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <h2 className={`text-2xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </h2>
                {task.description && (
                  <p className={`mt-3 text-gray-700 ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}
                <div className="mt-4 text-sm text-gray-500">
                  <p>Created: {new Date(task.created_at).toLocaleString()}</p>
                  <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleToggleCompletion}
                  disabled={toggleTaskCompletionMutation.isPending}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    task.completed
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  } ${toggleTaskCompletionMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {toggleTaskCompletionMutation.isPending ? 'Updating...' : task.completed ? 'Completed' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={updateTaskMutation.isPending}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 ${updateTaskMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updateTaskMutation.isPending ? 'Updating...' : 'Edit'}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteTaskMutation.isPending}
                  className={`px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 ${deleteTaskMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}