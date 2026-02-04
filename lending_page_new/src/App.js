import { useState } from "react";
import SimvexLanding from "./Simvexlanding";
import StudyPage from "./Studypage";
import ProductListPage from "./Productlistpage";
import LearnPage from "./Learnpage";
import WorkflowPage from "./Workflowpage";
import ExamPage from "./Exampage";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "study" | "productList" | "learn" | "workflow" | "exam"
  const [selectedField, setSelectedField] = useState(null); // 선택된 분야명
  
  // 워크플로우 데이터 (페이지 전환 시에도 유지)
  const [workflowNodes, setWorkflowNodes] = useState([
    { id: 1, x: 200, y: 200, title: "기획", content: "", color: "#3b82f6" },
    { id: 2, x: 600, y: 50, title: "스케치", content: "", color: "#3b82f6" },
    { id: 3, x: 600, y: 350, title: "모델링", content: "", color: "#3b82f6" },
    { id: 4, x: 1000, y: 200, title: "수치해석", content: "", color: "#3b82f6" },
  ]);
  const [workflowConnections, setWorkflowConnections] = useState([]);

  if (page === "exam") {
    return <ExamPage onHome={() => setPage("landing")} onStudy={() => setPage("study")} onLab={() => setPage("workflow")} onTest={() => setPage("exam")} />;
  }
  if (page === "workflow") {
    return <WorkflowPage onHome={() => setPage("landing")} onStudy={() => setPage("study")} onTest={() => setPage("exam")} />;
  }
  if (page === "learn") {
    return <LearnPage onHome={() => setPage("landing")} onStudy={() => setPage("study")} onLab={() => setPage("workflow")} onTest={() => setPage("exam")} />;
  }
  if (page === "productList") {
    return (
      <ProductListPage
        field={selectedField}
        onHome={() => setPage("landing")}
        onBack={() => setPage("study")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("exam")}
        onLearn={() => setPage("learn")}
      />
    );
  }
  if (page === "study") {
    return (
      <StudyPage
        onHome={() => setPage("landing")}
        onLab={() => setPage("workflow")}
        onTest={() => setPage("exam")}
        onFieldSelect={(fieldName) => {
          setSelectedField(fieldName);
          setPage("productList");
        }}
      />
    );
  }
  return <SimvexLanding onStart={() => setPage("study")} onLab={() => setPage("workflow")} onTest={() => setPage("exam")} />;
}