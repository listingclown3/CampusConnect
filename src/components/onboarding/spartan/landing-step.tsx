'use client';

import { useState } from 'react';
import type { SpartanStep } from './types';

const stars = Array.from({ length: 24 }, (_, index) => index);

export function LandingStep({ setStep }: { setStep: (step: SpartanStep) => void }) {
  const [isStarting, setIsStarting] = useState(false);

  function handleGetStarted() {
    if (isStarting) return;
    setIsStarting(true);
    setTimeout(() => setStep('basic'), 1500);
  }

  return (
    <div className={`landing-container ${isStarting ? 'landing-is-leaving' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/onboarding/landing.png" className="landing-image" alt="Spartan Circle" />

      <button
        type="button"
        className="get-started-hotspot"
        onClick={handleGetStarted}
        aria-label="Get started"
      />

      {isStarting && (
        <div className="pixel-celebration" aria-hidden="true">
          {stars.map((star) => (
            <span key={star} className={`pixel-star pixel-star-${star + 1}`}>
              ★
            </span>
          ))}
          <div className="starting-message">Entering Spartan Circle...</div>
        </div>
      )}
    </div>
  );
}
