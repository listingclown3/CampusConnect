'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Class, Profile } from '@/types/database';
import { useAuth } from '@/lib/auth/context';
import { saveUserClasses } from '@/lib/data/client';
import { sanitizeText, sanitizeTextList } from '@/lib/validation/text';
import { toast } from 'sonner';
import './spartan-onboarding.css';

import { LandingStep } from './landing-step';
import { BasicsStep } from './basics-step';
import { AcademicsStep } from './academics-step';
import { InterestsStep } from './interests-step';
import { SkillsStep } from './skills-step';
import { AvailabilityStep } from './availability-step';
import { PrivacyStep } from './privacy-step';
import {
  DEFAULT_SPARTAN_STATE,
  deriveAvailability,
  isValidMajor,
  normalizeMajor,
  type SpartanOnboardingState,
  type SpartanStep,
} from './types';

const NAME_MAX_LENGTH = 50;
const CAREER_GOAL_MAX_LENGTH = 60;
const MAX_CAREER_GOALS = 5;

interface SpartanOnboardingProps {
  initialClasses: Class[];
}

export function SpartanOnboarding({ initialClasses }: SpartanOnboardingProps) {
  const router = useRouter();
  const { user, userId, updateProfile } = useAuth();
  const [step, setStep] = useState<SpartanStep>('landing');
  const [state, setState] = useState<SpartanOnboardingState>(DEFAULT_SPARTAN_STATE);
  const [isSaving, setIsSaving] = useState(false);

  const updateState = useCallback(
    <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goToAcademics = useCallback(() => {
    if (!state.firstName.trim() || !state.lastName.trim()) {
      toast.error('Please enter your first and last name.');
      return;
    }
    setStep('academics');
  }, [state.firstName, state.lastName]);

  const goToInterests = useCallback(() => {
    if (!isValidMajor(state.major)) {
      toast.error('Please select a major from the list.');
      return;
    }
    setStep('interests');
  }, [state.major]);

  const handleComplete = useCallback(async () => {
    if (!userId) return;
    if (!state.firstName.trim() || !state.lastName.trim()) {
      toast.error('Please go back and enter your first and last name.');
      setStep('basic');
      return;
    }
    if (!isValidMajor(state.major)) {
      toast.error('Please go back and select a major from the list.');
      setStep('academics');
      return;
    }
    setIsSaving(true);
    try {
      const firstName = sanitizeText(state.firstName, NAME_MAX_LENGTH) || user?.first_name || '';
      const lastName = sanitizeText(state.lastName, NAME_MAX_LENGTH) || user?.last_name || '';
      const careerGoals = sanitizeTextList(state.careerGoals.split(','), {
        maxItems: MAX_CAREER_GOALS,
        maxLengthPerItem: CAREER_GOAL_MAX_LENGTH,
      });
      // Emoji-suffixed labels ("Music 🎵") are how SpartanCircle's UI displays
      // options, but stored interests/skills should stay plain text so they
      // still match against the rest of the app's data during scoring.
      const stripEmoji = (s: string) => s.replace(/\s*[^\w\s,.'-]+\s*$/u, '').trim();

      const base: Profile =
        user ?? {
          id: '',
          user_id: userId,
          first_name: '',
          last_name: '',
          display_name: '',
          avatar_url: null,
          bio: null,
          student_type: 'freshman',
          major: '',
          intended_major: null,
          graduation_year: state.graduationYear,
          interests: [],
          skills: [],
          career_goals: [],
          study_style: 'flexible',
          collaboration_style: 'adaptive',
          connection_types: [],
          availability: deriveAvailability([]),
          linkedin_url: null,
          instagram_handle: null,
          is_visible: true,
          onboarding_complete: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

      const updatedProfile: Profile = {
        ...base,
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName.charAt(0)}.`,
        student_type: state.studentType,
        graduation_year: state.graduationYear,
        avatar_url: state.avatarDataUrl,
        major: normalizeMajor(state.major) ?? base.major,
        intended_major: normalizeMajor(state.plannedMajor),
        interests: [
          ...state.selectedInterests.map(stripEmoji),
          ...state.customInterests,
        ],
        career_goals: careerGoals,
        study_style: state.studyStyle,
        collaboration_style: state.collaborationStyle,
        skills: [...state.selectedSkills.map(stripEmoji), ...state.customSkills],
        connection_types: state.selectedConnections,
        availability: deriveAvailability(state.classMeetings),
        linkedin_url: state.linkedinUrl || null,
        instagram_handle: state.instagramHandle || null,
        is_visible: state.profileVisible,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      };

      const result = await updateProfile(updatedProfile);
      if (!result.success) {
        toast.error(result.error || 'Could not save your profile. Please try again.');
        return;
      }
      await saveUserClasses(userId, state.selectedClasses.map((c) => c.id));

      toast.success('Profile complete! Welcome to SpartanCircle.');
      router.push('/dashboard');
    } finally {
      setIsSaving(false);
    }
  }, [state, user, userId, updateProfile, router]);

  switch (step) {
    case 'landing':
      return <LandingStep setStep={setStep} />;
    case 'basic':
      return <BasicsStep state={state} updateState={updateState} setStep={setStep} onNext={goToAcademics} />;
    case 'academics':
      return (
        <AcademicsStep
          state={state}
          updateState={updateState}
          setStep={setStep}
          onNext={goToInterests}
          availableClasses={initialClasses}
        />
      );
    case 'interests':
      return <InterestsStep state={state} updateState={updateState} setStep={setStep} />;
    case 'skills':
      return <SkillsStep state={state} updateState={updateState} setStep={setStep} />;
    case 'availability':
      return <AvailabilityStep state={state} updateState={updateState} setStep={setStep} />;
    case 'privacy':
      return (
        <PrivacyStep
          state={state}
          updateState={updateState}
          setStep={setStep}
          onComplete={handleComplete}
          isSaving={isSaving}
        />
      );
  }
}
