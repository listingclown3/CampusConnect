'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InterestTags } from '@/components/onboarding/interest-tags';
import { useAuth } from '@/lib/auth/context';
import type { Profile, StudentType, StudyStyle, CollaborationStyle } from '@/types/database';
import { toast } from 'sonner';

const MAJOR_OPTIONS = [
  'Computer Science',
  'Software Engineering',
  'Computer Engineering',
  'Data Science',
  'Business Administration',
  'Biology',
  'Psychology',
  'Communication Studies',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Art & Design',
  'English',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Nursing',
  'Kinesiology',
  'Music',
  'Undeclared',
];

const INTEREST_OPTIONS = [
  'Technology', 'Music', 'Sports', 'Art', 'Gaming', 'Reading', 'Cooking', 'Travel',
  'Photography', 'Fitness', 'Dance', 'Film', 'Writing', 'Volunteering', 'Outdoors',
  'Fashion', 'Science', 'Entrepreneurship', 'Languages', 'Social Justice',
];

const SKILL_OPTIONS = [
  'JavaScript', 'Python', 'Java', 'React', 'Machine Learning', 'Data Analysis',
  'UI/UX Design', 'Public Speaking', 'Project Management', 'Writing', 'Marketing',
  'Research', 'Leadership', 'Graphic Design', 'Video Editing',
];

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [studentType, setStudentType] = useState<StudentType>(user?.student_type || 'freshman');
  const [major, setMajor] = useState(user?.major || '');
  const [gradYear, setGradYear] = useState(user?.graduation_year || 2028);
  const [studyStyle, setStudyStyle] = useState<StudyStyle>(user?.study_style || 'flexible');
  const [collaborationStyle, setCollaborationStyle] = useState<CollaborationStyle>(user?.collaboration_style || 'adaptive');
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [careerGoals, setCareerGoals] = useState(user?.career_goals?.join(', ') || '');

  const handleSave = () => {
    if (!user) return;

    const updated: Profile = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      display_name: `${firstName} ${lastName.charAt(0)}.`,
      bio,
      student_type: studentType,
      major,
      graduation_year: gradYear,
      study_style: studyStyle,
      collaboration_style: collaborationStyle,
      interests,
      skills,
      career_goals: careerGoals.split(',').map((g) => g.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    updateProfile(updated);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell others about yourself..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Student Type</Label>
              <Select value={studentType} onValueChange={(v) => v && setStudentType(v as StudentType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="freshman">Freshman</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="continuing">Continuing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Graduation Year</Label>
              <Select value={String(gradYear)} onValueChange={(v) => v && setGradYear(parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Major</Label>
            <Select value={major} onValueChange={(v) => v && setMajor(v)}>
              <SelectTrigger><SelectValue placeholder="Select major" /></SelectTrigger>
              <SelectContent>
                {MAJOR_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Study Style</Label>
              <Select value={studyStyle} onValueChange={(v) => v && setStudyStyle(v as StudyStyle)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Collaboration</Label>
              <Select value={collaborationStyle} onValueChange={(v) => v && setCollaborationStyle(v as CollaborationStyle)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="adaptive">Adaptive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Career Goals</Label>
            <Textarea value={careerGoals} onChange={(e) => setCareerGoals(e.target.value)} rows={2} placeholder="Separate with commas..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <InterestTags options={INTEREST_OPTIONS} value={interests} onChange={setInterests} maxTags={10} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <InterestTags options={SKILL_OPTIONS} value={skills} onChange={setSkills} maxTags={10} />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full h-11">
        Save Changes
      </Button>
    </div>
  );
}
