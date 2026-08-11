'use client';

import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import type { StudentType } from '@/types/database';
import type { SpartanOnboardingState, SpartanStep } from './types';
import { sanitizeText } from '@/lib/validation/text';

const NAME_MAX_LENGTH = 50;

interface BasicsStepProps {
  state: SpartanOnboardingState;
  updateState: <K extends keyof SpartanOnboardingState>(key: K, value: SpartanOnboardingState[K]) => void;
  setStep: (step: SpartanStep) => void;
}

export function BasicsStep({ state, updateState, setStep }: BasicsStepProps) {
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  function handleImageSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    setImageToCrop(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    event.target.value = '';
  }

  async function handleSavePhoto() {
    if (!imageToCrop || !croppedAreaPixels) return;
    try {
      const dataUrl = await cropImageToDataUrl(imageToCrop, croppedAreaPixels);
      updateState('avatarDataUrl', dataUrl);
      setImageToCrop(null);
    } catch {
      alert('The image could not be cropped.');
    }
  }

  return (
    <div className="basics-container">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="basics-image" src="/onboarding/basics.png" alt="Basics Page" />

      <input
        type="text"
        className="first-name-input"
        placeholder="Enter first name"
        value={state.firstName}
        onChange={(e) => updateState('firstName', sanitizeText(e.target.value, NAME_MAX_LENGTH))}
      />

      <input
        type="text"
        className="last-name-input"
        placeholder="Enter last name"
        value={state.lastName}
        onChange={(e) => updateState('lastName', sanitizeText(e.target.value, NAME_MAX_LENGTH))}
      />

      <select
        className="student-type-dropdown"
        value={state.studentType}
        onChange={(e) => updateState('studentType', e.target.value as StudentType)}
      >
        <option value="freshman">Freshman</option>
        <option value="transfer">Transferring</option>
        <option value="continuing">Continuing</option>
      </select>

      <select
        className="graduation-year-dropdown"
        value={state.graduationYear}
        onChange={(e) => updateState('graduationYear', parseInt(e.target.value))}
      >
        {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <div className="profile-picture-circle">
        {state.avatarDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="profile-picture-image" src={state.avatarDataUrl} alt="Selected profile" />
        ) : (
          <span className="profile-picture-placeholder">+</span>
        )}
      </div>

      <label className="upload-photo-hotspot">
        <span className="visually-hidden">Upload profile photo</span>
        <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleImageSelect} />
      </label>

      <button type="button" className="basics-back-button" onClick={() => setStep('landing')} aria-label="Back" />
      <button type="button" className="next-academics-button" onClick={() => setStep('academics')} aria-label="Next" />

      {imageToCrop && (
        <div className="crop-modal-background">
          <div className="crop-modal">
            <h2>Crop Profile Picture</h2>
            <div className="crop-container">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>
            <label className="zoom-control">
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>
            <div className="crop-button-row">
              <button type="button" onClick={() => setImageToCrop(null)}>Cancel</button>
              <button type="button" onClick={handleSavePhoto}>Save Photo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function cropImageToDataUrl(imageSource: string, cropArea: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas is not supported.'));
        return;
      }
      const outputSize = Math.min(320, cropArea.width);
      canvas.width = outputSize;
      canvas.height = outputSize;
      context.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        outputSize,
        outputSize
      );
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    image.onerror = () => reject(new Error('Could not load selected image.'));
    image.src = imageSource;
  });
}
