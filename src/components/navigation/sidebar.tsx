'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, UsersRound, MessageCircle, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/matches', icon: Users, label: 'Matches' },
  { href: '/pods', icon: UsersRound, label: 'Pods' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/campus', icon: Calendar, label: 'Campus' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-sidebar h-full">
      <div className="p-6">
        <Link href="/dashboard" className="text-xl font-bold">
          <span className="text-primary">Spartan</span>
          <span className="text-[#E5A823]">Circle</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
