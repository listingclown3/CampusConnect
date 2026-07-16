'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import type { Profile } from '@/types/database';

interface AttendeeInfo {
  profile: Profile;
  isMatch?: boolean;
  isPodMember?: boolean;
}

interface AttendeeListProps {
  attendees: AttendeeInfo[];
  maxDisplay?: number;
}

export function AttendeeList({ attendees, maxDisplay = 10 }: AttendeeListProps) {
  const displayAttendees = attendees.slice(0, maxDisplay);
  const remaining = attendees.length - maxDisplay;

  if (attendees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No one has RSVP&apos;d as going yet. Be the first!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {displayAttendees.map((attendee) => (
        <div
          key={attendee.profile.user_id}
          className="flex items-center gap-3 py-1.5"
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(`${attendee.profile.first_name} ${attendee.profile.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-sm font-medium truncate">
              {attendee.profile.first_name} {attendee.profile.last_name}
            </span>
            {attendee.isMatch && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                Your Match
              </Badge>
            )}
            {attendee.isPodMember && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                Pod Member
              </Badge>
            )}
          </div>
        </div>
      ))}
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground pl-11">
          +{remaining} more attending
        </p>
      )}
    </div>
  );
}
