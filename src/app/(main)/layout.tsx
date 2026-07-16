'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { Sidebar } from '@/components/navigation/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-sm px-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isOnboarding = pathname === '/onboarding';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar - hidden on onboarding */}
      {!isOnboarding && <Sidebar />}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - hidden on onboarding */}
        {!isOnboarding && (
          <header className="flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
            <div className="lg:hidden">
              <Link href="/dashboard" className="text-lg font-bold">
                <span className="text-primary">Spartan</span>
                <span className="text-[#E5A823]">Circle</span>
              </Link>
            </div>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <Link href="/settings" className="p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Settings">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Link>
              <Link href="/settings/profile" className="flex items-center gap-2 min-w-[44px] min-h-[44px] justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label="Profile">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user ? getInitials(`${user.first_name} ${user.last_name}`) : '?'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>
        )}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto ${!isOnboarding ? 'pb-20 lg:pb-0' : ''}`}>
          {children}
        </main>

        {/* Mobile bottom nav - hidden on onboarding */}
        {!isOnboarding && <BottomNav />}
      </div>
    </div>
  );
}
