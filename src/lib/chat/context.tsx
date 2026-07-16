'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Conversation, Message, ConversationMember } from '@/types/database';
import { useAuth } from '@/lib/auth/context';
import {
  getUserConversations,
  getConversationMessages,
  getConversationMembersList,
  getConversationById,
  sendMessage as sendMessageToStore,
  createDirectConversation,
  leaveConversation as leaveConversationFromStore,
  markConversationRead,
  getUnreadCount,
  getLastMessage,
  isUserMember,
  isBlocked,
  getOtherUserInDirect,
  subscribeToConversation,
  unsubscribeFromConversation,
} from './realtime';

// ============================================================
// Types
// ============================================================

export interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeMessages: Message[];
  activeMembers: ConversationMember[];
  isSending: boolean;
  isLoading: boolean;
  totalUnread: number;
  refreshConversations: () => void;
  setActiveConversation: (conversationId: string | null) => void;
  sendMessage: (content: string) => void;
  createOrFindDirectChat: (otherUserId: string) => Conversation;
  leaveConversation: (conversationId: string) => void;
  getUnreadForConversation: (conversationId: string) => number;
  getLastMessageForConversation: (conversationId: string) => Message | null;
  canAccessConversation: (conversationId: string) => boolean;
  isUserBlocked: (otherUserId: string) => boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeMembers, setActiveMembers] = useState<ConversationMember[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.user_id || '';

  // Load conversations
  const refreshConversations = useCallback(() => {
    if (!userId) return;
    const convos = getUserConversations(userId);
    setConversations(convos);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // Set active conversation
  const setActiveConversation = useCallback(
    (conversationId: string | null) => {
      if (!conversationId) {
        setActiveConversationState(null);
        setActiveMessages([]);
        setActiveMembers([]);
        return;
      }

      const conv = getConversationById(conversationId);
      setActiveConversationState(conv);

      if (conv) {
        const messages = getConversationMessages(conversationId);
        setActiveMessages(messages);
        const members = getConversationMembersList(conversationId);
        setActiveMembers(members);
        // Mark as read
        if (userId) {
          markConversationRead(conversationId, userId);
        }
        // Subscribe to real-time updates
        subscribeToConversation(conversationId, (newMessage) => {
          setActiveMessages((prev) => [...prev, newMessage]);
        });
      }
    },
    [userId]
  );

  // Unsubscribe when active conversation changes
  useEffect(() => {
    return () => {
      if (activeConversation) {
        unsubscribeFromConversation(activeConversation.id);
      }
    };
  }, [activeConversation]);

  // Send message
  const sendMessage = useCallback(
    (content: string) => {
      if (!activeConversation || !userId || !content.trim()) return;

      setIsSending(true);
      try {
        const newMessage = sendMessageToStore(
          activeConversation.id,
          userId,
          content.trim()
        );
        // Optimistic update
        setActiveMessages((prev) => [...prev, newMessage]);
        // Refresh conversations to update order
        refreshConversations();
      } finally {
        setIsSending(false);
      }
    },
    [activeConversation, userId, refreshConversations]
  );

  // Create or find direct chat
  const createOrFindDirectChat = useCallback(
    (otherUserId: string): Conversation => {
      const conv = createDirectConversation(userId, otherUserId);
      refreshConversations();
      return conv;
    },
    [userId, refreshConversations]
  );

  // Leave conversation
  const leaveConversation = useCallback(
    (conversationId: string) => {
      leaveConversationFromStore(conversationId, userId);
      if (activeConversation?.id === conversationId) {
        setActiveConversationState(null);
        setActiveMessages([]);
        setActiveMembers([]);
      }
      refreshConversations();
    },
    [userId, activeConversation, refreshConversations]
  );

  // Unread count for a conversation
  const getUnreadForConversation = useCallback(
    (conversationId: string): number => {
      if (!userId) return 0;
      return getUnreadCount(conversationId, userId);
    },
    [userId]
  );

  // Last message for a conversation
  const getLastMessageForConversation = useCallback(
    (conversationId: string): Message | null => {
      return getLastMessage(conversationId);
    },
    []
  );

  // Access check
  const canAccessConversation = useCallback(
    (conversationId: string): boolean => {
      if (!userId) return false;
      return isUserMember(conversationId, userId);
    },
    [userId]
  );

  // Block check
  const isUserBlocked = useCallback(
    (otherUserId: string): boolean => {
      if (!userId) return false;
      return isBlocked(userId, otherUserId);
    },
    [userId]
  );

  // Total unread
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + getUnreadForConversation(conv.id),
    0
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        activeMessages,
        activeMembers,
        isSending,
        isLoading,
        totalUnread,
        refreshConversations,
        setActiveConversation,
        sendMessage,
        createOrFindDirectChat,
        leaveConversation,
        getUnreadForConversation,
        getLastMessageForConversation,
        canAccessConversation,
        isUserBlocked,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
