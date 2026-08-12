import type { Profile, Block, ConversationMember } from '@/types/database';

/**
 * Filter out profiles of users who have blocked the current user
 * or whom the current user has blocked.
 */
export function filterBlockedUsers(
  profiles: Profile[],
  blocks: Block[],
  currentUserId: string
): Profile[] {
  // Get IDs of users blocked by current user
  const blockedByMe = new Set(
    blocks
      .filter((b) => b.blocker_id === currentUserId)
      .map((b) => b.blocked_user_id)
  );

  // Get IDs of users who blocked current user
  const blockedMe = new Set(
    blocks
      .filter((b) => b.blocked_user_id === currentUserId)
      .map((b) => b.blocker_id)
  );

  return profiles.filter(
    (p) => !blockedByMe.has(p.user_id) && !blockedMe.has(p.user_id)
  );
}

/**
 * Check if a user can access a conversation.
 * User must be a member of the conversation.
 */
export function canUserAccessConversation(
  userId: string,
  conversationMembers: ConversationMember[]
): boolean {
  return conversationMembers.some((cm) => cm.user_id === userId);
}

/**
 * Generate human-readable match reasons from a match breakdown and profile data.
 */
export function generateMatchReasons(
  profileA: Profile,
  profileB: Profile,
  sharedClassNames: string[]
): string[] {
  const reasons: string[] = [];

  // Shared classes
  if (sharedClassNames.length > 0) {
    if (sharedClassNames.length === 1) {
      reasons.push(`Both taking ${sharedClassNames[0]}`);
    } else {
      reasons.push(
        `Share ${sharedClassNames.length} classes: ${sharedClassNames.slice(0, 2).join(', ')}${sharedClassNames.length > 2 ? ', and more' : ''}`
      );
    }
  }

  // Same or related major
  if (profileA.major === profileB.major) {
    reasons.push(`Both ${profileA.major} majors`);
  }

  // Shared interests
  const sharedInterests = profileA.interests.filter((i) =>
    profileB.interests.some(
      (bi) => bi.toLowerCase() === i.toLowerCase()
    )
  );
  if (sharedInterests.length > 0) {
    reasons.push(
      `Common interests: ${sharedInterests.slice(0, 3).join(', ')}`
    );
  }

  // Study style
  if (profileA.study_style === profileB.study_style) {
    reasons.push(`Both prefer ${profileA.study_style} study style`);
  }

  // Connection type overlap
  const sharedConnectionTypes = profileA.connection_types.filter((ct) =>
    profileB.connection_types.includes(ct)
  );
  if (sharedConnectionTypes.length > 0) {
    const typeLabels: Record<string, string> = {
      friends: 'making friends',
      study_buddies: 'study partners',
      project_partners: 'project collaborators',
      club_buddies: 'club companions',
      commute_buddies: 'commute partners',
      career_networking: 'career networking',
    };
    const labels = sharedConnectionTypes
      .slice(0, 2)
      .map((ct) => typeLabels[ct] ?? ct);
    reasons.push(`Both looking for ${labels.join(' and ')}`);
  }

  return reasons;
}
