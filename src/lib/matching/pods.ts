import type { Profile, PodType, PodSuggestion } from '@/types/database';
import { getAvailabilityOverlap } from './availability';

interface PodScoringWeights {
  shared_class_or_goal: number;
  availability_overlap: number;
  study_style_fit: number;
  interest_overlap: number;
  skill_balance: number;
}

const POD_WEIGHTS: PodScoringWeights = {
  shared_class_or_goal: 30,
  availability_overlap: 25,
  study_style_fit: 15,
  interest_overlap: 15,
  skill_balance: 15,
};

/**
 * Score a potential pod group based on member compatibility.
 */
function scorePodGroup(
  members: Profile[],
  classIdsMap: Record<string, string[]>,
  podType: PodType
): number {
  if (members.length < 2) return 0;

  let totalScore = 0;
  let comparisons = 0;

  // Score each pair within the group
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const a = members[i];
      const b = members[j];

      // Shared class or goal (30 max)
      const classesA = classIdsMap[a.user_id] ?? [];
      const classesB = classIdsMap[b.user_id] ?? [];
      const sharedClasses = classesA.filter((c) => classesB.includes(c));
      const sharedGoals = a.career_goals.filter((g) =>
        b.career_goals.some(
          (bg) => bg.toLowerCase().includes(g.toLowerCase().split(' ')[0])
        )
      );
      const classGoalScore = Math.min(
        (sharedClasses.length * 10 + sharedGoals.length * 5),
        POD_WEIGHTS.shared_class_or_goal
      );

      // Availability overlap (25 max)
      const overlap = getAvailabilityOverlap(a.availability, b.availability);
      const availScore = Math.min(
        (overlap.length / 7) * POD_WEIGHTS.availability_overlap,
        POD_WEIGHTS.availability_overlap
      );

      // Study style fit (15 max)
      let styleScore = 0;
      if (podType === 'study' || podType === 'project') {
        if (a.study_style === b.study_style) styleScore = 15;
        else if (
          a.study_style === 'flexible' ||
          b.study_style === 'flexible'
        )
          styleScore = 12;
        else if (a.study_style === 'group' || b.study_style === 'group')
          styleScore = 8;
        else styleScore = 5;
      } else {
        styleScore = 10; // Less relevant for non-study pods
      }

      // Interest overlap (15 max)
      const sharedInterests = a.interests.filter((int) =>
        b.interests.some((bi) => bi.toLowerCase() === int.toLowerCase())
      );
      const interestScore = Math.min(
        sharedInterests.length * 5,
        POD_WEIGHTS.interest_overlap
      );

      // Skill balance (15 max) - diversity of skills is better
      const allSkills = new Set([...a.skills, ...b.skills]);
      const uniqueSkillRatio = allSkills.size / (a.skills.length + b.skills.length);
      const skillScore = Math.round(uniqueSkillRatio * POD_WEIGHTS.skill_balance);

      totalScore += classGoalScore + availScore + styleScore + interestScore + skillScore;
      comparisons++;
    }
  }

  return comparisons > 0 ? Math.round(totalScore / comparisons) : 0;
}

/**
 * Generate pod suggestions from a set of profiles.
 * Groups 3-5 students by type (study, project, career, interest).
 */
export function generatePods(
  profiles: Profile[],
  classIdsMap: Record<string, string[]>,
  options: {
    podType?: PodType;
    targetClassId?: string;
    minSize?: number;
    maxSize?: number;
  } = {}
): PodSuggestion[] {
  const {
    podType = 'study',
    targetClassId,
    minSize = 3,
    maxSize = 5,
  } = options;

  const suggestions: PodSuggestion[] = [];

  // Filter profiles if a target class is specified
  let candidates = [...profiles];
  if (targetClassId) {
    candidates = profiles.filter((p) =>
      (classIdsMap[p.user_id] ?? []).includes(targetClassId)
    );
  }

  if (candidates.length < minSize) return suggestions;

  // Greedy grouping: start with each candidate and find best matches
  const used = new Set<string>();

  for (const seed of candidates) {
    if (used.has(seed.user_id)) continue;

    const group: Profile[] = [seed];
    const remaining = candidates.filter(
      (p) => p.user_id !== seed.user_id && !used.has(p.user_id)
    );

    // Score each remaining candidate against the seed
    const scored = remaining.map((p) => {
      const pairScore = scorePodGroup([seed, p], classIdsMap, podType);
      return { profile: p, score: pairScore };
    });

    scored.sort((a, b) => b.score - a.score);

    // Add top candidates to the group
    for (const { profile } of scored) {
      if (group.length >= maxSize) break;
      group.push(profile);
    }

    if (group.length >= minSize) {
      const score = scorePodGroup(group, classIdsMap, podType);
      const reasons = generatePodReasons(group, classIdsMap, podType);

      suggestions.push({
        members: group,
        score,
        pod_type: podType,
        name: generatePodName(group, podType, targetClassId),
        description: generatePodDescription(group, podType),
        reasons,
      });

      group.forEach((p) => used.add(p.user_id));
    }
  }

  // Sort by score
  suggestions.sort((a, b) => b.score - a.score);
  return suggestions;
}

function generatePodName(
  members: Profile[],
  podType: PodType,
  classId?: string
): string {
  const typeLabels: Record<PodType, string> = {
    study: 'Study Group',
    project: 'Project Team',
    career: 'Career Circle',
    interest: 'Interest Group',
    event: 'Event Crew',
    major_switch: 'Major Explorers',
  };

  if (classId) {
    return `${classId} ${typeLabels[podType]}`;
  }

  const majors = [...new Set(members.map((m) => m.major))];
  if (majors.length === 1) {
    return `${majors[0]} ${typeLabels[podType]}`;
  }

  return `${typeLabels[podType]} - ${members.length} Members`;
}

function generatePodDescription(
  members: Profile[],
  podType: PodType
): string {
  const names = members.map((m) => m.first_name).join(', ');
  const typeDescriptions: Record<PodType, string> = {
    study: `A study group with ${names}. Great for exam prep and homework help.`,
    project: `A project team with ${names}. Complementary skills for building something great.`,
    career: `A career networking circle with ${names}. Share opportunities and grow together.`,
    interest: `An interest group with ${names}. Connect over shared passions.`,
    event: `An event crew with ${names}. Attend campus events together.`,
    major_switch: `Major exploration group with ${names}. Navigate academic paths together.`,
  };

  return typeDescriptions[podType];
}

function generatePodReasons(
  members: Profile[],
  classIdsMap: Record<string, string[]>,
  podType: PodType
): string[] {
  const reasons: string[] = [];

  // Check shared classes
  const allClassSets = members.map((m) => new Set(classIdsMap[m.user_id] ?? []));
  const commonClasses: string[] = [];
  if (allClassSets.length > 1) {
    for (const cls of allClassSets[0]) {
      if (allClassSets.every((s) => s.has(cls))) {
        commonClasses.push(cls);
      }
    }
  }
  if (commonClasses.length > 0) {
    reasons.push(`All members share ${commonClasses.length} class${commonClasses.length > 1 ? 'es' : ''}`);
  }

  // Check shared interests
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
    reasons.push(`Shared interests: ${commonInterests.slice(0, 3).join(', ')}`);
  }

  // Study style compatibility
  const styles = members.map((m) => m.study_style);
  const styleSet = new Set(styles);
  if (styleSet.size === 1) {
    reasons.push(`Everyone prefers ${styles[0]} study style`);
  } else if (styles.filter((s) => s === 'group' || s === 'flexible').length >= members.length - 1) {
    reasons.push('Compatible study styles');
  }

  // Pod type specific reasons
  if (podType === 'career') {
    const goals = members.flatMap((m) => m.career_goals);
    const uniqueGoals = [...new Set(goals)];
    if (uniqueGoals.length < goals.length) {
      reasons.push('Similar career aspirations');
    }
  }

  if (reasons.length === 0) {
    reasons.push('Good overall compatibility based on profiles');
  }

  return reasons;
}
