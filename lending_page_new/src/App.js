import { useState } from "react";
import SimvexLanding from "./Simvexlanding";
import StudyPage from "./Studypage";
import ProductListPage from "./Productlistpage";
import LearnPage from "./Learnpage";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "study" | "productList" | "learn"
  const [selectedField, setSelectedField] = useState(null); // 선택된 분야명

  if (page === "learn") {
    return <LearnPage onHome={() => setPage("landing")} onStudy={() => setPage("study")} />;
  }
  if (page === "productList") {
    return (
      <ProductListPage
        field={selectedField}
        onHome={() => setPage("landing")}
        onBack={() => setPage("study")}
        onLearn={() => setPage("learn")}
      />
    );
  }
  if (page === "study") {
    return (
      <StudyPage
        onHome={() => setPage("landing")}
        onFieldSelect={(fieldName) => {
          setSelectedField(fieldName);
          setPage("productList");
        }}
      />
    );
  }
  return <SimvexLanding onStart={() => setPage("study")} />;
}