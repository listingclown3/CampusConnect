'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Copy, Check } from 'lucide-react';

interface ConversationStarterProps {
  message: string;
  targetUserId: string;
}

export function ConversationStarter({ message, targetUserId }: ConversationStarterProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseMessage = () => {
    router.push(`/chat?user=${targetUserId}&message=${encodeURIComponent(message)}`);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <MessageCircle className="w-4 h-4" />
          <span>Suggested first message</span>
        </div>
        <p className="text-sm text-foreground italic leading-relaxed">
          &ldquo;{message}&rdquo;
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleUseMessage}
            className="flex-1 sm:flex-none"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Use this message
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleCopy}
            title="Copy message"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
