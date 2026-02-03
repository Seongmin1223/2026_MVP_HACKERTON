import { useState } from "react";
import SimvexLanding from "./Simvexlanding.js";
import StudyPage from "./Studypage.js";
import LearnPage from "./Learnpage.js";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "study" | "learn"

  if (page === "learn") {
    return <LearnPage onHome={() => setPage("landing")} onStudy={() => setPage("study")} />;
  }
  if (page === "study") {
    return <StudyPage onHome={() => setPage("landing")} onLearn={() => setPage("learn")} />;
  }
  return <SimvexLanding onStart={() => setPage("study")} />;
}