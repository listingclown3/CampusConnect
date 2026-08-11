'use client';

import { useState } from 'react';
import type { ConnectionType } from '@/types/database';
import type { SpartanOnboardingState, SpartanStep } from './types';
import { CONNECTION_LABEL_MAP } from './types';
import { sanitizeText } from '@/lib/validation/text';

const CUSTOM_SKILL_MAX_LENGTH = 40;
const MAX_CUSTOM_SKILLS = 10;

const exampleSkills = [
  'Coding 💻', 'Designing 🎨', 'Research 🔎', 'Speaking 🎤',
  'Teamwork 🌟', 'Tutoring 📚', 'Writing ✍️',
];

const exampleConnections = Object.keys(CONNECTION_LABEL_MAP);

interface SkillsStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
}

export function SkillsStep({ state, updateState, setStep }: SkillsStepProps) {
  const [customSkill, setCustomSkill] = useState('');

  function toggleSkill(skill: string) {
    updateState(
      'selectedSkills',
      state.selectedSkills.includes(skill)
        ? state.selectedSkills.filter((s) => s !== skill)
        : [...state.selectedSkills, skill]
    );
  }

  function addCustomSkill() {
    const cleaned = sanitizeText(customSkill, CUSTOM_SKILL_MAX_LENGTH);
    if (!cleaned || state.customSkills.length >= MAX_CUSTOM_SKILLS) {
      setCustomSkill('');
      return;
    }
    const exists = [...state.selectedSkills, ...state.customSkills].some(
      (s) => s.toLowerCase() === cleaned.toLowerCase()
    );
    if (!exists) updateState('customSkills', [...state.customSkills, cleaned]);
    setCustomSkill('');
  }

  function removeCustomSkill(skill: string) {
    updateState('customSkills', state.customSkills.filter((s) => s !== skill));
  }

  function toggleConnection(label: string) {
    const value = CONNECTION_LABEL_MAP[label];
    updateState(
      'selectedConnections',
      state.selectedConnections.includes(value)
        ? state.selectedConnections.filter((c) => c !== value)
        : [...state.selectedConnections, value]
    );
  }

  return (
    <div className="skills-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="skills-image" src="/onboarding/skills.png" alt="Skills page" />

      <div className="skill-options">
        {exampleSkills.map((skill) => {
          const isSelected = state.selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              className={`skill-option-button ${isSelected ? 'skill-selected' : ''}`}
              onClick={() => toggleSkill(skill)}
            >
              {isSelected ? '✓' : '+'} {skill}
            </button>
          );
        })}
      </div>

      <div className="custom-skill-row">
        <input
          type="text"
          className="custom-skill-input"
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomSkill();
            }
          }}
          placeholder="Add a custom skill..."
          maxLength={CUSTOM_SKILL_MAX_LENGTH}
        />
        <button type="button" className="add-skill-button" onClick={addCustomSkill}>Add</button>
      </div>

      {state.customSkills.length > 0 && (
        <div className="custom-skill-list">
          {state.customSkills.map((skill) => (
            <div key={skill} className="custom-skill-tag">
              <span>{skill}</span>
              <button
                type="button"
                className="remove-skill-button"
                onClick={() => removeCustomSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="connection-options">
        {exampleConnections.map((label) => {
          const isSelected = state.selectedConnections.includes(CONNECTION_LABEL_MAP[label] as ConnectionType);
          return (
            <button
              key={label}
              type="button"
              className={`connection-option-button ${isSelected ? 'connection-selected' : ''}`}
              onClick={() => toggleConnection(label)}
            >
              {isSelected ? '✓' : '+'} {label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="skills-back-button"
        onClick={() => setStep('interests')}
        aria-label="Go back to interests"
      />
      <button
        type="button"
        className="skills-next-button"
        onClick={() => setStep('availability')}
        aria-label="Continue to availability"
      />
    </div>
  );
}
