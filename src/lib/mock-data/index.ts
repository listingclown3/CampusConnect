import { mockStudents, studentClassMap } from './students';
import { mockClasses } from './classes';
import { mockClubs } from './clubs';
import { mockEvents } from './events';
import { mockPods, mockPodMembers } from './pods';
import {
  mockConversations,
  mockConversationMembers,
  mockMessages,
} from './conversations';
import type {
  Profile,
  Class,
  Club,
  Event,
  Pod,
  PodMember,
  Conversation,
  ConversationMember,
  Message,
} from '@/types/database';

// Re-export all mock data
export {
  mockStudents,
  studentClassMap,
  mockClasses,
  mockClubs,
  mockEvents,
  mockPods,
  mockPodMembers,
  mockConversations,
  mockConversationMembers,
  mockMessages,
};

// Getter functions for data access
export function getStudents(): Profile[] {
  return mockStudents;
}

export function getStudentById(id: string): Profile | undefined {
  return mockStudents.find((s) => s.user_id === id || s.id === id);
}

export function getStudentsByIds(ids: string[]): Profile[] {
  return mockStudents.filter(
    (s) => ids.includes(s.user_id) || ids.includes(s.id)
  );
}

export function getClasses(): Class[] {
  return mockClasses;
}

export function getClassById(id: string): Class | undefined {
  return mockClasses.find((c) => c.id === id);
}

export function getClassesByIds(ids: string[]): Class[] {
  return mockClasses.filter((c) => ids.includes(c.id));
}

export function getClubs(): Club[] {
  return mockClubs;
}

export function getClubById(id: string): Club | undefined {
  return mockClubs.find((c) => c.id === id);
}

export function getEvents(): Event[] {
  return mockEvents;
}

export function getEventById(id: string): Event | undefined {
  return mockEvents.find((e) => e.id === id);
}

export function getPods(): Pod[] {
  return mockPods;
}

export function getPodById(id: string): Pod | undefined {
  return mockPods.find((p) => p.id === id);
}

export function getPodMembers(podId: string): PodMember[] {
  return mockPodMembers.filter((pm) => pm.pod_id === podId);
}

export function getUserPods(userId: string): Pod[] {
  const memberPodIds = mockPodMembers
    .filter((pm) => pm.user_id === userId)
    .map((pm) => pm.pod_id);
  return mockPods.filter((p) => memberPodIds.includes(p.id));
}

export function getConversations(): Conversation[] {
  return mockConversations;
}

export function getUserConversations(userId: string): Conversation[] {
  const memberConvIds = mockConversationMembers
    .filter((cm) => cm.user_id === userId)
    .map((cm) => cm.conversation_id);
  return mockConversations.filter((c) => memberConvIds.includes(c.id));
}

export function getConversationMembers(
  conversationId: string
): ConversationMember[] {
  return mockConversationMembers.filter(
    (cm) => cm.conversation_id === conversationId
  );
}

export function getMessages(conversationId: string): Message[] {
  return mockMessages
    .filter((m) => m.conversation_id === conversationId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

export function getStudentClasses(userId: string): Class[] {
  const classIds = studentClassMap[userId] ?? [];
  return mockClasses.filter((c) => classIds.includes(c.id));
}

export function getStudentClassIds(userId: string): string[] {
  return studentClassMap[userId] ?? [];
}
