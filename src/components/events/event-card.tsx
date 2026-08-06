'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, Ticket, Zap } from 'lucide-react';
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

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Social: 'from-pink-500 to-rose-500',
    Workshop: 'from-blue-500 to-cyan-500',
    Competition: 'from-amber-500 to-orange-500',
    Career: 'from-green-500 to-emerald-500',
    Academic: 'from-indigo-500 to-violet-500',
    Showcase: 'from-purple-500 to-fuchsia-500',
    Panel: 'from-teal-500 to-green-500',
    'Info Session': 'from-sky-500 to-blue-500',
  };
  return map[category] || 'from-gray-500 to-slate-500';
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    Social: '🎉',
    Workshop: '🛠️',
    Competition: '🏆',
    Career: '💼',
    Academic: '📚',
    Showcase: '✨',
    Panel: '🎤',
    'Info Session': 'ℹ️',
  };
  return map[category] || '📅';
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
  const spotsLeft = event.max_attendees
    ? event.max_attendees - (attendeeCount ?? event.rsvp_count)
    : null;
  const fillPercentage = event.max_attendees
    ? ((attendeeCount ?? event.rsvp_count) / event.max_attendees) * 100
    : 0;

  return (
    <Link href={`/events/${event.id}`}>
      <Card
        className={cn(
          'hover:shadow-lg transition-all duration-200 cursor-pointer border group overflow-hidden h-full flex flex-col',
          isPast && 'opacity-60 hover:opacity-80'
        )}
      >
        {/* Category gradient bar */}
        <div className={cn('h-1.5 w-full bg-gradient-to-r', getCategoryColor(event.category))} />

        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{getCategoryEmoji(event.category)}</span>
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
              </div>
              {clubName && (
                <p className="text-xs text-muted-foreground">
                  Hosted by <span className="font-medium text-foreground/80">{clubName}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {isPast && (
                <Badge variant="secondary" className="text-[10px]">Past</Badge>
              )}
              {isFull && !isPast && (
                <Badge variant="destructive" className="text-[10px]">Full</Badge>
              )}
              {rsvpStatus === 'going' && (
                <Badge className="text-[10px] bg-green-500 text-white">Going</Badge>
              )}
              {rsvpStatus === 'interested' && (
                <Badge className="text-[10px] bg-amber-500 text-white">Interested</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Event details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
              <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{formatDate(event.start_time)}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{formatTime(event.start_time)}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
              <Users className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">
                {attendeeCount ?? event.rsvp_count}
                {event.max_attendees && `/${event.max_attendees}`}
              </span>
            </span>
          </div>

          {/* Capacity bar (when applicable) */}
          {event.max_attendees && !isPast && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all bg-gradient-to-r',
                    fillPercentage >= 90 ? 'from-red-400 to-red-500' :
                    fillPercentage >= 70 ? 'from-amber-400 to-amber-500' :
                    'from-primary/60 to-primary'
                  )}
                  style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                />
              </div>
              {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  Only {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left!
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap mt-auto pt-2">
            <Badge variant="outline" className="text-[10px] font-medium border-primary/30 text-primary">
              {event.category}
            </Badge>
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                {tag}
              </Badge>
            ))}
            {event.is_virtual && (
              <Badge className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                Virtual
              </Badge>
            )}
          </div>

          {/* Recommendation reason */}
          {recommendationReason && !isPast && (
            <div className="flex items-center gap-1.5 text-[11px] text-primary/80 font-medium bg-primary/5 px-2.5 py-1.5 rounded-md">
              <Zap className="w-3 h-3" />
              {recommendationReason}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
