'use client';

import { cn } from '@/lib/utils';

interface ScoreCategory {
  label: string;
  value: number;
  max: number;
}

interface PodScoreBreakdownProps {
  scores: {
    shared_class_or_goal: number;
    availability_overlap: number;
    study_style_fit: number;
    interest_overlap: number;
    skill_balance: number;
  };
}

const categoryLabels: Record<string, string> = {
  shared_class_or_goal: 'Shared Class / Goal',
  availability_overlap: 'Availability Overlap',
  study_style_fit: 'Study Style Fit',
  interest_overlap: 'Interest Overlap',
  skill_balance: 'Skill Balance',
};

const categoryMaxes: Record<string, number> = {
  shared_class_or_goal: 30,
  availability_overlap: 25,
  study_style_fit: 15,
  interest_overlap: 15,
  skill_balance: 15,
};

export function PodScoreBreakdown({ scores }: PodScoreBreakdownProps) {
  const categories: ScoreCategory[] = Object.entries(scores).map(([key, value]) => ({
    label: categoryLabels[key] || key,
    value,
    max: categoryMaxes[key] || 15,
  }));

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const percentage = Math.round((cat.value / cat.max) * 100);
        return (
          <div key={cat.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{cat.label}</span>
              <span className="font-medium">{cat.value}/{cat.max}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  percentage >= 80
                    ? 'bg-green-500'
                    : percentage >= 60
                    ? 'bg-yellow-500'
                    : percentage >= 40
                    ? 'bg-orange-400'
                    : 'bg-red-400'
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
