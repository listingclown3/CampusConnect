'use client';

import { useState } from 'react';
import type { SpartanOnboardingState, SpartanStep } from './types';
import { STUDY_STYLE_MAP, COLLABORATION_STYLE_MAP } from './types';
import { sanitizeText } from '@/lib/validation/text';

const CUSTOM_INTEREST_MAX_LENGTH = 40;
const CAREER_GOALS_MAX_LENGTH = 150;
const MAX_CUSTOM_INTERESTS = 10;

const exampleInterests = [
  'Music 🎵', 'Sports 🏀', 'Art 🎨', 'Gaming 🎮', 'Reading 📚',
  'Travel ✈️', 'Cooking 🍳', 'Dance 💃', 'Theatre 🎭', 'Coding 💻',
];

interface InterestsStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
}

export function InterestsStep({ state, updateState, setStep }: InterestsStepProps) {
  const [customInterest, setCustomInterest] = useState('');
  const [studyStyleChoice, setStudyStyleChoice] = useState('');
  const [collaborationStyleChoice, setCollaborationStyleChoice] = useState('');

  function toggleInterest(interest: string) {
    updateState(
      'selectedInterests',
      state.selectedInterests.includes(interest)
        ? state.selectedInterests.filter((i) => i !== interest)
        : [...state.selectedInterests, interest]
    );
  }

  function addCustomInterest() {
    const cleaned = sanitizeText(customInterest, CUSTOM_INTEREST_MAX_LENGTH);
    if (!cleaned || state.customInterests.length >= MAX_CUSTOM_INTERESTS) {
      setCustomInterest('');
      return;
    }
    const exists = [...state.selectedInterests, ...state.customInterests].some(
      (i) => i.toLowerCase() === cleaned.toLowerCase()
    );
    if (!exists) updateState('customInterests', [...state.customInterests, cleaned]);
    setCustomInterest('');
  }

  function removeCustomInterest(interest: string) {
    updateState('customInterests', state.customInterests.filter((i) => i !== interest));
  }

  return (
    <div className="interests-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="interests-image" src="/onboarding/interests.png" alt="Interests and goals page" />

      <div className="interest-options">
        {exampleInterests.map((interest) => {
          const isSelected = state.selectedInterests.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              className={`interest-option-button ${isSelected ? 'interest-selected' : ''}`}
              onClick={() => toggleInterest(interest)}
            >
              {isSelected ? '✓' : '+'} {interest}
            </button>
          );
        })}
      </div>

      <div className="custom-interest-row">
        <input
          type="text"
          className="custom-interest-input"
          value={customInterest}
          onChange={(e) => setCustomInterest(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomInterest();
            }
          }}
          placeholder="Add a custom interest..."
          maxLength={CUSTOM_INTEREST_MAX_LENGTH}
        />
        <button type="button" className="add-interest-button" onClick={addCustomInterest}>Add</button>
      </div>

      {state.customInterests.length > 0 && (
        <div className="custom-interest-list">
          {state.customInterests.map((interest) => (
            <div key={interest} className="custom-interest-tag">
              <span>{interest}</span>
              <button
                type="button"
                className="remove-interest-button"
                onClick={() => removeCustomInterest(interest)}
                aria-label={`Remove ${interest}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        className="career-goals-input"
        value={state.careerGoals}
        onChange={(e) => updateState('careerGoals', e.target.value.slice(0, CAREER_GOALS_MAX_LENGTH))}
        placeholder="For example: teacher, filmmaker, nurse..."
        maxLength={CAREER_GOALS_MAX_LENGTH}
        rows={2}
      />

      <select
        className="study-style-dropdown"
        value={studyStyleChoice}
        onChange={(e) => {
          setStudyStyleChoice(e.target.value);
          updateState('studyStyle', STUDY_STYLE_MAP[e.target.value] ?? 'flexible');
        }}
      >
        <option value="">Select study style</option>
        <option value="quiet">Quiet and independent</option>
        <option value="music">With music or background noise</option>
        <option value="group">Group study sessions</option>
        <option value="visual">Visual notes and diagrams</option>
        <option value="practice">Practice problems and repetition</option>
        <option value="mixed">A mix of different methods</option>
      </select>

      <select
        className="collaboration-style-dropdown"
        value={collaborationStyleChoice}
        onChange={(e) => {
          setCollaborationStyleChoice(e.target.value);
          updateState('collaborationStyle', COLLABORATION_STYLE_MAP[e.target.value] ?? 'adaptive');
        }}
      >
        <option value="">Select collaboration style</option>
        <option value="leader">I like taking the lead</option>
        <option value="supporter">I prefer supporting the group</option>
        <option value="brainstormer">I enjoy brainstorming ideas</option>
        <option value="planner">I like organizing and planning</option>
        <option value="independent">I prefer working independently</option>
        <option value="flexible">I adapt to what the group needs</option>
      </select>

      <button
        type="button"
        className="interests-back-button"
        onClick={() => setStep('academics')}
        aria-label="Go back to academics"
      />
      <button
        type="button"
        className="interests-next-button"
        onClick={() => setStep('skills')}
        aria-label="Continue to skills"
      />
    </div>
  );
}
