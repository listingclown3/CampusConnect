import { useState } from "react";
import landingPage from "../assets/landing.png";
import "../App.css";

const stars = Array.from({ length: 100 }, (_, index) => index);

function Landing({ setPage }) {
  const [isStarting, setIsStarting] = useState(false);

  function handleGetStarted() {
    if (isStarting) {
      return;
    }

    setIsStarting(true);

    setTimeout(() => {
      setPage("basic");
    }, 1500);
  }

  return (
    <div
      className={`landing-container ${
        isStarting ? "landing-is-leaving" : ""
      }`}
    >
      <img
        src={landingPage}
        className="landing-image"
        alt="Spartan Circle"
      />

      <button
        type="button"
        className="get-started-hotspot"
        onClick={handleGetStarted}
        aria-label="Get started"
      />

      {isStarting && (
        <div className="pixel-celebration" aria-hidden="true">
          {stars.map((star) => (
            <span
              key={star}
              className={`pixel-star pixel-star-${star + 1}`}
            >
              ★
            </span>
          ))}

          <div className="starting-message">
            Entering Spartan Circle...
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;