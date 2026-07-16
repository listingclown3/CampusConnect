'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { truncate } from '@/lib/utils';
import type { Club } from '@/types/database';

interface ClubCardProps {
  club: Club;
  memberCount?: number;
  eventCount?: number;
}

export function ClubCard({ club, memberCount, eventCount }: ClubCardProps) {
  const displayMemberCount = memberCount ?? club.member_count;

  return (
    <Link href={`/clubs/${club.id}`}>
      <Card className="hover:shadow-md transition-all cursor-pointer border h-full">
        <CardContent className="p-4 space-y-3 h-full flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-1">{club.name}</h3>
            <Badge variant="outline" className="text-[10px] font-normal flex-shrink-0">
              {club.category}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {truncate(club.description, 120)}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {displayMemberCount} members
            </span>
            {eventCount !== undefined && eventCount > 0 && (
              <span className="text-xs">
                {eventCount} event{eventCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
