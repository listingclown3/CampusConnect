'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, Bookmark, X, MessageCircle } from 'lucide-react';
import {
  saveMatch,
  unsaveMatch,
  skipMatch,
  isMatchSaved,
} from '@/lib/data/match-actions';
import { cn } from '@/lib/utils';

interface MatchActionsProps {
  userId: string;
  onSkip?: () => void;
  className?: string;
}

export function MatchActions({ userId, onSkip, className }: MatchActionsProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    isMatchSaved(userId).then((result) => {
      if (!cancelled) setSaved(result);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleView = () => {
    router.push(`/matches/${userId}`);
  };

  const handleSave = () => {
    if (saved) {
      void unsaveMatch(userId);
      setSaved(false);
    } else {
      void saveMatch(userId);
      setSaved(true);
    }
  };

  const handleSkip = () => {
    void skipMatch(userId);
    onSkip?.();
  };

  const handleChat = () => {
    router.push(`/chat?user=${userId}`);
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleView}
        title="View profile"
      >
        <Eye className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant={saved ? 'default' : 'outline'}
        size="icon-sm"
        onClick={handleSave}
        title={saved ? 'Unsave' : 'Save'}
      >
        <Bookmark className={cn('w-3.5 h-3.5', saved && 'fill-current')} />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleSkip}
        title="Skip"
      >
        <X className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleChat}
        title="Chat"
      >
        <MessageCircle className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
