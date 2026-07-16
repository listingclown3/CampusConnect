'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UsersRound } from 'lucide-react';

interface PodPreviewCardProps {
  podId: string;
  name: string;
  podType: string;
  memberCount: number;
  score: number;
}

export function PodPreviewCard({
  podId,
  name,
  podType,
  memberCount,
  score,
}: PodPreviewCardProps) {
  return (
    <Link href={`/pods/${podId}`}>
      <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-tight">{name}</h3>
            <Badge variant="secondary" className="shrink-0 capitalize text-[10px]">
              {podType}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <UsersRound className="w-3 h-3" />
              {memberCount} members
            </span>
            <span className="font-medium text-primary">{score}% match</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
