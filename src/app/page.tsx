'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, UsersRound, MessageCircle, Calendar, ArrowRight, Sparkles,
  Zap, Shield, Globe, BookOpen, Target, ChevronRight, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth/context';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Users,
    title: 'Smart Matching',
    description: 'AI-powered compatibility scoring based on your classes, interests, goals, and schedule. Find people who truly align with you.',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    icon: UsersRound,
    title: 'Study Pods',
    description: 'Small collaborative groups matched by class, learning style, and availability. Never study alone again.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    description: 'Instant messaging with matches, pod members, and event groups. Stay connected with your campus circle.',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    icon: Calendar,
    title: 'Events & Clubs',
    description: 'Discover campus happenings tailored to your interests. RSVP, export to your calendar, and never miss out.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
  },
];

const stats = [
  { value: '25+', label: 'Active Students' },
  { value: '10+', label: 'Campus Clubs' },
  { value: '15+', label: 'Weekly Events' },
  { value: '95%', label: 'Match Accuracy' },
];

const testimonials = [
  {
    name: 'Aisha P.',
    major: 'Computer Science',
    quote: 'Found my study group for CS 146 in minutes. We meet every Thursday and my grades have never been better!',
    rating: 5,
  },
  {
    name: 'Jordan W.',
    major: 'Business Administration',
    quote: 'The matching algorithm actually works. Met my co-founder for our startup through SpartanCircle.',
    rating: 5,
  },
  {
    name: 'Sofia R.',
    major: 'Software Engineering',
    quote: 'I transferred here knowing no one. Within a week I had a pod, joined 3 clubs, and made real friends.',
    rating: 5,
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Add your major, classes, interests, skills, and availability. The more you share, the better your matches.',
    icon: Target,
  },
  {
    step: '02',
    title: 'Get Matched',
    description: 'Our algorithm scores compatibility across 6 dimensions: classes, major, interests, goals, skills, and schedule.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Connect & Grow',
    description: 'Join pods, chat with matches, attend events, and build your campus community. It all starts here.',
    icon: Zap,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { demoLogin, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 sm:py-28 bg-gradient-to-br from-[#0055A2] via-[#1a6ab8] to-[#003d75] text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#E5A823]/10 blur-2xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-white/3 blur-2xl" />
          {/* Floating dots */}
          <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-[#E5A823] animate-bounce" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-[30%] w-2.5 h-2.5 rounded-full bg-[#E5A823]/70 animate-bounce" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[60%] right-[10%] w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '2s' }} />
        </div>

        <div className={cn(
          'relative z-10 text-center max-w-3xl mx-auto space-y-8 transition-all duration-1000',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#E5A823] animate-pulse" />
            Built for SJSU students &middot; Free forever
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Your Campus.
            <br />
            <span className="text-[#E5A823]">Your Circle.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/85 max-w-xl mx-auto leading-relaxed">
            The smartest way to find friends, study partners, and collaborators at San Jose State.
            Powered by compatibility matching that actually works.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-[#E5A823] hover:bg-[#c48d1a] text-black font-bold px-10 h-14 text-base rounded-xl shadow-lg shadow-[#E5A823]/20 hover:shadow-[#E5A823]/30 transition-all hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white px-10 h-14 text-base rounded-xl backdrop-blur-sm transition-all hover:scale-105"
            >
              Try Demo
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 pt-6 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              .edu verified
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              SJSU exclusive
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Class-aware matching
            </span>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative -mt-8 z-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'bg-background border rounded-xl p-4 text-center shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-1',
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${i * 100 + 300}ms` }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-4 py-20 sm:py-24 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to <span className="text-primary">connect</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              From smart matching to study pods to real-time chat &mdash; SpartanCircle brings your campus community together in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className={cn(
                  'border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden group',
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${i * 100 + 600}ms` }}
              >
                {/* Gradient top line */}
                <div className={cn('h-1 w-full bg-gradient-to-r', feature.color)} />
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform', feature.bgColor)}>
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-2">{feature.title}</h3>
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

      {/* ===== HOW IT WORKS ===== */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Three simple steps to find your people at SJSU.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {/* Connector line (hidden on mobile, hidden for last item) */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex flex-col items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-2">Step {item.step}</span>
                  <h3 className="font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-4 py-20 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Students love SpartanCircle
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Real stories from SJSU students who found their community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Card key={i} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#E5A823] text-[#E5A823]" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.major}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-4 py-20 bg-gradient-to-br from-[#0055A2] to-[#003d75] text-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to find your circle?
          </h2>
          <p className="text-white/80 text-base max-w-md mx-auto">
            Join hundreds of SJSU students already connecting, collaborating, and building lasting friendships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-[#E5A823] hover:bg-[#c48d1a] text-black font-bold px-10 h-14 text-base rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Join SpartanCircle
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white px-10 h-14 text-base rounded-xl transition-all hover:scale-105"
            >
              Explore Demo
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-4 py-8 border-t bg-muted/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              <span className="text-primary">Spartan</span>
              <span className="text-[#E5A823]">Circle</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Built for SJSU students, by SJSU students. &copy; 2024
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
