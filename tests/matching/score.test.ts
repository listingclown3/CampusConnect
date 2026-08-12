import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '@/lib/matching/score';
import type { Profile, Availability } from '@/types/database';

function makeAvailability(overrides: Partial<Availability> = {}): Availability {
  const defaultSlots = { morning: false, afternoon: true, evening: true, late_night: false };
  return {
    monday: { ...defaultSlots },
    tuesday: { ...defaultSlots },
    wednesday: { ...defaultSlots },
    thursday: { ...defaultSlots },
    friday: { ...defaultSlots },
    saturday: { morning: true, afternoon: true, evening: true, late_night: false },
    sunday: { morning: true, afternoon: true, evening: false, late_night: false },
    ...overrides,
  };
}

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'test-id',
    user_id: 'test-user',
    first_name: 'Test',
    last_name: 'User',
    display_name: 'Test U.',
    avatar_url: null,
    bio: null,
    student_type: 'freshman',
    major: 'Computer Science',
    intended_major: null,
    graduation_year: 2028,
    interests: ['AI', 'machine learning'],
    skills: ['Python', 'TensorFlow'],
    career_goals: ['AI researcher'],
    study_style: 'group',
    collaboration_style: 'leader',
    connection_types: ['study_buddies'],
    availability: makeAvailability(),
    linkedin_url: null,
    instagram_handle: null,
    is_visible: true,
    onboarding_complete: true,
    created_at: '2024-08-01T00:00:00Z',
    updated_at: '2024-08-01T00:00:00Z',
    ...overrides,
  };
}

describe('calculateMatchScore', () => {
  it('returns max shared_classes score (30) for 3+ shared classes', () => {
    const profileA = makeProfile({ user_id: 'a' });
    const profileB = makeProfile({ user_id: 'b' });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001', 'cls-002', 'cls-003'],
      ['cls-001', 'cls-002', 'cls-003']
    );

    expect(result.breakdown.shared_classes).toBe(30);
  });

  it('returns 20 for shared_classes when 2 classes overlap', () => {
    const profileA = makeProfile({ user_id: 'a' });
    const profileB = makeProfile({ user_id: 'b' });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001', 'cls-002', 'cls-003'],
      ['cls-001', 'cls-002', 'cls-004']
    );

    expect(result.breakdown.shared_classes).toBe(20);
  });

  it('returns 10 for shared_classes when 1 class overlaps', () => {
    const profileA = makeProfile({ user_id: 'a' });
    const profileB = makeProfile({ user_id: 'b' });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001', 'cls-002'],
      ['cls-001', 'cls-004']
    );

    expect(result.breakdown.shared_classes).toBe(10);
  });

  it('returns 0 for shared_classes when no classes overlap', () => {
    const profileA = makeProfile({ user_id: 'a' });
    const profileB = makeProfile({ user_id: 'b' });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001'],
      ['cls-002']
    );

    expect(result.breakdown.shared_classes).toBe(0);
  });

  it('gives 20 points for same major', () => {
    const profileA = makeProfile({ user_id: 'a', major: 'Computer Science' });
    const profileB = makeProfile({ user_id: 'b', major: 'Computer Science' });

    const result = calculateMatchScore(profileA, profileB, [], []);
    expect(result.breakdown.same_or_related_major).toBe(20);
  });

  it('gives 10 points for related major', () => {
    const profileA = makeProfile({ user_id: 'a', major: 'Computer Science' });
    const profileB = makeProfile({ user_id: 'b', major: 'Software Engineering' });

    const result = calculateMatchScore(profileA, profileB, [], []);
    expect(result.breakdown.same_or_related_major).toBe(10);
  });

  it('gives 0 points for unrelated major', () => {
    const profileA = makeProfile({ user_id: 'a', major: 'Computer Science' });
    const profileB = makeProfile({ user_id: 'b', major: 'English' });

    const result = calculateMatchScore(profileA, profileB, [], []);
    expect(result.breakdown.same_or_related_major).toBe(0);
  });

  it('scores shared interests correctly', () => {
    const profileA = makeProfile({
      user_id: 'a',
      interests: ['AI', 'machine learning', 'robotics'],
    });
    const profileB = makeProfile({
      user_id: 'b',
      interests: ['AI', 'machine learning', 'gaming'],
    });

    const result = calculateMatchScore(profileA, profileB, [], []);
    expect(result.breakdown.shared_interests).toBe(10); // 2 shared = 10
  });

  it('scores 3+ shared interests as max (15)', () => {
    const profileA = makeProfile({
      user_id: 'a',
      interests: ['AI', 'machine learning', 'robotics', 'data'],
    });
    const profileB = makeProfile({
      user_id: 'b',
      interests: ['AI', 'machine learning', 'robotics', 'gaming'],
    });

    const result = calculateMatchScore(profileA, profileB, [], []);
    expect(result.breakdown.shared_interests).toBe(15);
  });

  it('calculates availability overlap score', () => {
    const availA = makeAvailability();
    const availB = makeAvailability();

    const profileA = makeProfile({ user_id: 'a', availability: availA });
    const profileB = makeProfile({ user_id: 'b', availability: availB });

    const result = calculateMatchScore(profileA, profileB, [], []);
    // Same availability = high overlap
    expect(result.breakdown.availability_overlap).toBeGreaterThan(0);
  });

  it('returns score between 0 and 100', () => {
    const profileA = makeProfile({
      user_id: 'a',
      major: 'Computer Science',
      interests: ['AI', 'machine learning', 'robotics'],
      skills: ['Python', 'TensorFlow', 'data analysis'],
      career_goals: ['AI researcher', 'machine learning engineer'],
    });
    const profileB = makeProfile({
      user_id: 'b',
      major: 'Computer Science',
      interests: ['AI', 'machine learning', 'gaming'],
      skills: ['JavaScript', 'React', 'Node.js'],
      career_goals: ['full-stack developer', 'startup founder'],
    });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001', 'cls-002'],
      ['cls-001', 'cls-002']
    );

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('generates meaningful reasons array', () => {
    const profileA = makeProfile({
      user_id: 'a',
      major: 'Computer Science',
      interests: ['AI', 'machine learning'],
    });
    const profileB = makeProfile({
      user_id: 'b',
      major: 'Computer Science',
      interests: ['AI', 'web development'],
    });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001'],
      ['cls-001']
    );

    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.some((r) => r.includes('class'))).toBe(true);
    expect(result.reasons.some((r) => r.includes('major'))).toBe(true);
  });

  it('scores complementary skills', () => {
    const profileA = makeProfile({
      user_id: 'a',
      skills: ['Python', 'TensorFlow', 'data analysis'],
    });
    const profileB = makeProfile({
      user_id: 'b',
      skills: ['JavaScript', 'React', 'Node.js'],
    });

    const result = calculateMatchScore(profileA, profileB, [], []);
    expect(result.breakdown.complementary_skills).toBeGreaterThan(0);
  });

  it('total score equals sum of breakdown components', () => {
    const profileA = makeProfile({ user_id: 'a' });
    const profileB = makeProfile({ user_id: 'b', major: 'Data Science' });

    const result = calculateMatchScore(
      profileA,
      profileB,
      ['cls-001'],
      ['cls-001', 'cls-002']
    );

    const expectedTotal =
      result.breakdown.shared_classes +
      result.breakdown.same_or_related_major +
      result.breakdown.availability_overlap +
      result.breakdown.shared_interests +
      result.breakdown.career_goal_similarity +
      result.breakdown.complementary_skills;

    expect(result.score).toBe(expectedTotal);
  });
});
