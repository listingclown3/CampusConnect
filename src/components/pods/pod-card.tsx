'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PodTypeBadge } from './pod-type-badge';
import { PodMeetingTime } from './pod-meeting-time';
import { getInitials, cn } from '@/lib/utils';
import { UsersRound, Check, Clock, Target, Zap } from 'lucide-react';
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
  tags?: string[];
  onJoin: () => void;
  onLeave: () => void;
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-amber-500 to-yellow-500';
  return 'from-orange-500 to-red-400';
}

function getPodTypeDescription(type: PodType): string {
  switch (type) {
    case 'study': return 'Focused on collaborative learning and exam prep';
    case 'project': return 'Working together on assignments and projects';
    case 'career': return 'Professional development and networking';
    case 'interest': return 'Connecting over shared passions and hobbies';
    case 'event': return 'Organized around an upcoming event';
    case 'major_switch': return 'Supporting students exploring new majors';
    default: return '';
  }
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
  tags,
  onJoin,
  onLeave,
}: PodCardProps) {
  const spotsLeft = maxMembers - members.length;
  const fillPercentage = (members.length / maxMembers) * 100;

  return (
    <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 group overflow-hidden h-full flex flex-col">
      {/* Score gradient bar */}
      <div className={cn('h-1.5 w-full bg-gradient-to-r', getScoreGradient(score))} />

      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/pods/${podId}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {getPodTypeDescription(podType)}
            </p>
          </Link>
          <div className="flex items-center gap-1.5 shrink-0">
            <PodTypeBadge type={podType} />
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-l-2 border-primary/20 pl-2.5">
            {description}
          </p>
        )}

        {/* Shared goal / why this pod matches */}
        {sharedGoal && (
          <div className="flex items-center gap-1.5 text-xs">
            <Target className="w-3 h-3 text-primary shrink-0" />
            <span className="text-primary/80 font-medium truncate">{sharedGoal}</span>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-normal px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Member section with capacity bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member) => (
                <Avatar key={member.user_id} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-[10px] font-medium">
                    {getInitials(`${member.first_name} ${member.last_name}`)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {members.length > 4 && (
                <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                  <span className="text-[9px] font-medium text-muted-foreground">+{members.length - 4}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-medium">{members.length}/{maxMembers}</span>
              {spotsLeft > 0 && spotsLeft <= 2 && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  {spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left!
                </p>
              )}
            </div>
          </div>
          {/* Capacity bar */}
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all bg-gradient-to-r',
                fillPercentage >= 90 ? 'from-red-400 to-red-500' :
                fillPercentage >= 70 ? 'from-amber-400 to-amber-500' :
                'from-primary/60 to-primary'
              )}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Meeting time & score */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <PodMeetingTime meetingTimes={meetingTime} compact />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className={cn(
              'text-xs font-bold',
              score >= 80 ? 'text-green-600 dark:text-green-400' :
              score >= 60 ? 'text-amber-600 dark:text-amber-400' :
              'text-orange-600 dark:text-orange-400'
            )}>
              {score}% fit
            </span>
          </div>
        </div>

        {/* Action button */}
        <div>
          {isMember ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2.5 py-1 rounded-full">
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
              Full &mdash; Waitlist Coming Soon
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="w-full h-8 text-xs font-medium"
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
