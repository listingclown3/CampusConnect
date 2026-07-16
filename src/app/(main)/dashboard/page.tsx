'use client';

import { useAuth } from '@/lib/auth/context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UsersRound, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.first_name || 'Spartan'}!
        </h1>
        <p className="text-muted-foreground">
          Here is what is happening in your circle today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link href="/matches">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Matches</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/pods">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UsersRound className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Pods</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/chat">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Chat</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/campus">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Campus</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground w-24">Major</span>
            <span className="font-medium">{user?.major || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground w-24">Study Style</span>
            <span className="font-medium capitalize">{user?.study_style || 'Not set'}</span>
          </div>
          <div className="flex items-start gap-4 text-sm">
            <span className="text-muted-foreground w-24">Interests</span>
            <div className="flex flex-wrap gap-1.5">
              {user?.interests?.slice(0, 5).map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
