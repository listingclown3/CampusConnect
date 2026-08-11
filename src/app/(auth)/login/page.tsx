'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/context';
import { PIXEL_BUTTON, PIXEL_FONT } from '@/lib/pixel-style';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword, sendMagicLink, demoLogin, isSupabaseAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSupabaseAuth) {
      const result = await sendMagicLink(email);
      if (result.success) {
        setLinkSent(true);
      } else {
        setError(result.error || 'Could not send sign-in link');
      }
    } else {
      const result = loginWithPassword(email, password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    }
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    demoLogin();
    router.push('/dashboard');
  };

  if (linkSent) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2">
          <Image
            src="/images/sammy-mascot.png"
            alt="Sammy the Spartan"
            width={56}
            height={56}
            className="mx-auto rounded-full"
          />
          <CardTitle className={`text-2xl font-bold ${PIXEL_FONT}`}>Check your email</CardTitle>
          <CardDescription>
            We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>.
            Click it to continue &mdash; you can close this tab.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={() => setLinkSent(false)}>
            Use a different email
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="text-center space-y-2">
        <Image
          src="/images/sammy-mascot.png"
          alt="Sammy the Spartan"
          width={56}
          height={56}
          className="mx-auto rounded-full"
        />
        <CardTitle className={`text-2xl font-bold ${PIXEL_FONT}`}>
          Welcome to <span className="text-primary">Spartan</span><span className="text-[#E5A823]">Circle</span>
        </CardTitle>
        <CardDescription>Sign in with your SJSU email to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="yourname@sjsu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Use your @sjsu.edu email address</p>
          </div>

          {!isSupabaseAuth && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button type="submit" className={`w-full h-11 ${PIXEL_BUTTON}`} disabled={isLoading}>
            {isLoading
              ? isSupabaseAuth ? 'Sending link...' : 'Signing in...'
              : isSupabaseAuth ? 'Send Sign-In Link' : 'Sign In'}
          </Button>
        </form>

        {!isSupabaseAuth && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className={`w-full h-11 ${PIXEL_BUTTON}`}
              onClick={handleDemoLogin}
            >
              Try Demo Login
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
