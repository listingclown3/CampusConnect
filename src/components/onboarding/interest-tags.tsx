'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InterestTagsProps {
  options: string[];
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowCustom?: boolean;
}

export function InterestTags({
  options,
  value,
  onChange,
  placeholder = 'Add custom...',
  maxTags = 10,
  allowCustom = true,
}: InterestTagsProps) {
  const [customInput, setCustomInput] = useState('');

  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (value.length < maxTags) {
      onChange([...value, tag]);
    }
  };

  const addCustomTag = () => {
    const trimmed = customInput.trim();
    if (trimmed && !value.includes(trimmed) && value.length < maxTags) {
      onChange([...value, trimmed]);
      setCustomInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="pl-2.5 pr-1 py-1 gap-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground/20"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Predefined options */}
      <div className="flex flex-wrap gap-2">
        {options
          .filter((opt) => !value.includes(opt))
          .map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleTag(option)}
              disabled={value.length >= maxTags}
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium transition-colors',
                'bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary',
                value.length >= maxTags && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Plus className="w-3 h-3 mr-1" />
              {option}
            </button>
          ))}
      </div>

      {/* Custom input */}
      {allowCustom && (
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={value.length >= maxTags}
            className="h-9 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomTag}
            disabled={!customInput.trim() || value.length >= maxTags}
            className="h-9"
          >
            Add
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxTags} selected
      </p>
    </div>
  );
}
