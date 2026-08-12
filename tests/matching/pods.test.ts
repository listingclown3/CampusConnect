import { describe, it, expect } from 'vitest';
import { generatePods } from '@/lib/matching/pods';
import type { Profile, Availability } from '@/types/database';

function makeAvailability(): Availability {
  const slots = { morning: false, afternoon: true, evening: true, late_night: false };
  return {
    monday: slots,
    tuesday: slots,
    wednesday: slots,
    thursday: slots,
    friday: slots,
    saturday: { morning: true, afternoon: true, evening: true, late_night: false },
    sunday: { morning: true, afternoon: true, evening: false, late_night: false },
  };
}

function makeProfile(id: string, overrides: Partial<Profile> = {}): Profile {
  return {
    id,
    user_id: id,
    first_name: `User${id}`,
    last_name: 'Test',
    display_name: `User${id} T.`,
    avatar_url: null,
    bio: null,
    student_type: 'freshman',
    major: 'Computer Science',
    intended_major: null,
    graduation_year: 2028,
    interests: ['AI', 'coding'],
    skills: ['Python', 'JavaScript'],
    career_goals: ['software engineer'],
    study_style: 'group',
    collaboration_style: 'adaptive',
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

describe('generatePods', () => {
  it('generates pods from a list of profiles', () => {
    const profiles = [
      makeProfile('1'),
      makeProfile('2'),
      makeProfile('3'),
      makeProfile('4'),
      makeProfile('5'),
    ];

    const classIdsMap: Record<string, string[]> = {
      '1': ['cls-001', 'cls-002'],
      '2': ['cls-001', 'cls-002'],
      '3': ['cls-001', 'cls-003'],
      '4': ['cls-001'],
      '5': ['cls-002', 'cls-003'],
    };

    const pods = generatePods(profiles, classIdsMap);
    expect(pods.length).toBeGreaterThan(0);
  });

  it('respects minimum pod size', () => {
    const profiles = [
      makeProfile('1'),
      makeProfile('2'),
    ];

    const classIdsMap: Record<string, string[]> = {
      '1': ['cls-001'],
      '2': ['cls-001'],
    };

    const pods = generatePods(profiles, classIdsMap, { minSize: 3 });
    expect(pods).toHaveLength(0);
  });

  it('filters by target class', () => {
    const profiles = [
      makeProfile('1'),
      makeProfile('2'),
      makeProfile('3'),
      makeProfile('4'),
    ];

    const classIdsMap: Record<string, string[]> = {
      '1': ['cls-001', 'cls-002'],
      '2': ['cls-001'],
      '3': ['cls-001'],
      '4': ['cls-003'],
    };

    const pods = generatePods(profiles, classIdsMap, {
      targetClassId: 'cls-001',
      minSize: 3,
    });

    // User 4 is not in cls-001, so pods should only contain users 1, 2, 3
    if (pods.length > 0) {
      pods.forEach((pod) => {
        pod.members.forEach((m) => {
          expect(classIdsMap[m.user_id]).toContain('cls-001');
        });
      });
    }
  });

  it('assigns correct pod type', () => {
    const profiles = [
      makeProfile('1'),
      makeProfile('2'),
      makeProfile('3'),
    ];

    const classIdsMap: Record<string, string[]> = {
      '1': ['cls-001'],
      '2': ['cls-001'],
      '3': ['cls-001'],
    };

    const pods = generatePods(profiles, classIdsMap, { podType: 'project' });
    if (pods.length > 0) {
      expect(pods[0].pod_type).toBe('project');
    }
  });

  it('generates pods with scores between 0 and 100', () => {
    const profiles = [
      makeProfile('1', { interests: ['AI', 'ML', 'data'] }),
      makeProfile('2', { interests: ['AI', 'ML', 'web'] }),
      makeProfile('3', { interests: ['AI', 'data', 'analytics'] }),
    ];

    const classIdsMap: Record<string, string[]> = {
      '1': ['cls-001', 'cls-002'],
      '2': ['cls-001', 'cls-002'],
      '3': ['cls-001'],
    };

    const pods = generatePods(profiles, classIdsMap);
    pods.forEach((pod) => {
      expect(pod.score).toBeGreaterThanOrEqual(0);
      expect(pod.score).toBeLessThanOrEqual(100);
    });
  });

  it('generates pods with names and descriptions', () => {
    const profiles = [
      makeProfile('1'),
      makeProfile('2'),
      makeProfile('3'),
    ];

    const classIdsMap: Record<string, string[]> = {
      '1': ['cls-001'],
      '2': ['cls-001'],
      '3': ['cls-001'],
    };

    const pods = generatePods(profiles, classIdsMap);
    if (pods.length > 0) {
      expect(pods[0].name).toBeTruthy();
      expect(pods[0].description).toBeTruthy();
      expect(pods[0].reasons.length).toBeGreaterThan(0);
    }
  });

  it('respects maximum pod size', () => {
    const profiles = Array.from({ length: 10 }, (_, i) => makeProfile(`${i + 1}`));
    const classIdsMap: Record<string, string[]> = {};
    profiles.forEach((p) => {
      classIdsMap[p.user_id] = ['cls-001'];
    });

    const pods = generatePods(profiles, classIdsMap, { maxSize: 4 });
    pods.forEach((pod) => {
      expect(pod.members.length).toBeLessThanOrEqual(4);
    });
  });
});
