import type { Profile, Event, EventRecommendation } from '@/types/database';

interface EventScoringWeights {
  interest_tag_match: number;
  major_relevance: number;
  career_goal_relevance: number;
  matches_or_pod_attending: number;
  availability_fit: number;
}

const EVENT_WEIGHTS: EventScoringWeights = {
  interest_tag_match: 30,
  major_relevance: 20,
  career_goal_relevance: 20,
  matches_or_pod_attending: 20,
  availability_fit: 10,
};

/**
 * Major to event category relevance map.
 */
const MAJOR_CATEGORY_MAP: Record<string, string[]> = {
  'Computer Science': ['Technology', 'Workshop', 'Competition', 'Career'],
  'Software Engineering': ['Technology', 'Workshop', 'Competition', 'Career'],
  'Data Science': ['Technology', 'Workshop', 'Showcase', 'Career'],
  'Computer Engineering': ['Technology', 'Workshop', 'Engineering', 'Career'],
  'Electrical Engineering': ['Engineering', 'Workshop', 'Showcase'],
  'Mechanical Engineering': ['Engineering', 'Workshop', 'Showcase'],
  'Biomedical Engineering': ['Engineering', 'Health', 'Workshop'],
  'Business Administration': ['Business', 'Competition', 'Career', 'Panel'],
  Marketing: ['Business', 'Workshop', 'Social', 'Career'],
  Biology: ['Health', 'Academic', 'Info Session'],
  Psychology: ['Health', 'Academic', 'Panel'],
  Communications: ['Social', 'Workshop', 'Panel'],
  English: ['Academic', 'Social', 'Workshop'],
  Kinesiology: ['Health', 'Social'],
  'Graphic Design': ['Art', 'Workshop', 'Showcase'],
  'Environmental Science': ['Academic', 'Workshop'],
};

/**
 * Score an event for a given user profile.
 */
function scoreEvent(
  profile: Profile,
  event: Event,
  attendingUserIds: string[]
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let totalScore = 0;

  // Interest tag match (30 max)
  const userInterests = profile.interests.map((i) => i.toLowerCase());
  const eventTags = event.tags.map((t) => t.toLowerCase());
  const matchedTags = eventTags.filter((tag) =>
    userInterests.some(
      (interest) => interest.includes(tag) || tag.includes(interest)
    )
  );
  const interestScore = Math.min(
    (matchedTags.length / Math.max(eventTags.length, 1)) *
      EVENT_WEIGHTS.interest_tag_match,
    EVENT_WEIGHTS.interest_tag_match
  );
  totalScore += interestScore;
  if (matchedTags.length > 0) {
    reasons.push(
      `Matches your interests: ${matchedTags.slice(0, 3).join(', ')}`
    );
  }

  // Major relevance (20 max)
  const relevantCategories = MAJOR_CATEGORY_MAP[profile.major] ?? [];
  const categoryMatch = relevantCategories.includes(event.category);
  const majorScore = categoryMatch ? EVENT_WEIGHTS.major_relevance : 0;
  totalScore += majorScore;
  if (categoryMatch) {
    reasons.push(`Relevant to your major in ${profile.major}`);
  }

  // Career goal relevance (20 max)
  const goalKeywords = profile.career_goals.flatMap((g) =>
    g.toLowerCase().split(/\s+/)
  );
  const eventText = `${event.title} ${event.description}`.toLowerCase();
  const goalMatches = goalKeywords.filter(
    (kw) => kw.length > 3 && eventText.includes(kw)
  );
  const careerScore = Math.min(
    (goalMatches.length / Math.max(goalKeywords.length, 1)) *
      EVENT_WEIGHTS.career_goal_relevance * 3,
    EVENT_WEIGHTS.career_goal_relevance
  );
  totalScore += careerScore;
  if (careerScore > 10) {
    reasons.push('Aligns with your career goals');
  }

  // Matches or pod members attending (20 max)
  const attendingCount = attendingUserIds.length;
  const attendScore = Math.min(
    attendingCount * 5,
    EVENT_WEIGHTS.matches_or_pod_attending
  );
  totalScore += attendScore;
  if (attendingCount > 0) {
    reasons.push(
      `${attendingCount} of your connections ${attendingCount === 1 ? 'is' : 'are'} attending`
    );
  }

  // Availability fit (10 max) - simplified check based on event time
  const eventDate = new Date(event.start_time);
  const dayIndex = eventDate.getUTCDay();
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;
  const dayName = dayNames[dayIndex];
  const hour = eventDate.getUTCHours();

  let timeSlot: 'morning' | 'afternoon' | 'evening' | 'late_night';
  if (hour < 12) timeSlot = 'morning';
  else if (hour < 17) timeSlot = 'afternoon';
  else if (hour < 21) timeSlot = 'evening';
  else timeSlot = 'late_night';

  const isAvailable = profile.availability[dayName]?.[timeSlot] ?? false;
  const availScore = isAvailable ? EVENT_WEIGHTS.availability_fit : 0;
  totalScore += availScore;
  if (isAvailable) {
    reasons.push('Fits your schedule');
  }

  return { score: Math.round(totalScore), reasons };
}

/**
 * Recommend events for a given user profile.
 * Returns events sorted by relevance score.
 */
export function recommendEvents(
  profile: Profile,
  events: Event[],
  options: {
    attendingMap?: Record<string, string[]>;
    matchedUserIds?: string[];
    limit?: number;
  } = {}
): EventRecommendation[] {
  const { attendingMap = {}, matchedUserIds = [], limit = 10 } = options;

  const recommendations: EventRecommendation[] = events.map((event) => {
    // Find how many of the user's matches/pod members are attending this event
    const eventAttendees = attendingMap[event.id] ?? [];
    const connectionsAttending = eventAttendees.filter((uid) =>
      matchedUserIds.includes(uid)
    );

    const { score, reasons } = scoreEvent(profile, event, connectionsAttending);

    return { event, score, reasons };
  });

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}
