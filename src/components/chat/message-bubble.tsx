'use client';

import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
  showSenderInfo?: boolean;
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  senderName,
  showSenderInfo = false,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        'flex gap-2 max-w-[85%] group',
        isOwn ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar for other users in group chats */}
      {!isOwn && showSenderInfo && (
        <Avatar className="h-7 w-7 mt-1 shrink-0">
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
            {senderName ? getInitials(senderName) : '?'}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        {/* Sender name in group chats */}
        {!isOwn && showSenderInfo && senderName && (
          <span className="text-[11px] text-muted-foreground font-medium mb-0.5 px-1">
            {senderName}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words',
            isOwn
              ? 'bg-[#0055A2] text-white rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          )}
        >
          {content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {format(new Date(timestamp), 'h:mm a')}
        </span>
      </div>
    </div>
  );
}
