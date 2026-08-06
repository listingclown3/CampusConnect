'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface EventPreviewCardProps {
  eventId: string;
  title: string;
  startTime: string;
  location: string;
  rsvpCount: number;
}

export function EventPreviewCard({
  eventId,
  title,
  startTime,
  location,
  rsvpCount,
}: EventPreviewCardProps) {
  return (
    <Link href={`/events/${eventId}`}>
      <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
        <CardContent className="p-4 space-y-2">
          <h3 className="font-medium text-sm leading-tight">{title}</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{formatDate(startTime)} at {formatTime(startTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3 h-3 shrink-0" />
              <span>{rsvpCount} attending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
