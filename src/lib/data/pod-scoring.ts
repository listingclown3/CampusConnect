import type { Profile, Pod } from '@/types/database';
import { getAvailabilityOverlap } from '@/lib/matching/availability';
import { getStudentClassIds } from '@/lib/mock-data';

/**
 * Score a pod for a specific user based on compatibility with existing members.
 * Uses the standard pod scoring weights:
 * - shared_class_or_goal: 30
 * - availability_overlap: 25
 * - study_style_fit: 15
 * - interest_overlap: 15
 * - skill_balance: 15
 */
export function scorePodForUser(
  user: Profile,
  members: Profile[],
  pod: Pod
): number {
  if (members.length === 0) return 50; // Default score for empty pods

  const userClassIds = getStudentClassIds(user.user_id);
  let totalScore = 0;

  for (const member of members) {
    const memberClassIds = getStudentClassIds(member.user_id);

    // Shared class or goal (30 max)
    const sharedClasses = userClassIds.filter((c) => memberClassIds.includes(c));
    const sharedGoals = user.career_goals.filter((g) =>
      member.career_goals.some((mg) =>
        mg.toLowerCase().includes(g.toLowerCase().split(' ')[0])
      )
    );
    // Pod class bonus
    const podClassBonus = pod.class_id && userClassIds.includes(pod.class_id) ? 10 : 0;
    const classGoalScore = Math.min(
      sharedClasses.length * 10 + sharedGoals.length * 5 + podClassBonus,
      30
    );

    // Availability overlap (25 max)
    const overlap = getAvailabilityOverlap(user.availability, member.availability);
    const availScore = Math.min(
      Math.round((overlap.length / 7) * 25),
      25
    );

    // Study style fit (15 max)
    let styleScore = 0;
    if (pod.pod_type === 'study' || pod.pod_type === 'project') {
      if (user.study_style === member.study_style) styleScore = 15;
      else if (user.study_style === 'flexible' || member.study_style === 'flexible') styleScore = 12;
      else if (user.study_style === 'group' || member.study_style === 'group') styleScore = 8;
      else styleScore = 5;
    } else {
      styleScore = 10;
    }

    // Interest overlap (15 max)
    const sharedInterests = user.interests.filter((i) =>
      member.interests.some((mi) => mi.toLowerCase() === i.toLowerCase())
    );
    const interestScore = Math.min(sharedInterests.length * 5, 15);

    // Skill balance (15 max)
    const allSkills = new Set([...user.skills, ...member.skills]);
    const uniqueRatio = allSkills.size / (user.skills.length + member.skills.length);
    const skillScore = Math.round(uniqueRatio * 15);

    totalScore += classGoalScore + availScore + styleScore + interestScore + skillScore;
  }

  return Math.round(totalScore / members.length);
}

/**
 * Get individual score breakdown for a user against a pod.
 */
export function getPodScoreBreakdown(
  user: Profile,
  members: Profile[],
  pod: Pod
): {
  shared_class_or_goal: number;
  availability_overlap: number;
  study_style_fit: number;
  interest_overlap: number;
  skill_balance: number;
} {
  if (members.length === 0) {
    return {
      shared_class_or_goal: 15,
      availability_overlap: 12,
      study_style_fit: 8,
      interest_overlap: 8,
      skill_balance: 8,
    };
  }

  const userClassIds = getStudentClassIds(user.user_id);
  let totalClassGoal = 0;
  let totalAvail = 0;
  let totalStyle = 0;
  let totalInterest = 0;
  let totalSkill = 0;

  for (const member of members) {
    const memberClassIds = getStudentClassIds(member.user_id);

    // Shared class or goal
    const sharedClasses = userClassIds.filter((c) => memberClassIds.includes(c));
    const sharedGoals = user.career_goals.filter((g) =>
      member.career_goals.some((mg) =>
        mg.toLowerCase().includes(g.toLowerCase().split(' ')[0])
      )
    );
    const podClassBonus = pod.class_id && userClassIds.includes(pod.class_id) ? 10 : 0;
    totalClassGoal += Math.min(
      sharedClasses.length * 10 + sharedGoals.length * 5 + podClassBonus,
      30
    );

    // Availability overlap
    const overlap = getAvailabilityOverlap(user.availability, member.availability);
    totalAvail += Math.min(Math.round((overlap.length / 7) * 25), 25);

    // Study style fit
    if (pod.pod_type === 'study' || pod.pod_type === 'project') {
      if (user.study_style === member.study_style) totalStyle += 15;
      else if (user.study_style === 'flexible' || member.study_style === 'flexible') totalStyle += 12;
      else if (user.study_style === 'group' || member.study_style === 'group') totalStyle += 8;
      else totalStyle += 5;
    } else {
      totalStyle += 10;
    }

    // Interest overlap
    const sharedInterests = user.interests.filter((i) =>
      member.interests.some((mi) => mi.toLowerCase() === i.toLowerCase())
    );
    totalInterest += Math.min(sharedInterests.length * 5, 15);

    // Skill balance
    const allSkills = new Set([...user.skills, ...member.skills]);
    const uniqueRatio = allSkills.size / (user.skills.length + member.skills.length);
    totalSkill += Math.round(uniqueRatio * 15);
  }

  const count = members.length;
  return {
    shared_class_or_goal: Math.round(totalClassGoal / count),
    availability_overlap: Math.round(totalAvail / count),
    study_style_fit: Math.round(totalStyle / count),
    interest_overlap: Math.round(totalInterest / count),
    skill_balance: Math.round(totalSkill / count),
  };
}
