import { useState } from "react";
import Cropper from "react-easy-crop";
import basicsPage from "../assets/basics.png";
import "../App.css";

function Basics({ setPage }) {
  const [imageToCrop, setImageToCrop] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImageToCrop(imageUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);

    // Allows the same image to be selected again later.
    event.target.value = "";
  }

  function handleCropComplete(_, croppedPixels) {
    setCroppedAreaPixels(croppedPixels);
  }

  async function handleSavePhoto() {
    if (!imageToCrop || !croppedAreaPixels) {
      return;
    }

    try {
      const croppedImage = await createCroppedImage(
        imageToCrop,
        croppedAreaPixels
      );

      setProfilePicture(croppedImage);
      setImageToCrop(null);
    } catch (error) {
      console.error(error);
      alert("The image could not be cropped.");
    }
  }

  function handleCancelCrop() {
    setImageToCrop(null);
  }

  return (
    <div className="basics-container">
      <img
        className="basics-image"
        src={basicsPage}
        alt="Basics Page"
      />

      <input
        type="text"
        className="first-name-input"
        placeholder="Enter first name"
      />

      <input
        type="text"
        className="last-name-input"
        placeholder="Enter last name"
      />

      <select className="student-type-dropdown" defaultValue="">
        <option value="" disabled>
          Select Student Type
        </option>
        <option value="freshman">Freshman</option>
        <option value="transferring">Transferring</option>
        <option value="continuing">Continuing</option>
      </select>

      <select className="graduation-year-dropdown" defaultValue="">
        <option value="" disabled>
          Grad Year
        </option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
        <option value="2029">2029</option>
        <option value="2030">2030</option>
        <option value="2031">2031</option>
      </select>

      {/* Circular profile-picture preview */}
      <div className="profile-picture-circle">
        {profilePicture ? (
          <img
            className="profile-picture-image"
            src={profilePicture}
            alt="Selected profile"
          />
        ) : (
          <span className="profile-picture-placeholder">+</span>
        )}
      </div>

      {/* Invisible file input over the Canva upload button */}
      <label className="upload-photo-hotspot">
        <span className="visually-hidden">
          Upload profile photo
        </span>

        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageSelect}
        />
      </label>

      {/* Back button */}
      <button
        type="button"
        className="basics-back-button"
        onClick={() => setPage("landing")}
      >
        Back
      </button>

      {/* Next button */}
      <button
        type="button"
        className="next-academics-button"
        onClick={() => setPage("academics")}
      >
        Next
      </button>

      {/* Crop popup */}
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
                onCropComplete={handleCropComplete}
              />
            </div>

            <label className="zoom-control">
              Zoom

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(event) =>
                  setZoom(Number(event.target.value))
                }
              />
            </label>

            <div className="crop-button-row">
              <button
                type="button"
                onClick={handleCancelCrop}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePhoto}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function createCroppedImage(imageSource, cropArea) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas is not supported."));
        return;
      }

      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      context.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create cropped image."));
            return;
          }

          resolve(URL.createObjectURL(blob));
        },
        "image/jpeg",
        0.9
      );
    };

    image.onerror = () => {
      reject(new Error("Could not load selected image."));
    };

    image.src = imageSource;
  });
}

export default Basics;