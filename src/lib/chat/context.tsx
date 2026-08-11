'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { Conversation, Message, ConversationMember } from '@/types/database';
import { useAuth } from '@/lib/auth/context';
import {
  getUserConversations,
  getConversationMessages,
  getConversationMembersList,
  getConversationById,
  getMembersForConversations,
  getMessagesForConversations,
  getDisplayNamesForUsers,
  getOtherUserInDirectFromMembers,
  sendMessage as sendMessageToStore,
  createDirectConversation,
  leaveConversation as leaveConversationFromStore,
  markConversationRead,
  getBlocks,
  addBlock,
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
  createOrFindDirectChat: (otherUserId: string) => Promise<Conversation>;
  leaveConversation: (conversationId: string) => void;
  getUnreadForConversation: (conversationId: string) => number;
  getLastMessageForConversation: (conversationId: string) => Message | null;
  canAccessConversation: (conversationId: string) => boolean;
  isUserBlocked: (otherUserId: string) => boolean;
  blockUser: (otherUserId: string) => void;
  /** The other participant's id in a direct conversation, from the preloaded
   * member cache — synchronous so list/detail views can render without a
   * per-row fetch. */
  getOtherUserId: (conversationId: string) => string | null;
  /** Display name from the preloaded profile-name cache. Empty string until
   * the batch fetch resolves (first render tick). */
  getDisplayName: (userId: string) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export function ChatProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [membersByConversation, setMembersByConversation] = useState<Record<string, ConversationMember[]>>({});
  const [lastMessageByConversation, setLastMessageByConversation] = useState<Record<string, Message | null>>({});
  const [unreadByConversation, setUnreadByConversation] = useState<Record<string, number>>({});
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());

  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeMembers, setActiveMembers] = useState<ConversationMember[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activeConversationIdRef = useRef<string | null>(null);

  const refreshConversations = useCallback(async () => {
    if (!userId) {
      setConversations([]);
      setMembersByConversation({});
      setLastMessageByConversation({});
      setUnreadByConversation({});
      return;
    }

    const convos = await getUserConversations(userId);
    setConversations(convos);
    const convIds = convos.map((c) => c.id);

    const [members, messages, blocks] = await Promise.all([
      getMembersForConversations(convIds),
      getMessagesForConversations(convIds),
      getBlocks(userId),
    ]);

    const membersMap: Record<string, ConversationMember[]> = {};
    for (const m of members) {
      (membersMap[m.conversation_id] ??= []).push(m);
    }
    setMembersByConversation(membersMap);
    setBlockedIds(new Set(blocks.map((b) => b.blocked_user_id)));

    const lastMsgMap: Record<string, Message | null> = {};
    const unreadMap: Record<string, number> = {};
    for (const convId of convIds) {
      const convMessages = messages.filter((m) => m.conversation_id === convId);
      lastMsgMap[convId] = convMessages.length > 0 ? convMessages[convMessages.length - 1] : null;
      const myMembership = membersMap[convId]?.find((m) => m.user_id === userId);
      const lastRead = myMembership?.last_read_at ? new Date(myMembership.last_read_at).getTime() : 0;
      unreadMap[convId] = convMessages.filter(
        (m) => m.sender_id !== userId && new Date(m.created_at).getTime() > lastRead
      ).length;
    }
    setLastMessageByConversation(lastMsgMap);
    setUnreadByConversation(unreadMap);

    const userIds = members.map((m) => m.user_id);
    const names = await getDisplayNamesForUsers(userIds);
    setDisplayNames((prev) => ({ ...prev, ...names }));
  }, [userId]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await refreshConversations();
      setIsLoading(false);
    };
    load();
  }, [refreshConversations]);

  const setActiveConversation = useCallback(
    (conversationId: string | null) => {
      activeConversationIdRef.current = conversationId;
      if (!conversationId) {
        setActiveConversationState(null);
        setActiveMessages([]);
        setActiveMembers([]);
        return;
      }

      (async () => {
        const [conv, messages, members] = await Promise.all([
          getConversationById(conversationId),
          getConversationMessages(conversationId),
          getConversationMembersList(conversationId),
        ]);
        // Bail if the user navigated away before this resolved.
        if (activeConversationIdRef.current !== conversationId) return;

        setActiveConversationState(conv);
        setActiveMessages(messages);
        setActiveMembers(members);
        setMembersByConversation((prev) => ({ ...prev, [conversationId]: members }));

        const names = await getDisplayNamesForUsers(members.map((m) => m.user_id));
        setDisplayNames((prev) => ({ ...prev, ...names }));

        if (userId) {
          await markConversationRead(conversationId, userId);
          setUnreadByConversation((prev) => ({ ...prev, [conversationId]: 0 }));
        }

        subscribeToConversation(conversationId, (newMessage) => {
          setActiveMessages((prev) => [...prev, newMessage]);
        });
      })();
    },
    [userId]
  );

  useEffect(() => {
    return () => {
      if (activeConversation) {
        unsubscribeFromConversation(activeConversation.id);
      }
    };
  }, [activeConversation]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!activeConversation || !userId || !content.trim()) return;

      setIsSending(true);
      (async () => {
        try {
          const newMessage = await sendMessageToStore(activeConversation.id, userId, content.trim());
          setActiveMessages((prev) => [...prev, newMessage]);
          await refreshConversations();
        } finally {
          setIsSending(false);
        }
      })();
    },
    [activeConversation, userId, refreshConversations]
  );

  const createOrFindDirectChat = useCallback(
    async (otherUserId: string): Promise<Conversation> => {
      const conv = await createDirectConversation(userId!, otherUserId);
      await refreshConversations();
      return conv;
    },
    [userId, refreshConversations]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (!userId) return;
      (async () => {
        await leaveConversationFromStore(conversationId, userId);
        if (activeConversation?.id === conversationId) {
          setActiveConversationState(null);
          setActiveMessages([]);
          setActiveMembers([]);
        }
        await refreshConversations();
      })();
    },
    [userId, activeConversation, refreshConversations]
  );

  const getUnreadForConversation = useCallback(
    (conversationId: string): number => unreadByConversation[conversationId] ?? 0,
    [unreadByConversation]
  );

  const getLastMessageForConversation = useCallback(
    (conversationId: string): Message | null => lastMessageByConversation[conversationId] ?? null,
    [lastMessageByConversation]
  );

  // RLS already scopes getUserConversations() to the caller's own
  // memberships, so "loaded into `conversations`" is exactly "has access".
  const canAccessConversation = useCallback(
    (conversationId: string): boolean => conversations.some((c) => c.id === conversationId),
    [conversations]
  );

  const isUserBlocked = useCallback(
    (otherUserId: string): boolean => blockedIds.has(otherUserId),
    [blockedIds]
  );

  const blockUser = useCallback(
    (otherUserId: string) => {
      if (!userId) return;
      setBlockedIds((prev) => new Set(prev).add(otherUserId));
      addBlock(userId, otherUserId);
    },
    [userId]
  );

  const getOtherUserId = useCallback(
    (conversationId: string): string | null => {
      if (!userId) return null;
      const members = membersByConversation[conversationId] ?? [];
      return getOtherUserInDirectFromMembers(members, userId);
    },
    [membersByConversation, userId]
  );

  const getDisplayName = useCallback(
    (userIdToLookUp: string): string => displayNames[userIdToLookUp] ?? '',
    [displayNames]
  );

  const totalUnread = conversations.reduce((sum, conv) => sum + getUnreadForConversation(conv.id), 0);

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
        refreshConversations: () => {
          refreshConversations();
        },
        setActiveConversation,
        sendMessage,
        createOrFindDirectChat,
        leaveConversation,
        getUnreadForConversation,
        getLastMessageForConversation,
        canAccessConversation,
        isUserBlocked,
        blockUser,
        getOtherUserId,
        getDisplayName,
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
