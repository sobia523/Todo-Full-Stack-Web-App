'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/tasks');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-full py-20">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Redirecting to tasks...</p>
            </div>
        </div>
    );
}
