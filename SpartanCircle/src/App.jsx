import { useState } from "react";
import Landing from "./pages/landing";
import Basics from "./pages/basics";
import Academics from "./pages/academics";
import Interests from "./pages/interests";
import Skills from "./pages/skills";
import Availability from "./pages/availability";
import Privacy from "./pages/privacy";

function App() {
  const [page, setPage] = useState("landing");

  const [selectedClasses, setSelectedClasses] = useState([]);

  if (page === "landing") {
    return <Landing setPage={setPage} />;
  }

  if (page === "basic") {
    return <Basics setPage={setPage} />;
  }

  if (page === "academics") {
    return (
      <Academics
        setPage={setPage}
        selectedClasses={selectedClasses}
        setSelectedClasses={setSelectedClasses}
      />
    );
  }

  if (page === "interests") {
    return <Interests setPage={setPage} />;
  }

  if (page === "skills") {
    return <Skills setPage={setPage} />;
  }

 if (page === "availability") {
  return (
    <Availability
      setPage={setPage}
      selectedClasses={selectedClasses}
    />
  );
}

if (page === "privacy") {
  return <Privacy setPage={setPage} />;
}

}

export default App;

