'use client';

import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const MAX_OUTPUT_DIMENSION = 320;

interface AvatarCropperProps {
  imageSrc: string;
  open: boolean;
  onCancel: () => void;
  onSave: (dataUrl: string) => void;
}

export function AvatarCropper({ imageSrc, open, onCancel, onSave }: AvatarCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const dataUrl = await cropImageToDataUrl(imageSrc, croppedAreaPixels);
      onSave(dataUrl);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
          <Cropper
            image={imageSrc}
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

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </label>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!croppedAreaPixels || saving}>
            {saving ? 'Saving...' : 'Save Photo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

      // Downscale to a fixed max dimension so the resulting data URL stays
      // small enough for localStorage (mock mode) and upload payloads (real mode).
      const outputSize = Math.min(MAX_OUTPUT_DIMENSION, cropArea.width);
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
