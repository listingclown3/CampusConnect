'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepIndicator } from '@/components/onboarding/step-indicator';
import { AvailabilityGrid, DEFAULT_AVAILABILITY } from '@/components/onboarding/availability-grid';
import { InterestTags } from '@/components/onboarding/interest-tags';
import { ClassSearch } from '@/components/onboarding/class-search';
import { CampusWatermark } from '@/components/marketing/campus-watermark';
import { useAuth } from '@/lib/auth/context';
import { STORAGE_KEYS } from '@/lib/data/storage';
import { sanitizeText, sanitizeTextList } from '@/lib/validation/text';
import { PIXEL_BUTTON, PIXEL_FONT } from '@/lib/pixel-style';
import { Calendar } from 'lucide-react';
import type { Profile, StudentType, StudyStyle, CollaborationStyle, ConnectionType, Availability, Class } from '@/types/database';
import { toast } from 'sonner';

const TOTAL_STEPS = 6;
const NAME_MAX_LENGTH = 50;
const CAREER_GOALS_MAX_LENGTH = 300;
const MAX_CAREER_GOALS = 5;
const CAREER_GOAL_MAX_LENGTH = 60;

const STEP_LABELS = [
  'Basics',
  'Academics',
  'Interests & Goals',
  'Skills & Connections',
  'Availability',
  'Privacy',
];

const STEP_TIPS = [
  "Hi, I'm Sammy! Let's set up your profile.",
  'What are you studying? Add your classes so I can find study buddies for you.',
  "The more you share, the better I can match you with your circle.",
  'Skills go both ways — teach something, learn something.',
  'Set your free time and I\'ll find people who are free too.',
  'Almost done — you control what your circle can see.',
];

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
  'Technology',
  'Music',
  'Sports',
  'Art',
  'Gaming',
  'Reading',
  'Cooking',
  'Travel',
  'Photography',
  'Fitness',
  'Dance',
  'Film',
  'Writing',
  'Volunteering',
  'Outdoors',
  'Fashion',
  'Science',
  'Entrepreneurship',
  'Languages',
  'Social Justice',
];

const SKILL_OPTIONS = [
  'JavaScript',
  'Python',
  'Java',
  'React',
  'Machine Learning',
  'Data Analysis',
  'UI/UX Design',
  'Public Speaking',
  'Project Management',
  'Writing',
  'Marketing',
  'Research',
  'Leadership',
  'Graphic Design',
  'Video Editing',
];

const CONNECTION_TYPE_OPTIONS: { value: ConnectionType; label: string }[] = [
  { value: 'friends', label: 'Friends' },
  { value: 'study_buddies', label: 'Study Buddies' },
  { value: 'project_partners', label: 'Project Partners' },
  { value: 'club_buddies', label: 'Club Buddies' },
  { value: 'commute_buddies', label: 'Commute Buddies' },
  { value: 'career_networking', label: 'Career / Networking' },
];

interface FormData {
  first_name: string;
  last_name: string;
  student_type: StudentType;
  graduation_year: number;
  major: string;
  intended_major: string;
  classes: string[];
  interests: string[];
  career_goals: string;
  study_style: StudyStyle;
  collaboration_style: CollaborationStyle;
  skills: string[];
  connection_types: ConnectionType[];
  availability: Availability;
  is_visible: boolean;
  show_email: boolean;
  availability_detail: 'full' | 'limited' | 'hidden';
}

interface OnboardingFormProps {
  initialClasses: Class[];
}

export function OnboardingForm({ initialClasses }: OnboardingFormProps) {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  // Restore saved progress from localStorage
  const getSavedProgress = (): { step: number; formData: FormData } | null => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore parse errors
    }
    return null;
  };

  const savedProgress = getSavedProgress();

  const [step, setStep] = useState(savedProgress?.step || 1);
  const [formData, setFormData] = useState<FormData>(() => {
    if (savedProgress?.formData) {
      return savedProgress.formData;
    }
    return {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      student_type: user?.student_type || 'freshman',
      graduation_year: user?.graduation_year || 2028,
      major: user?.major || '',
      intended_major: user?.intended_major || '',
      classes: [],
      interests: user?.interests || [],
      career_goals: user?.career_goals?.join(', ') || '',
      study_style: user?.study_style || 'flexible',
      collaboration_style: user?.collaboration_style || 'adaptive',
      skills: user?.skills || [],
      connection_types: user?.connection_types || [],
      availability: user?.availability || DEFAULT_AVAILABILITY,
      is_visible: true,
      show_email: false,
      availability_detail: 'full',
    };
  });

  // Persist progress to localStorage whenever step or formData changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const progress = JSON.stringify({ step, formData });
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, progress);
    } catch {
      // Storage full or unavailable - non-critical
    }
  }, [step, formData]);

  const clearSavedProgress = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS);
  }, []);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Step 1 (name) and step 2 (major) are required before continuing;
  // everything else is optional.
  const canContinue =
    step !== 1 || (formData.first_name.trim().length > 0 && formData.last_name.trim().length > 0);
  const canComplete = formData.major.trim().length > 0;

  const next = () => {
    if (step === 1 && !canContinue) {
      toast.error('First and last name are required.');
      return;
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    if (!user) return;

    if (!canComplete) {
      toast.error('Select a major before finishing setup.');
      setStep(2);
      return;
    }

    const firstName = sanitizeText(formData.first_name, NAME_MAX_LENGTH) || user.first_name;
    const lastName = sanitizeText(formData.last_name, NAME_MAX_LENGTH) || user.last_name;
    const careerGoals = sanitizeTextList(formData.career_goals.split(','), {
      maxItems: MAX_CAREER_GOALS,
      maxLengthPerItem: CAREER_GOAL_MAX_LENGTH,
    });

    const updatedProfile: Profile = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      display_name: `${firstName} ${lastName.charAt(0)}.`,
      student_type: formData.student_type,
      graduation_year: formData.graduation_year,
      major: formData.major || user.major,
      intended_major: formData.intended_major || null,
      interests: formData.interests,
      career_goals: careerGoals,
      study_style: formData.study_style,
      collaboration_style: formData.collaboration_style,
      skills: formData.skills,
      connection_types: formData.connection_types,
      availability: formData.availability,
      is_visible: formData.is_visible,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    };

    updateProfile(updatedProfile);
    clearSavedProgress();
    toast.success('Profile complete! Welcome to SpartanCircle.');
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4 py-8 bg-gradient-to-br from-[#0055A2]/5 via-background to-[#E5A823]/5">
      <CampusWatermark />
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-2xl font-bold ${PIXEL_FONT}`}>
            <span className="text-primary">Spartan</span>
            <span className="text-[#E5A823]">Circle</span>
          </h1>
          <p className="text-muted-foreground text-sm">Set up your profile to start connecting</p>
        </div>

        {/* Sammy mascot + contextual tip */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/sammy-mascot.png"
            alt="Sammy the Spartan"
            width={56}
            height={56}
            className="rounded-full shrink-0"
          />
          <div className="relative flex-1 rounded-2xl border bg-card px-4 py-2.5 text-sm text-card-foreground shadow-sm">
            {STEP_TIPS[step - 1]}
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

        {/* Step content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{STEP_LABELS[step - 1]}</CardTitle>
            <CardDescription>
              {step === 1 && 'Tell us a bit about yourself'}
              {step === 2 && 'What are you studying?'}
              {step === 3 && 'What are you passionate about?'}
              {step === 4 && 'What skills do you bring and what are you looking for?'}
              {step === 5 && 'When are you free to connect?'}
              {step === 6 && 'Control who can see your profile'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Basics */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => updateField('first_name', sanitizeText(e.target.value, NAME_MAX_LENGTH))}
                      placeholder="First name"
                      maxLength={NAME_MAX_LENGTH}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => updateField('last_name', sanitizeText(e.target.value, NAME_MAX_LENGTH))}
                      placeholder="Last name"
                      maxLength={NAME_MAX_LENGTH}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Student Type</Label>
                  <Select
                    value={formData.student_type}
                    onValueChange={(v) => v && updateField('student_type', v as StudentType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freshman">Freshman</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="continuing">Continuing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduation_year">Expected Graduation Year</Label>
                  <Select
                    value={String(formData.graduation_year)}
                    onValueChange={(v) => v && updateField('graduation_year', parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-semibold">
                      {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <Button variant="outline" size="sm" type="button">
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Academics */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Major</Label>
                  <Select
                    value={formData.major}
                    onValueChange={(v) => v && updateField('major', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAJOR_OPTIONS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.major === 'Undeclared' && (
                  <div className="space-y-2">
                    <Label>Intended Major (optional)</Label>
                    <Select
                      value={formData.intended_major}
                      onValueChange={(v) => v && updateField('intended_major', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select intended major" />
                      </SelectTrigger>
                      <SelectContent>
                        {MAJOR_OPTIONS.filter((m) => m !== 'Undeclared').map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Classes (search and add your current classes)</Label>
                  <ClassSearch
                    classes={initialClasses}
                    value={formData.classes}
                    onChange={(classes) => updateField('classes', classes)}
                  />
                </div>
              </>
            )}

            {/* Step 3: Interests & Goals */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Interests</Label>
                  <InterestTags
                    options={INTEREST_OPTIONS}
                    value={formData.interests}
                    onChange={(tags) => updateField('interests', tags)}
                    placeholder="Add custom interest..."
                    maxTags={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career_goals">Career Goals</Label>
                  <Textarea
                    id="career_goals"
                    value={formData.career_goals}
                    onChange={(e) => updateField('career_goals', e.target.value.slice(0, CAREER_GOALS_MAX_LENGTH))}
                    placeholder="e.g., Software Engineer, UX Designer, Data Scientist"
                    rows={2}
                    maxLength={CAREER_GOALS_MAX_LENGTH}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple goals with commas (up to {MAX_CAREER_GOALS})
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Study Style</Label>
                  <Select
                    value={formData.study_style}
                    onValueChange={(v) => v && updateField('study_style', v as StudyStyle)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How do you prefer to study?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo - I focus best alone</SelectItem>
                      <SelectItem value="partner">Partner - One study buddy is ideal</SelectItem>
                      <SelectItem value="group">Group - I thrive in group settings</SelectItem>
                      <SelectItem value="flexible">Flexible - Depends on the subject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Collaboration Style</Label>
                  <Select
                    value={formData.collaboration_style}
                    onValueChange={(v) => v && updateField('collaboration_style', v as CollaborationStyle)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How do you work in teams?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leader">Leader - I take charge and organize</SelectItem>
                      <SelectItem value="contributor">Contributor - I add to ideas and execute</SelectItem>
                      <SelectItem value="independent">Independent - I prefer my own tasks</SelectItem>
                      <SelectItem value="adaptive">Adaptive - I adjust to what the team needs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 4: Skills & Connections */}
            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <InterestTags
                    options={SKILL_OPTIONS}
                    value={formData.skills}
                    onChange={(tags) => updateField('skills', tags)}
                    placeholder="Add custom skill..."
                    maxTags={10}
                  />
                </div>

                <div className="space-y-2">
                  <Label>What types of connections are you looking for?</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {CONNECTION_TYPE_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={formData.connection_types.includes(opt.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateField('connection_types', [...formData.connection_types, opt.value]);
                            } else {
                              updateField('connection_types', formData.connection_types.filter((c) => c !== opt.value));
                            }
                          }}
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Availability */}
            {step === 5 && (
              <>
                <div className="space-y-2">
                  <Label>When are you available?</Label>
                  <p className="text-xs text-muted-foreground">Tap cells to toggle availability</p>
                  <AvailabilityGrid
                    value={formData.availability}
                    onChange={(a) => updateField('availability', a)}
                  />
                </div>

                <Button variant="outline" className="w-full gap-2" type="button">
                  <Calendar className="w-4 h-4" />
                  Import from Calendar
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Calendar sync coming soon. Set your availability manually for now.
                </p>
              </>
            )}

            {/* Step 6: Privacy */}
            {step === 6 && (
              <>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">Profile Visibility</p>
                      <p className="text-xs text-muted-foreground">Show your profile to other students</p>
                    </div>
                    <Checkbox
                      checked={formData.is_visible}
                      onCheckedChange={(checked) => updateField('is_visible', checked as boolean)}
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">Show Email Address</p>
                      <p className="text-xs text-muted-foreground">Let connections see your email</p>
                    </div>
                    <Checkbox
                      checked={formData.show_email}
                      onCheckedChange={(checked) => updateField('show_email', checked as boolean)}
                    />
                  </label>

                  <div className="space-y-2">
                    <Label>Availability Detail Level</Label>
                    <Select
                      value={formData.availability_detail}
                      onValueChange={(v) => v && updateField('availability_detail', v as 'full' | 'limited' | 'hidden')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How much availability to show" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full - Show all time slots</SelectItem>
                        <SelectItem value="limited">Limited - Show day availability only</SelectItem>
                        <SelectItem value="hidden">Hidden - Do not share availability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={prev}
              className="flex-1 h-11"
            >
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              onClick={next}
              disabled={!canContinue}
              className="flex-1 h-11"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canComplete}
              className={`flex-1 h-11 bg-[#E5A823] hover:bg-[#c48d1a] text-black font-semibold disabled:opacity-50 ${PIXEL_BUTTON}`}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
