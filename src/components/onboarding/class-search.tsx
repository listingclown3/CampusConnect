'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { sanitizeText } from '@/lib/validation/text';
import type { Class } from '@/types/database';

const MAX_SEARCH_LENGTH = 60;
const MAX_RESULTS = 8;

interface ClassSearchProps {
  classes: Class[];
  value: string[];
  onChange: (classIds: string[]) => void;
  maxClasses?: number;
}

export function ClassSearch({ classes, value, onChange, maxClasses = 12 }: ClassSearchProps) {
  const [query, setQuery] = useState('');

  const selectedClasses = useMemo(
    () => value.map((id) => classes.find((c) => c.id === id)).filter((c): c is Class => !!c),
    [value, classes]
  );

  const results = useMemo(() => {
    const cleaned = query.trim().toLowerCase();
    if (!cleaned) return [];
    return classes
      .filter(
        (c) =>
          !value.includes(c.id) &&
          (c.course_code.toLowerCase().includes(cleaned) ||
            c.course_name.toLowerCase().includes(cleaned))
      )
      .slice(0, MAX_RESULTS);
  }, [classes, query, value]);

  const atLimit = value.length >= maxClasses;

  const addClass = (id: string) => {
    if (atLimit || value.includes(id)) return;
    onChange([...value, id]);
    setQuery('');
  };

  const removeClass = (id: string) => {
    onChange(value.filter((c) => c !== id));
  };

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(e) => setQuery(sanitizeText(e.target.value, MAX_SEARCH_LENGTH))}
        placeholder={atLimit ? `Limit of ${maxClasses} classes reached` : 'Search by course code or title'}
        disabled={atLimit}
        className="h-9 text-sm"
      />

      {query.trim() && (
        <div className="space-y-1 rounded-lg border p-1.5 max-h-56 overflow-y-auto">
          {results.length > 0 ? (
            results.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => addClass(cls.id)}
                className="w-full flex flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="text-sm font-medium">{cls.course_code}</span>
                <span className="text-xs text-muted-foreground truncate w-full">{cls.course_name}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-muted-foreground px-2 py-2">No matching classes found</p>
          )}
        </div>
      )}

      {selectedClasses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedClasses.map((cls) => (
            <Badge key={cls.id} variant="default" className="pl-2.5 pr-1 py-1 gap-1 text-xs">
              {cls.course_code}
              <button
                type="button"
                onClick={() => removeClass(cls.id)}
                aria-label={`Remove ${cls.course_code}`}
                className="ml-1 rounded-full p-0.5 hover:bg-primary-foreground/20"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length}/{maxClasses} selected
      </p>
    </div>
  );
}
