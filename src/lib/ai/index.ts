import type { Profile, Event, MatchBreakdown } from '@/types/database';

/**
 * NOTE: The OpenAI code path is intentionally unreachable in the current architecture.
 *
 * `isOpenAIConfigured()` reads `process.env.OPENAI_API_KEY`, which is a server-only
 * environment variable. Since all AI generation functions are called from client
 * components (match detail page, pod detail, event detail), `process.env.OPENAI_API_KEY`
 * will always be `undefined` in the browser bundle (Next.js only exposes env vars
 * prefixed with `NEXT_PUBLIC_` to the client).
 *
 * This is by design for the MVP: the template-based fallbacks produce deterministic,
 * data-driven text that is sufficient for the demo. To enable real OpenAI generation,
 * these functions would need to be called via an API route (e.g., /api/ai/generate)
 * that runs server-side where the env var is accessible.
 */
function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Generate a human-readable explanation of why two profiles matched.
 * Falls back to template-based text when OpenAI is not configured.
 */
export async function generateMatchExplanation(
  profileA: Profile,
  profileB: Profile,
  breakdown: MatchBreakdown,
  sharedClassNames: string[]
): Promise<string> {
  if (isOpenAIConfigured()) {
    // TODO: Call OpenAI API
    // For now, use template fallback
  }

  // Template-based fallback
  const parts: string[] = [];

  if (sharedClassNames.length > 0) {
    parts.push(
      `You and ${profileB.first_name} are both enrolled in ${sharedClassNames.join(' and ')}`
    );
  }

  if (breakdown.same_or_related_major === 20) {
    parts.push(`you share the same major in ${profileA.major}`);
  } else if (breakdown.same_or_related_major === 10) {
    parts.push(
      `your majors (${profileA.major} and ${profileB.major}) are closely related`
    );
  }

  const sharedInterests = profileA.interests.filter((i) =>
    profileB.interests.some((bi) => bi.toLowerCase() === i.toLowerCase())
  );
  if (sharedInterests.length > 0) {
    parts.push(
      `you both have interests in ${sharedInterests.slice(0, 3).join(', ')}`
    );
  }

  if (breakdown.availability_overlap >= 11) {
    parts.push('your schedules align well for meeting up');
  }

  if (breakdown.complementary_skills >= 7) {
    parts.push('you have complementary skills that could benefit each other');
  }

  if (parts.length === 0) {
    return `${profileB.first_name} could be a great connection based on your profiles.`;
  }

  // Capitalize first letter and join
  const firstPart = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  if (parts.length === 1) {
    return `${firstPart}.`;
  }

  return `${firstPart}, ${parts.slice(1).join(', and ')}.`;
}

/**
 * Generate a conversation starter suggestion for two matched users.
 * Falls back to template-based text when OpenAI is not configured.
 */
export async function generateConversationStarter(
  profileA: Profile,
  profileB: Profile,
  sharedClassNames: string[]
): Promise<string> {
  if (isOpenAIConfigured()) {
    // TODO: Call OpenAI API
  }

  // Template-based fallback
  if (sharedClassNames.length > 0) {
    return `Hey ${profileB.first_name}! I noticed we're both in ${sharedClassNames[0]}. How are you finding the class so far?`;
  }

  const sharedInterests = profileA.interests.filter((i) =>
    profileB.interests.some((bi) => bi.toLowerCase() === i.toLowerCase())
  );

  if (sharedInterests.length > 0) {
    return `Hey ${profileB.first_name}! I saw you're into ${sharedInterests[0]} too. Have you worked on any projects related to that?`;
  }

  if (profileA.major === profileB.major) {
    return `Hey ${profileB.first_name}! Fellow ${profileA.major} major here. How's your semester going so far?`;
  }

  return `Hey ${profileB.first_name}! I'd love to connect and learn more about your experience at SJSU.`;
}

/**
 * Generate an explanation for why a pod was formed.
 * Falls back to template-based text when OpenAI is not configured.
 */
export async function generatePodExplanation(
  members: Profile[],
  podType: string,
  sharedClassNames: string[]
): Promise<string> {
  if (isOpenAIConfigured()) {
    // TODO: Call OpenAI API
  }

  // Template-based fallback
  const names = members.map((m) => m.first_name);
  const nameList =
    names.length <= 2
      ? names.join(' and ')
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;

  const parts: string[] = [];

  if (sharedClassNames.length > 0) {
    parts.push(`all enrolled in ${sharedClassNames.join(' and ')}`);
  }

  const allInterests = members.map((m) =>
    m.interests.map((i) => i.toLowerCase())
  );
  const commonInterests: string[] = [];
  if (allInterests.length > 1) {
    for (const interest of allInterests[0]) {
      if (allInterests.every((ints) => ints.includes(interest))) {
        commonInterests.push(interest);
      }
    }
  }
  if (commonInterests.length > 0) {
    parts.push(`share interests in ${commonInterests.slice(0, 2).join(' and ')}`);
  }

  const styles = [...new Set(members.map((m) => m.study_style))];
  if (styles.length === 1 && styles[0] === 'group') {
    parts.push('all prefer group study');
  }

  const base = `This ${podType} pod brings together ${nameList}`;
  if (parts.length === 0) {
    return `${base} for a great collaborative experience.`;
  }

  return `${base} because you ${parts.join(', and ')}.`;
}

/**
 * Generate a reason for why an event is recommended.
 * Falls back to template-based text when OpenAI is not configured.
 */
export async function generateEventRecommendationReason(
  profile: Profile,
  event: Event,
  matchedTags: string[]
): Promise<string> {
  if (isOpenAIConfigured()) {
    // TODO: Call OpenAI API
  }

  // Template-based fallback
  const parts: string[] = [];

  if (matchedTags.length > 0) {
    parts.push(
      `it matches your interests in ${matchedTags.slice(0, 2).join(' and ')}`
    );
  }

  if (event.category === 'Career' || event.category === 'Workshop') {
    parts.push(`it could help with your career in ${profile.career_goals[0] ?? profile.major}`);
  }

  if (parts.length === 0) {
    return `${event.title} is a great opportunity to meet other students and expand your network at SJSU.`;
  }

  return `We recommend ${event.title} because ${parts.join(', and ')}.`;
}

/**
 * Generate a brief profile summary for display.
 * Falls back to template-based text when OpenAI is not configured.
 */
export async function generateProfileSummary(
  profile: Profile
): Promise<string> {
  if (isOpenAIConfigured()) {
    // TODO: Call OpenAI API
  }

  // Template-based fallback
  const yearLabel =
    profile.student_type === 'transfer' ? 'Transfer' : 'Freshman';
  const topInterests = profile.interests.slice(0, 3).join(', ');
  const topSkills = profile.skills.slice(0, 2).join(' and ');

  return `${profile.first_name} is a ${yearLabel} ${profile.major} student passionate about ${topInterests}. Skilled in ${topSkills}, ${profile.first_name} is looking for ${profile.connection_types.slice(0, 2).map((ct) => ct.replace(/_/g, ' ')).join(' and ')}.`;
}
