'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface BlockReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'block' | 'report';
  onConfirm: (reason: string, description?: string) => void;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam or scam' },
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'fake_profile', label: 'Fake profile' },
  { value: 'other', label: 'Other' },
];

export function BlockReportDialog({
  open,
  onOpenChange,
  mode,
  onConfirm,
}: BlockReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');

  if (!open) return null;

  const title = mode === 'block' ? 'Block User' : 'Report';
  const descriptionText =
    mode === 'block'
      ? 'This user will no longer be able to message you or see your profile. This action can be undone from your settings.'
      : 'Help us keep SpartanCircle safe. Please select a reason for your report.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="block-report-title">
      <div className="bg-background rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h3 id="block-report-title" className="text-base font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{descriptionText}</p>

        {/* Reason selection */}
        <div className="space-y-2 mb-4">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason.value}
              onClick={() => setSelectedReason(reason.value)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors min-h-[44px]',
                selectedReason === reason.value
                  ? 'border-[#0055A2] bg-[#0055A2]/5 text-foreground'
                  : 'border-border hover:bg-muted/50 text-muted-foreground'
              )}
            >
              {reason.label}
            </button>
          ))}
        </div>

        {/* Optional description */}
        {selectedReason && (
          <div className="mb-4">
            <Textarea
              placeholder="Add additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px]"
            onClick={() => {
              setSelectedReason('');
              setDescription('');
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant={mode === 'block' ? 'destructive' : 'default'}
            size="sm"
            className="min-h-[44px]"
            disabled={!selectedReason}
            onClick={() => {
              onConfirm(selectedReason, description || undefined);
              setSelectedReason('');
              setDescription('');
            }}
          >
            {mode === 'block' ? 'Block' : 'Submit Report'}
          </Button>
        </div>
      </div>
    </div>
  );
}
