'use client'; // This is still a client component, but its content is dynamic

import dynamic from 'next/dynamic';

const ClientHomePageContent = dynamic(() => import('@/components/ClientHomePageContent'), { ssr: false });

export default function HomePage() {
  return <ClientHomePageContent />;
}