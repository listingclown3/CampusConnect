import { describe, it, expect } from 'vitest';
import {
  filterBlockedUsers,
  canUserAccessConversation,
  generateMatchReasons,
} from '@/lib/matching/filters';
import type { Profile, Block, ConversationMember } from '@/types/database';

function makeProfile(userId: string, overrides: Partial<Profile> = {}): Profile {
  return {
    id: userId,
    user_id: userId,
    first_name: 'Test',
    last_name: 'User',
    display_name: 'Test U.',
    avatar_url: null,
    bio: null,
    student_type: 'freshman',
    major: 'Computer Science',
    intended_major: null,
    graduation_year: 2028,
    interests: ['coding'],
    skills: ['Python'],
    career_goals: ['engineer'],
    study_style: 'group',
    collaboration_style: 'adaptive',
    connection_types: ['study_buddies'],
    availability: {
      monday: { morning: true, afternoon: true, evening: false, late_night: false },
      tuesday: { morning: true, afternoon: true, evening: false, late_night: false },
      wednesday: { morning: true, afternoon: true, evening: false, late_night: false },
      thursday: { morning: true, afternoon: true, evening: false, late_night: false },
      friday: { morning: true, afternoon: true, evening: false, late_night: false },
      saturday: { morning: false, afternoon: false, evening: false, late_night: false },
      sunday: { morning: false, afternoon: false, evening: false, late_night: false },
    },
    linkedin_url: null,
    instagram_handle: null,
    is_visible: true,
    onboarding_complete: true,
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-08-01T00:00:00Z',
    ...overrides,
  };
}

describe('filterBlockedUsers', () => {
  it('removes profiles of users blocked by current user', () => {
    const profiles = [
      makeProfile('user-001'),
      makeProfile('user-002'),
      makeProfile('user-003'),
    ];

    const blocks: Block[] = [
      { id: 'block-1', blocker_id: 'current-user', blocked_user_id: 'user-002', created_at: '2024-08-01T00:00:00Z' },
    ];

    const filtered = filterBlockedUsers(profiles, blocks, 'current-user');
    expect(filtered).toHaveLength(2);
    expect(filtered.find((p) => p.user_id === 'user-002')).toBeUndefined();
  });

  it('removes profiles of users who blocked the current user', () => {
    const profiles = [
      makeProfile('user-001'),
      makeProfile('user-002'),
      makeProfile('user-003'),
    ];

    const blocks: Block[] = [
      { id: 'block-1', blocker_id: 'user-003', blocked_user_id: 'current-user', created_at: '2024-08-01T00:00:00Z' },
    ];

    const filtered = filterBlockedUsers(profiles, blocks, 'current-user');
    expect(filtered).toHaveLength(2);
    expect(filtered.find((p) => p.user_id === 'user-003')).toBeUndefined();
  });

  it('handles bidirectional blocks', () => {
    const profiles = [
      makeProfile('user-001'),
      makeProfile('user-002'),
    ];

    const blocks: Block[] = [
      { id: 'block-1', blocker_id: 'current-user', blocked_user_id: 'user-001', created_at: '2024-08-01T00:00:00Z' },
      { id: 'block-2', blocker_id: 'user-002', blocked_user_id: 'current-user', created_at: '2024-08-01T00:00:00Z' },
    ];

    const filtered = filterBlockedUsers(profiles, blocks, 'current-user');
    expect(filtered).toHaveLength(0);
  });

  it('returns all profiles when no blocks exist', () => {
    const profiles = [
      makeProfile('user-001'),
      makeProfile('user-002'),
    ];

    const filtered = filterBlockedUsers(profiles, [], 'current-user');
    expect(filtered).toHaveLength(2);
  });
});

describe('canUserAccessConversation', () => {
  it('returns true when user is a member', () => {
    const members: ConversationMember[] = [
      { id: 'cm-1', conversation_id: 'conv-1', user_id: 'user-001', joined_at: '2024-08-01T00:00:00Z', last_read_at: null, is_muted: false },
      { id: 'cm-2', conversation_id: 'conv-1', user_id: 'user-002', joined_at: '2024-08-01T00:00:00Z', last_read_at: null, is_muted: false },
    ];

    expect(canUserAccessConversation('user-001', members)).toBe(true);
  });

  it('returns false when user is not a member', () => {
    const members: ConversationMember[] = [
      { id: 'cm-1', conversation_id: 'conv-1', user_id: 'user-001', joined_at: '2024-08-01T00:00:00Z', last_read_at: null, is_muted: false },
    ];

    expect(canUserAccessConversation('user-999', members)).toBe(false);
  });

  it('returns false for empty member list', () => {
    expect(canUserAccessConversation('user-001', [])).toBe(false);
  });
});

describe('generateMatchReasons', () => {
  it('generates reasons for shared classes', () => {
    const profileA = makeProfile('a');
    const profileB = makeProfile('b');

    const reasons = generateMatchReasons(profileA, profileB, ['CS 46A']);
    expect(reasons.some((r) => r.includes('CS 46A'))).toBe(true);
  });

  it('generates reasons for multiple shared classes', () => {
    const profileA = makeProfile('a');
    const profileB = makeProfile('b');

    const reasons = generateMatchReasons(profileA, profileB, ['CS 46A', 'MATH 30']);
    expect(reasons.some((r) => r.includes('2 classes'))).toBe(true);
  });

  it('generates reason for same major', () => {
    const profileA = makeProfile('a', { major: 'Computer Science' });
    const profileB = makeProfile('b', { major: 'Computer Science' });

    const reasons = generateMatchReasons(profileA, profileB, []);
    expect(reasons.some((r) => r.includes('Computer Science'))).toBe(true);
  });

  it('generates reasons for shared interests', () => {
    const profileA = makeProfile('a', { interests: ['AI', 'web development'] });
    const profileB = makeProfile('b', { interests: ['AI', 'gaming'] });

    const reasons = generateMatchReasons(profileA, profileB, []);
    expect(reasons.some((r) => r.toLowerCase().includes('ai'))).toBe(true);
  });

  it('generates reasons for same study style', () => {
    const profileA = makeProfile('a', { study_style: 'group' });
    const profileB = makeProfile('b', { study_style: 'group' });

    const reasons = generateMatchReasons(profileA, profileB, []);
    expect(reasons.some((r) => r.includes('group'))).toBe(true);
  });

  it('generates reasons for shared connection types', () => {
    const profileA = makeProfile('a', { connection_types: ['study_buddies', 'friends'] });
    const profileB = makeProfile('b', { connection_types: ['study_buddies', 'career_networking'] });

    const reasons = generateMatchReasons(profileA, profileB, []);
    expect(reasons.some((r) => r.includes('study partners'))).toBe(true);
  });
});
