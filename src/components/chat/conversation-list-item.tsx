'use client';

import Link from 'next/link';
import { User, Users, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, truncate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ConversationType } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListItemProps {
  id: string;
  type: ConversationType;
  name: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

function getTypeIcon(type: ConversationType) {
  switch (type) {
    case 'direct':
      return <User className="h-3.5 w-3.5" />;
    case 'pod':
    case 'group':
      return <Users className="h-3.5 w-3.5" />;
    case 'event':
      return <Calendar className="h-3.5 w-3.5" />;
    default:
      return <User className="h-3.5 w-3.5" />;
  }
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return formatDistanceToNow(date, { addSuffix: false })
      .replace('about ', '')
      .replace('less than a minute', 'now');
  }
  if (diffDays === 1) return '1d';
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

export function ConversationListItem({
  id,
  type,
  name,
  lastMessage,
  lastMessageTime,
  unreadCount,
}: ConversationListItemProps) {
  const hasUnread = unreadCount > 0;

  return (
    <Link
      href={`/chat/${id}`}
      className={cn(
        'flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors rounded-lg',
        hasUnread && 'bg-primary/[0.03]'
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12">
          <AvatarFallback
            className={cn(
              'text-sm font-semibold',
              type === 'direct'
                ? 'bg-primary/10 text-primary'
                : type === 'pod' || type === 'group'
                  ? 'bg-[#E5A823]/10 text-[#E5A823]'
                  : 'bg-emerald-500/10 text-emerald-600'
            )}
          >
            {type === 'direct' ? getInitials(name) : getTypeIcon(type)}
          </AvatarFallback>
        </Avatar>
        {/* Type indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5">
          <div
            className={cn(
              'rounded-full p-0.5',
              type === 'direct'
                ? 'text-primary'
                : type === 'pod' || type === 'group'
                  ? 'text-[#E5A823]'
                  : 'text-emerald-600'
            )}
          >
            {getTypeIcon(type)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'text-sm truncate',
              hasUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground'
            )}
          >
            {name}
          </span>
          {lastMessageTime && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatTimestamp(lastMessageTime)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span
            className={cn(
              'text-xs truncate',
              hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {lastMessage ? truncate(lastMessage, 50) : 'No messages yet'}
          </span>
          {hasUnread && (
            <span className="shrink-0 flex items-center justify-center h-5 min-w-5 rounded-full bg-[#0055A2] text-white text-[10px] font-bold px-1.5">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
