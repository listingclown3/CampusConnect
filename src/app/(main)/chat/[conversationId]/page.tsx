'use client';

import { useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useChat } from '@/lib/chat/context';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageBubble } from '@/components/chat/message-bubble';
import { MessageInput } from '@/components/chat/message-input';
import { DateSeparator } from '@/components/chat/date-separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ChatRoomPage({ params }: PageProps) {
  const { conversationId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const {
    activeConversation,
    activeMessages,
    activeMembers,
    isSending,
    setActiveConversation,
    sendMessage,
    leaveConversation,
    canAccessConversation,
    getOtherUserId,
    getDisplayName,
    isUserBlocked,
    blockUser,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation
  useEffect(() => {
    setActiveConversation(conversationId);
    return () => {
      setActiveConversation(null);
    };
  }, [conversationId, setActiveConversation]);

  // Check if blocked (for direct chats)
  const directOtherUserId =
    activeConversation?.type === 'direct' ? getOtherUserId(conversationId) : null;
  const blocked = !!directOtherUserId && isUserBlocked(directOtherUserId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const userId = user?.user_id || '';

  // Access denied
  if (!canAccessConversation(conversationId)) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          You are not a member of this conversation. You may have been removed or the conversation does not exist.
        </p>
        <Button variant="outline" onClick={() => router.push('/chat')}>
          Back to Messages
        </Button>
      </div>
    );
  }

  if (!activeConversation) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Determine conversation title
  let conversationTitle = activeConversation.name || 'Conversation';
  if (activeConversation.type === 'direct') {
    const otherUserId = getOtherUserId(conversationId);
    if (otherUserId) {
      conversationTitle = getDisplayName(otherUserId) || conversationTitle;
    }
  }

  const isGroup =
    activeConversation.type === 'pod' ||
    activeConversation.type === 'event' ||
    activeConversation.type === 'group';

  const memberCount = activeMembers.length;

  // Group messages by date
  const messagesWithDates: Array<{ type: 'date'; date: string } | { type: 'message'; message: typeof activeMessages[0] }> = [];
  let lastDate = '';

  for (const msg of activeMessages) {
    const msgDate = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (msgDate !== lastDate) {
      messagesWithDates.push({ type: 'date', date: msg.created_at });
      lastDate = msgDate;
    }
    messagesWithDates.push({ type: 'message', message: msg });
  }

  const handleLeave = () => {
    leaveConversation(conversationId);
    router.push('/chat');
  };

  const handleBlock = () => {
    if (activeConversation.type === 'direct' && directOtherUserId) {
      blockUser(directOtherUserId);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <ChatHeader
        title={conversationTitle}
        type={activeConversation.type}
        memberCount={memberCount}
        onLeave={handleLeave}
        onBlock={handleBlock}
        showBlockOption={activeConversation.type === 'direct'}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {activeMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <p className="text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messagesWithDates.map((item, index) => {
              if (item.type === 'date') {
                return <DateSeparator key={`date-${index}`} date={item.date} />;
              }
              const msg = item.message;
              const isOwn = msg.sender_id === userId;
              return (
                <MessageBubble
                  key={msg.id}
                  content={msg.content}
                  timestamp={msg.created_at}
                  isOwn={isOwn}
                  senderName={!isOwn ? getDisplayName(msg.sender_id) : undefined}
                  showSenderInfo={isGroup}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      {blocked ? (
        <div className="border-t p-4 text-center">
          <p className="text-sm text-muted-foreground">
            You cannot send messages in this conversation. The user has been blocked.
          </p>
        </div>
      ) : (
        <MessageInput
          onSend={sendMessage}
          disabled={isSending}
          placeholder={isGroup ? 'Message the group...' : 'Type a message...'}
        />
      )}
    </div>
  );
}
