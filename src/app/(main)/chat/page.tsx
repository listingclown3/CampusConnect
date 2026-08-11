'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useChat } from '@/lib/chat/context';
import { ConversationListItem } from '@/components/chat/conversation-list-item';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    conversations,
    isLoading,
    getUnreadForConversation,
    getLastMessageForConversation,
    getOtherUserId,
    getDisplayName,
    createOrFindDirectChat,
  } = useChat();

  // "Message" buttons elsewhere (e.g. the match-detail page's conversation
  // starter) link here as /chat?user=<id> — this used to be a dead end since
  // nothing read the param. Create/find that direct conversation and hop
  // straight into it.
  const targetUserId = searchParams.get('user');
  const [isStartingChat, setIsStartingChat] = useState(!!targetUserId);
  const startedForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!targetUserId || startedForRef.current === targetUserId) return;
    startedForRef.current = targetUserId;
    setIsStartingChat(true);
    createOrFindDirectChat(targetUserId)
      .then((conv) => router.replace(`/chat/${conv.id}`))
      .catch(() => setIsStartingChat(false));
  }, [targetUserId, createOrFindDirectChat, router]);

  if (isStartingChat) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>

      {/* Conversation list */}
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No conversations yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Start chatting by connecting with your matches or joining a study pod!
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {conversations.map((conv) => {
            const lastMessage = getLastMessageForConversation(conv.id);
            const unread = getUnreadForConversation(conv.id);

            // Determine display name
            let displayName = conv.name || 'Conversation';
            if (conv.type === 'direct') {
              const otherUserId = getOtherUserId(conv.id);
              if (otherUserId) {
                displayName = getDisplayName(otherUserId) || displayName;
              }
            }

            return (
              <ConversationListItem
                key={conv.id}
                id={conv.id}
                type={conv.type}
                name={displayName}
                lastMessage={lastMessage?.content || null}
                lastMessageTime={lastMessage?.created_at || conv.last_message_at || null}
                unreadCount={unread}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
