'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PodTypeBadge } from './pod-type-badge';
import { PodMeetingTime } from './pod-meeting-time';
import { getInitials, cn } from '@/lib/utils';
import { UsersRound, Check } from 'lucide-react';
import type { PodType, Profile, DayOfWeek, TimeSlot } from '@/types/database';

interface TimeSlotInfo {
  day: DayOfWeek;
  slot: TimeSlot;
}

interface PodCardProps {
  podId: string;
  name: string;
  podType: PodType;
  description: string | null;
  members: Profile[];
  maxMembers: number;
  score: number;
  sharedGoal?: string;
  meetingTime: TimeSlotInfo[];
  isMember: boolean;
  isFull: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export function PodCard({
  podId,
  name,
  podType,
  description,
  members,
  maxMembers,
  score,
  sharedGoal,
  meetingTime,
  isMember,
  isFull,
  onJoin,
  onLeave,
}: PodCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/pods/${podId}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <PodTypeBadge type={podType} />
            <div
              className={cn(
                'text-xs font-bold px-2 py-0.5 rounded-full',
                score >= 80
                  ? 'bg-green-100 text-green-700'
                  : score >= 60
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-orange-100 text-orange-700'
              )}
            >
              {score}%
            </div>
          </div>
        </div>

        {/* Description snippet */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Shared goal */}
        {sharedGoal && (
          <p className="text-xs text-primary/80 font-medium">
            {sharedGoal}
          </p>
        )}

        {/* Member avatars stack */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((member) => (
                <Avatar key={member.user_id} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                    {getInitials(`${member.first_name} ${member.last_name}`)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <UsersRound className="w-3 h-3" />
              {members.length}/{maxMembers}
            </span>
          </div>
          <PodMeetingTime meetingTimes={meetingTime} compact />
        </div>

        {/* Action button */}
        <div className="pt-1">
          {isMember ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                <Check className="w-3.5 h-3.5" />
                Joined
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive ml-auto h-7"
                onClick={(e) => {
                  e.preventDefault();
                  onLeave();
                }}
              >
                Leave
              </Button>
            </div>
          ) : isFull ? (
            <Button variant="secondary" size="sm" className="w-full h-8 text-xs" disabled>
              Full
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="w-full h-8 text-xs"
              onClick={(e) => {
                e.preventDefault();
                onJoin();
              }}
            >
              Join Pod
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
