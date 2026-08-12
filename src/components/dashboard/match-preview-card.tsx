'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials, cn } from '@/lib/utils';

interface MatchPreviewCardProps {
  userId: string;
  name: string;
  major: string;
  compatibility: number;
  avatarUrl?: string | null;
}

function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
}

export function MatchPreviewCard({
  userId,
  name,
  major,
  compatibility,
  avatarUrl,
}: MatchPreviewCardProps) {
  return (
    <Link href={`/matches/${userId}`}>
      <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
        <CardContent className="p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{major}</p>
          </div>
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0',
              getCompatibilityColor(compatibility)
            )}
          >
            {compatibility}%
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
