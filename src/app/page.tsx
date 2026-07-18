'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UsersRound, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/context';

const features = [
  {
    icon: Users,
    title: 'Match',
    description: 'Find compatible friends, study buddies, and project partners based on your profile.',
  },
  {
    icon: UsersRound,
    title: 'Pods',
    description: 'Join small study groups matched by class, goals, and schedule compatibility.',
  },
  {
    icon: MessageCircle,
    title: 'Chat',
    description: 'Start conversations with matches, pod members, and event attendees.',
  },
  {
    icon: Calendar,
    title: 'Campus',
    description: 'Discover events, clubs, and activities relevant to your interests.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { demoLogin, isAuthenticated } = useAuth();

  const handleDemoLogin = () => {
    demoLogin();
    router.push('/dashboard');
  };

  const handleGetStarted = () => {
    router.push('/signup');
  };

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-[#0055A2] via-[#1a6ab8] to-[#003d75] text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-[#E5A823]/10" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#E5A823] animate-pulse" />
            Built for SJSU students
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Spartan<span className="text-[#E5A823]">Circle</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 max-w-lg mx-auto leading-relaxed">
            Find your campus community. Connect with compatible friends, study buddies, and project partners before the semester starts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-[#E5A823] hover:bg-[#c48d1a] text-black font-semibold px-8 h-12 text-base"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white px-8 h-12 text-base"
            >
              Demo Login
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-4 py-16 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Everything you need to connect
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            Smart matching, study pods, real-time chat, and campus event discovery all in one place.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t bg-muted/30">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>SpartanCircle - Built for SJSU students, by SJSU students</p>
        </div>
      </footer>
    </div>
  );
}
