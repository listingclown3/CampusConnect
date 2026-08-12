'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, UsersRound, MessageCircle } from 'lucide-react';

interface StatsBarProps {
  totalMatches: number;
  podsJoined: number;
  unreadMessages: number;
}

export function StatsBar({ totalMatches, podsJoined, unreadMessages }: StatsBarProps) {
  const stats = [
    { icon: Users, label: 'Matches', value: totalMatches },
    { icon: UsersRound, label: 'Pods', value: podsJoined },
    { icon: MessageCircle, label: 'Unread', value: unreadMessages },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
