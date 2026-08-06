'use client';

import { useState, useCallback, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_LENGTH = 2000;
const WARN_THRESHOLD = 1800;

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) {
  const [value, setValue] = useState('');

  const charCount = value.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const showCounter = charCount >= WARN_THRESHOLD;
  const canSend = value.trim().length > 0 && !isOverLimit && !disabled;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  }, [canSend, value, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none rounded-xl border bg-muted/50 px-4 py-2.5 text-sm',
              'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
              'max-h-32 min-h-[40px] scrollbar-thin',
              isOverLimit && 'border-destructive focus:ring-destructive/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{
              height: 'auto',
              minHeight: '40px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          {showCounter && (
            <span
              className={cn(
                'absolute bottom-1 right-2 text-[10px]',
                isOverLimit ? 'text-destructive font-medium' : 'text-muted-foreground'
              )}
            >
              {charCount}/{MAX_LENGTH}
            </span>
          )}
        </div>
        <Button
          size="icon"
          className={cn(
            'shrink-0 rounded-full h-10 w-10',
            canSend
              ? 'bg-[#0055A2] hover:bg-[#004080]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
          disabled={!canSend}
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
