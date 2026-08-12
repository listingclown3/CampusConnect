'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import type { Profile } from '@/types/database';

interface PodMemberInfo {
  profile: Profile;
  contribution?: string;
}

interface PodMembersListProps {
  members: PodMemberInfo[];
}

export function PodMembersList({ members }: PodMembersListProps) {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No members yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.profile.user_id}
          className="flex items-center gap-3"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {getInitials(`${member.profile.first_name} ${member.profile.last_name}`)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {member.profile.first_name} {member.profile.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {member.profile.major}
              {member.contribution && (
                <span className="ml-1.5 text-primary/80">
                  &middot; {member.contribution}
                </span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
