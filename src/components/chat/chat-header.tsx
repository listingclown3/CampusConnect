'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Users, LogOut, Ban, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { ConversationType } from '@/types/database';
import { BlockReportDialog } from './block-report-dialog';

interface ChatHeaderProps {
  title: string;
  type: ConversationType;
  memberCount: number;
  onLeave: () => void;
  onBlock?: () => void;
  showBlockOption?: boolean;
}

export function ChatHeader({
  title,
  type,
  memberCount,
  onLeave,
  onBlock,
  showBlockOption = false,
}: ChatHeaderProps) {
  const router = useRouter();
  const [showBlockReport, setShowBlockReport] = useState(false);
  const [blockReportMode, setBlockReportMode] = useState<'block' | 'report'>('report');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const isGroup = type === 'pod' || type === 'event' || type === 'group';

  return (
    <>
      <div className="flex items-center gap-2 h-14 px-3 border-b bg-background/95 backdrop-blur shrink-0">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push('/chat')}
          className="shrink-0 min-w-[44px] min-h-[44px]"
          aria-label="Back to messages"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Title and info */}
        <div className="flex-1 min-w-0 ml-1">
          <h1 className="text-sm font-semibold truncate">{title}</h1>
          {isGroup && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{memberCount} members</span>
            </div>
          )}
        </div>

        {/* Options menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'inline-flex items-center justify-center rounded-lg p-2 min-w-[44px] min-h-[44px]',
              'hover:bg-muted transition-colors'
            )}
            aria-label="Chat options"
          >
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" sideOffset={4}>
            {showBlockOption && (
              <DropdownMenuItem
                onClick={() => {
                  setBlockReportMode('block');
                  setShowBlockReport(true);
                }}
              >
                <Ban className="h-4 w-4 mr-2" />
                Block User
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                setBlockReportMode('report');
                setShowBlockReport(true);
              }}
            >
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setShowLeaveConfirm(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Leave Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Leave confirmation */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-base font-semibold mb-2">Leave Conversation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to leave this conversation? You will no longer receive messages from this chat.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowLeaveConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onLeave();
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Block/Report dialog */}
      <BlockReportDialog
        open={showBlockReport}
        onOpenChange={setShowBlockReport}
        mode={blockReportMode}
        onConfirm={(reason, description) => {
          if (blockReportMode === 'block' && onBlock) {
            onBlock();
          }
          setShowBlockReport(false);
        }}
      />
    </>
  );
}
