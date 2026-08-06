'use client';

import Link from 'next/link';
import { Users, Calendar, MapPin, Heart, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Club } from '@/types/database';

interface ClubCardProps {
  club: Club;
  memberCount?: number;
  eventCount?: number;
}

function getCategoryGradient(category: string): string {
  const map: Record<string, string> = {
    Technology: 'from-blue-500 to-indigo-500',
    Business: 'from-emerald-500 to-teal-500',
    Design: 'from-pink-500 to-rose-500',
    Health: 'from-red-500 to-orange-500',
    Entertainment: 'from-purple-500 to-violet-500',
    Engineering: 'from-amber-500 to-yellow-500',
    Art: 'from-fuchsia-500 to-pink-500',
  };
  return map[category] || 'from-gray-500 to-slate-500';
}

function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    Technology: '💻',
    Business: '📊',
    Design: '🎨',
    Health: '🏥',
    Entertainment: '🎮',
    Engineering: '⚙️',
    Art: '🖌️',
  };
  return map[category] || '🏢';
}

export function ClubCard({ club, memberCount, eventCount }: ClubCardProps) {
  const displayMemberCount = memberCount ?? club.member_count;

  return (
    <Link href={`/clubs/${club.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border group overflow-hidden h-full flex flex-col">
        {/* Category gradient bar */}
        <div className={cn('h-1.5 w-full bg-gradient-to-r', getCategoryGradient(club.category))} />

        <CardContent className="p-4 space-y-3 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-lg shrink-0">
              {getCategoryIcon(club.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {club.name}
              </h3>
              <Badge variant="outline" className="text-[10px] font-normal mt-0.5">
                {club.category}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">
            {club.description}
          </p>

          {/* Tags */}
          {club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {club.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  {tag}
                </Badge>
              ))}
              {club.tags.length > 4 && (
                <span className="text-[10px] text-muted-foreground">+{club.tags.length - 4}</span>
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            {club.meeting_schedule && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
                <Calendar className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate">{club.meeting_schedule}</span>
              </span>
            )}
            {club.location && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-2 py-1.5 rounded-md">
                <MapPin className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate">{club.location}</span>
              </span>
            )}
          </div>

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground">{displayMemberCount}</span> members
              </span>
              {eventCount !== undefined && eventCount > 0 && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium text-foreground">{eventCount}</span> event{eventCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {club.instagram_handle && (
              <span className="flex items-center gap-1 text-pink-500">
                <Heart className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
