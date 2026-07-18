'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  sendVerificationEmail,
  verifyEmailCode,
  getVerificationState,
  isEmailVerified,
  resendVerificationEmail,
} from '@/lib/email/service';
import { toast } from 'sonner';
import { Mail, CheckCircle2, Shield, Send, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmailVerification() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify' | 'verified'>('input');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check existing verification state
    const state = getVerificationState();
    if (state?.verified) {
      setStep('verified');
      setEmail(state.email);
    } else if (state && !state.verified) {
      setStep('verify');
      setEmail(state.email);
    }
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    const result = sendVerificationEmail(email.trim());
    if (result.success) {
      setDemoCode(result.code);
      setStep('verify');
      setCountdown(60);
      toast.success('Verification code sent!', {
        description: `Demo mode: Your code is ${result.code}`,
        duration: 10000,
      });
    }
  };

  const handleVerify = () => {
    if (!code.trim() || code.trim().length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    const result = verifyEmailCode(code.trim());
    if (result.success) {
      setStep('verified');
      setDemoCode(null);
      toast.success('Email verified successfully!');
    } else {
      toast.error(result.error || 'Verification failed');
    }
  };

  const handleResend = () => {
    const result = resendVerificationEmail();
    if ('code' in result && result.success) {
      setDemoCode(result.code);
      setCountdown(60);
      toast.success('New code sent!', {
        description: `Demo mode: Your code is ${result.code}`,
        duration: 10000,
      });
    } else if ('error' in result) {
      toast.error(result.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'verified' ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Email Verified
              </p>
              <p className="text-xs text-green-600/80 dark:text-green-500">
                {email} &mdash; You&apos;ll receive notifications at this address
              </p>
            </div>
          </div>
        ) : step === 'verify' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <Shield className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            {/* Demo code display */}
            {demoCode && (
              <div className="p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-center">
                <p className="text-[10px] text-amber-600 uppercase tracking-wide font-medium">Demo Mode - Your Code</p>
                <p className="text-2xl font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest mt-1">
                  {demoCode}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs">Verification Code</Label>
              <Input
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleResend}
                disabled={countdown > 0}
                className={cn(
                  'flex items-center gap-1 text-xs transition-colors',
                  countdown > 0
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-primary hover:underline'
                )}
              >
                <RefreshCw className="w-3 h-3" />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
              </button>
              <Button size="sm" onClick={handleVerify}>
                Verify
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Verify your email to receive notifications about messages, events, pod updates, and more.
            </p>
            <div className="space-y-2">
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                placeholder="your.email@sjsu.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleSendCode} className="w-full gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Send Verification Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
