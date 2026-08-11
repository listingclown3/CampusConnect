import type { Profile, MatchBreakdown, MatchResult } from '@/types/database';
import { calculateAvailabilityScore } from './availability';

/**
 * Related majors map - majors that share significant curriculum overlap.
 */
const RELATED_MAJORS: Record<string, string[]> = {
  'Computer Science': [
    'Software Engineering',
    'Data Science',
    'Computer Engineering',
    'Information Systems',
  ],
  'Software Engineering': [
    'Computer Science',
    'Data Science',
    'Computer Engineering',
  ],
  'Data Science': [
    'Computer Science',
    'Software Engineering',
    'Mathematics',
    'Statistics',
  ],
  'Computer Engineering': [
    'Computer Science',
    'Electrical Engineering',
    'Software Engineering',
  ],
  'Electrical Engineering': [
    'Computer Engineering',
    'Mechanical Engineering',
    'Biomedical Engineering',
  ],
  'Mechanical Engineering': [
    'Electrical Engineering',
    'Biomedical Engineering',
    'Civil Engineering',
  ],
  'Biomedical Engineering': [
    'Mechanical Engineering',
    'Electrical Engineering',
    'Biology',
  ],
  'Business Administration': ['Economics', 'Communication Studies'],
  'Biological Sciences': ['Biomedical Engineering', 'Environmental Studies', 'Chemistry'],
  'Environmental Studies': ['Biological Sciences', 'Chemistry'],
  Psychology: ['Communication Studies', 'Sociology'],
  'Communication Studies': ['Business Administration', 'Psychology', 'English'],
  English: ['Communication Studies', 'Graphic Design'],
  Kinesiology: ['Biology', 'Psychology'],
  'Graphic Design': ['Art', 'English', 'Communications'],
};

/**
 * Calculate shared classes score.
 * 1 shared class = 10, 2 = 20, 3+ = 30 (max)
 */
function scoreSharedClasses(
  classesA: string[],
  classesB: string[]
): { score: number; shared: string[] } {
  const shared = classesA.filter((c) => classesB.includes(c));
  const count = shared.length;

  let score = 0;
  if (count >= 3) score = 30;
  else if (count === 2) score = 20;
  else if (count === 1) score = 10;

  return { score, shared };
}

/**
 * Calculate major similarity score.
 * Exact match = 20, related = 10, different = 0
 */
function scoreMajor(majorA: string, majorB: string): number {
  if (majorA === majorB) return 20;

  const related = RELATED_MAJORS[majorA] ?? [];
  if (related.includes(majorB)) return 10;

  return 0;
}

/**
 * Calculate shared interests score.
 * Normalized to 15 points max.
 * 0 shared = 0, 1 = 5, 2 = 10, 3+ = 15
 */
function scoreSharedInterests(
  interestsA: string[],
  interestsB: string[]
): { score: number; shared: string[] } {
  const normalizedA = interestsA.map((i) => i.toLowerCase());
  const normalizedB = interestsB.map((i) => i.toLowerCase());
  const shared = normalizedA.filter((i) => normalizedB.includes(i));

  let score = 0;
  if (shared.length >= 3) score = 15;
  else if (shared.length === 2) score = 10;
  else if (shared.length === 1) score = 5;

  return { score, shared };
}

/**
 * Calculate career goal similarity score.
 * Keyword overlap in goals, max 10 points.
 */
function scoreCareerGoals(goalsA: string[], goalsB: string[]): number {
  const keywordsA = goalsA.flatMap((g) => g.toLowerCase().split(/\s+/));
  const keywordsB = goalsB.flatMap((g) => g.toLowerCase().split(/\s+/));

  // Filter out common words
  const stopWords = new Set([
    'a',
    'an',
    'the',
    'at',
    'in',
    'on',
    'for',
    'to',
    'and',
    'or',
    'of',
  ]);
  const filteredA = keywordsA.filter((w) => !stopWords.has(w) && w.length > 2);
  const filteredB = keywordsB.filter((w) => !stopWords.has(w) && w.length > 2);

  const overlap = filteredA.filter((k) => filteredB.includes(k));
  const uniqueOverlap = [...new Set(overlap)];

  if (uniqueOverlap.length >= 3) return 10;
  if (uniqueOverlap.length === 2) return 7;
  if (uniqueOverlap.length === 1) return 4;
  return 0;
}

/**
 * Calculate complementary skills score.
 * Skills one has that the other wants (or doesn't have), max 10 points.
 */
function scoreComplementarySkills(
  skillsA: string[],
  skillsB: string[]
): number {
  const normalizedA = skillsA.map((s) => s.toLowerCase());
  const normalizedB = skillsB.map((s) => s.toLowerCase());

  // Skills A has that B doesn't
  const aUniqueToB = normalizedA.filter((s) => !normalizedB.includes(s));
  // Skills B has that A doesn't
  const bUniqueToA = normalizedB.filter((s) => !normalizedA.includes(s));

  // Complementary means each brings something different
  const complementaryCount = Math.min(aUniqueToB.length, bUniqueToA.length);

  if (complementaryCount >= 3) return 10;
  if (complementaryCount === 2) return 7;
  if (complementaryCount === 1) return 4;
  return 0;
}

/**
 * Calculate the overall match score between two profiles.
 *
 * Weights:
 * - shared_classes: 30 points max
 * - same_or_related_major: 20 points max
 * - availability_overlap: 15 points max
 * - shared_interests: 15 points max
 * - career_goal_similarity: 10 points max
 * - complementary_skills: 10 points max
 *
 * Total possible: 100 points
 */
export function calculateMatchScore(
  profileA: Profile,
  profileB: Profile,
  classIdsA: string[],
  classIdsB: string[]
): MatchResult {
  // Calculate individual scores
  const sharedClasses = scoreSharedClasses(classIdsA, classIdsB);
  const majorScore = scoreMajor(profileA.major, profileB.major);
  const availabilityScore = calculateAvailabilityScore(
    profileA.availability,
    profileB.availability
  );
  const sharedInterests = scoreSharedInterests(
    profileA.interests,
    profileB.interests
  );
  const careerScore = scoreCareerGoals(
    profileA.career_goals,
    profileB.career_goals
  );
  const skillsScore = scoreComplementarySkills(
    profileA.skills,
    profileB.skills
  );

  const breakdown: MatchBreakdown = {
    shared_classes: sharedClasses.score,
    same_or_related_major: majorScore,
    availability_overlap: availabilityScore,
    shared_interests: sharedInterests.score,
    career_goal_similarity: careerScore,
    complementary_skills: skillsScore,
  };

  const score =
    breakdown.shared_classes +
    breakdown.same_or_related_major +
    breakdown.availability_overlap +
    breakdown.shared_interests +
    breakdown.career_goal_similarity +
    breakdown.complementary_skills;

  // Generate human-readable reasons
  const reasons: string[] = [];

  if (sharedClasses.shared.length > 0) {
    reasons.push(
      `You share ${sharedClasses.shared.length} class${sharedClasses.shared.length > 1 ? 'es' : ''}`
    );
  }

  if (majorScore === 20) {
    reasons.push(`Same major: ${profileA.major}`);
  } else if (majorScore === 10) {
    reasons.push(`Related majors: ${profileA.major} and ${profileB.major}`);
  }

  if (availabilityScore >= 11) {
    reasons.push('Strong schedule overlap');
  } else if (availabilityScore >= 5) {
    reasons.push('Some available times in common');
  }

  if (sharedInterests.shared.length > 0) {
    const displayInterests = sharedInterests.shared
      .slice(0, 3)
      .join(', ');
    reasons.push(`Shared interests: ${displayInterests}`);
  }

  if (careerScore >= 7) {
    reasons.push('Similar career goals');
  }

  if (skillsScore >= 7) {
    reasons.push('Complementary skill sets');
  }

  return { score, breakdown, reasons };
}
