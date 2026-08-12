'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecommendationReason } from './recommendation-reason';
import { cn, formatDate, formatTime } from '@/lib/utils';
import type { Event, RsvpStatus } from '@/types/database';

interface EventCardProps {
  event: Event;
  clubName?: string;
  rsvpStatus?: RsvpStatus | null;
  recommendationReason?: string;
  attendeeCount?: number;
  isPast?: boolean;
}

export function EventCard({
  event,
  clubName,
  rsvpStatus,
  recommendationReason,
  attendeeCount,
  isPast = false,
}: EventCardProps) {
  const isFull = event.max_attendees
    ? (attendeeCount ?? event.rsvp_count) >= event.max_attendees
    : false;

  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className={cn(
          'hover:shadow-md transition-all cursor-pointer border',
          isPast && 'opacity-60'
        )}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm line-clamp-1">{event.title}</h3>
              {clubName && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hosted by {clubName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isPast && (
                <Badge variant="secondary" className="text-[10px]">
                  Past
                </Badge>
              )}
              {isFull && !isPast && (
                <Badge variant="destructive" className="text-[10px]">
                  Full
                </Badge>
              )}
              {rsvpStatus === 'going' && (
                <Badge className="text-[10px] bg-green-500 text-white">Going</Badge>
              )}
              {rsvpStatus === 'interested' && (
                <Badge className="text-[10px] bg-amber-500 text-white">Interested</Badge>
              )}
            </div>
          </div>

          {/* Event details */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.start_time)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(event.start_time)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {attendeeCount ?? event.rsvp_count}
              {event.max_attendees && `/${event.max_attendees}`}
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-normal">
              {event.category}
            </Badge>
            {event.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Recommendation reason */}
          {recommendationReason && !isPast && (
            <RecommendationReason reason={recommendationReason} />
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
