import { useState } from "react";
import privacyPage from "../assets/privacy.png";
import "../App.css";

function Privacy({ setPage }) {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [availabilityDetail, setAvailabilityDetail] =
    useState("full");

  const [socials, setSocials] = useState({
    instagram: "",
    discord: "",
    tiktok: "",
    linkedin: "",
  });

  function handleSocialChange(event) {
    const { name, value } = event.target;

    setSocials((previousSocials) => ({
      ...previousSocials,
      [name]: value,
    }));
  }

  function handleNext() {
    const privacyData = {
      profileVisible,
      showEmail,
      availabilityDetail,
      socials,
    };

    console.log("Privacy data:", privacyData);

    // Change "complete" to the actual name of your next page.
    setPage("complete");
  }

  return (
    <div className="privacy-container">
      <img
        className="privacy-image"
        src={privacyPage}
        alt="Privacy and socials page"
      />

      {/* Privacy settings */}
      <div className="privacy-settings">
        <label className="privacy-option-card">
          <div className="privacy-option-text">
            <strong>Profile Visibility</strong>

            <span>
              Show your profile to other students
            </span>
          </div>

          <input
            type="checkbox"
            checked={profileVisible}
            onChange={(event) =>
              setProfileVisible(event.target.checked)
            }
          />

          <span
            className={`pixel-checkbox ${
              profileVisible ? "pixel-checkbox-checked" : ""
            }`}
            aria-hidden="true"
          >
            {profileVisible ? "✓" : ""}
          </span>
        </label>

        <label className="privacy-option-card">
          <div className="privacy-option-text">
            <strong>Show Email Address</strong>

            <span>
              Let your accepted connections see your email
            </span>
          </div>

          <input
            type="checkbox"
            checked={showEmail}
            onChange={(event) =>
              setShowEmail(event.target.checked)
            }
          />

          <span
            className={`pixel-checkbox ${
              showEmail ? "pixel-checkbox-checked" : ""
            }`}
            aria-hidden="true"
          >
            {showEmail ? "✓" : ""}
          </span>
        </label>

        <label className="availability-detail-field">
          <span>Availability Detail Level</span>

          <select
            value={availabilityDetail}
            onChange={(event) =>
              setAvailabilityDetail(event.target.value)
            }
          >
            <option value="full">
              Full schedule details
            </option>

            <option value="limited">
              Free/busy only
            </option>

            <option value="hidden">
              Hidden
            </option>
          </select>
        </label>
      </div>

      {/* Social media information */}
      <div className="social-fields">
        <label className="social-input-field">
          <span>Instagram</span>

          <input
            type="text"
            name="instagram"
            value={socials.instagram}
            onChange={handleSocialChange}
            placeholder="@username"
            autoComplete="off"
            maxLength={50}
          />
        </label>

        <label className="social-input-field">
          <span>Discord</span>

          <input
            type="text"
            name="discord"
            value={socials.discord}
            onChange={handleSocialChange}
            placeholder="username"
            autoComplete="off"
            maxLength={50}
          />
        </label>

        <label className="social-input-field">
          <span>TikTok</span>

          <input
            type="text"
            name="tiktok"
            value={socials.tiktok}
            onChange={handleSocialChange}
            placeholder="@username"
            autoComplete="off"
            maxLength={50}
          />
        </label>

        <label className="social-input-field">
          <span>LinkedIn</span>

          <input
            type="text"
            name="linkedin"
            value={socials.linkedin}
            onChange={handleSocialChange}
            placeholder="Profile link or username"
            autoComplete="off"
            maxLength={120}
          />
        </label>
      </div>

      {/* Invisible Canva arrow buttons */}
      <button
        type="button"
        className="privacy-back-button"
        onClick={() => setPage("availability")}
        aria-label="Go back to availability"
      />

      <button
        type="button"
        className="privacy-next-button"
        onClick={handleNext}
        aria-label="Continue"
      />
    </div>
  );
}

export default Privacy;