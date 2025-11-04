
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.mustChangePassword) {
        router.replace('/change-password');
        return;
      }
      
      switch (user.role) {
        case 'admin':
          router.replace('/admin');
          break;
        case 'doctor':
          router.replace('/doctor');
          break;
        case 'patient':
          router.replace('/patient');
          break;
        default:
          router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/4" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
