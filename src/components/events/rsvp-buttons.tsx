'use client';

import { Check, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RsvpStatus } from '@/types/database';

interface RsvpButtonsProps {
  currentStatus: RsvpStatus | null;
  onStatusChange: (status: RsvpStatus) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function RsvpButtons({ currentStatus, onStatusChange, disabled = false, compact = false }: RsvpButtonsProps) {
  const buttons: { status: RsvpStatus; label: string; icon: typeof Check; activeClass: string }[] = [
    {
      status: 'interested',
      label: 'Interested',
      icon: Star,
      activeClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500',
    },
    {
      status: 'going',
      label: 'Going',
      icon: Check,
      activeClass: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
    },
    {
      status: 'not_going',
      label: 'Not Going',
      icon: X,
      activeClass: 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400',
    },
  ];

  return (
    <div className={cn('flex gap-2', compact && 'gap-1.5')}>
      {buttons.map(({ status, label, icon: Icon, activeClass }) => {
        const isActive = currentStatus === status;
        return (
          <Button
            key={status}
            variant="outline"
            size={compact ? 'sm' : 'default'}
            disabled={disabled}
            onClick={() => onStatusChange(status)}
            className={cn(
              'transition-all',
              compact && 'text-xs px-2.5 h-8',
              isActive && activeClass,
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Icon className={cn('w-4 h-4', compact ? 'mr-1' : 'mr-1.5', compact && 'w-3.5 h-3.5')} />
            {label}
          </Button>
        );
      })}
    </div>
  );
}
