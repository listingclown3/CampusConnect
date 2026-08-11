'use client';

import type { SpartanOnboardingState, SpartanStep } from './types';
import { sanitizeText } from '@/lib/validation/text';

const INSTAGRAM_MAX_LENGTH = 50;
const LINKEDIN_MAX_LENGTH = 120;

interface PrivacyStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
  onComplete: () => void;
  isSaving: boolean;
}

export function PrivacyStep({ state, updateState, setStep, onComplete, isSaving }: PrivacyStepProps) {
  return (
    <div className="privacy-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="privacy-image" src="/onboarding/privacy.png" alt="Privacy and socials page" />

      <div className="privacy-settings">
        <label className="privacy-option-card">
          <div className="privacy-option-text">
            <strong>Profile Visibility</strong>
            <span>Show your profile to other students</span>
          </div>
          <input
            type="checkbox"
            checked={state.profileVisible}
            onChange={(e) => updateState('profileVisible', e.target.checked)}
          />
          <span className={`pixel-checkbox ${state.profileVisible ? 'pixel-checkbox-checked' : ''}`} aria-hidden="true">
            {state.profileVisible ? '✓' : ''}
          </span>
        </label>

        <label className="privacy-option-card">
          <div className="privacy-option-text">
            <strong>Show Email Address</strong>
            <span>Let your accepted connections see your email</span>
          </div>
          <input
            type="checkbox"
            checked={state.showEmail}
            onChange={(e) => updateState('showEmail', e.target.checked)}
          />
          <span className={`pixel-checkbox ${state.showEmail ? 'pixel-checkbox-checked' : ''}`} aria-hidden="true">
            {state.showEmail ? '✓' : ''}
          </span>
        </label>

        <label className="availability-detail-field">
          <span>Availability Detail Level</span>
          <select
            value={state.availabilityDetail}
            onChange={(e) => updateState('availabilityDetail', e.target.value as typeof state.availabilityDetail)}
          >
            <option value="full">Full schedule details</option>
            <option value="limited">Free/busy only</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
      </div>

      <div className="social-fields">
        <label className="social-input-field">
          <span>Instagram</span>
          <input
            type="text"
            value={state.instagramHandle}
            onChange={(e) => updateState('instagramHandle', sanitizeText(e.target.value, INSTAGRAM_MAX_LENGTH))}
            placeholder="@username"
            autoComplete="off"
            maxLength={INSTAGRAM_MAX_LENGTH}
          />
        </label>

        <label className="social-input-field">
          <span>LinkedIn</span>
          <input
            type="text"
            value={state.linkedinUrl}
            onChange={(e) => updateState('linkedinUrl', sanitizeText(e.target.value, LINKEDIN_MAX_LENGTH))}
            placeholder="Profile link or username"
            autoComplete="off"
            maxLength={LINKEDIN_MAX_LENGTH}
          />
        </label>
      </div>

      <button
        type="button"
        className="privacy-back-button"
        onClick={() => setStep('availability')}
        aria-label="Go back to availability"
        disabled={isSaving}
      />
      <button
        type="button"
        className="privacy-next-button"
        onClick={onComplete}
        aria-label="Continue"
        disabled={isSaving}
      />
    </div>
  );
}
