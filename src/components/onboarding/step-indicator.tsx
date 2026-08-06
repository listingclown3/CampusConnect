'use client';

import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        {labels && labels[currentStep - 1] && (
          <span className="font-medium">{labels[currentStep - 1]}</span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i < currentStep ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}
