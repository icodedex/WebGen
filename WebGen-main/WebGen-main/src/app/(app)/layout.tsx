
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { HeaderNav } from '@/components/shared/header-nav';
import { UserNav } from '@/components/shared/user-nav';
import { Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Footer } from '@/components/shared/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
    
    if (!isLoading && user && user.mustChangePassword && pathname !== '/change-password') {
        router.replace('/change-password');
    }

  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </header>
        <main className="flex-1 p-6">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  // Hide header and nav for the change password page when mandatory
  if (user.mustChangePassword && pathname === '/change-password') {
      return <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-headline">WebGen</span>
          </Link>
          <HeaderNav role={user.role} />
        </div>
        <UserNav />
      </header>
      <main className="flex-1 p-4 sm:p-6">{children}</main>
      <Footer />
    </div>
  );
}
