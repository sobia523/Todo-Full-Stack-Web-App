'use client';

import dynamic from 'next/dynamic';

const ClientTasksPageContent = dynamic(() => import('@/components/tasks/ClientTasksPageContent'), { ssr: false });

export default function TasksPage() {
  return <ClientTasksPageContent />;
}