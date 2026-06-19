import { Navigate, Route, Routes } from "react-router-dom";
import { QuestionFormPage } from "./pages/QuestionFormPage";
import { QuizDetailPage } from "./pages/QuizDetailPage";
import { QuizFormPage } from "./pages/QuizFormPage";
import { QuizListPage } from "./pages/QuizListPage";
import { TakeQuizPage } from "./pages/TakeQuizPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizListPage />} />
      <Route path="/quizzes/new" element={<QuizFormPage />} />
      <Route path="/quizzes/:quizId" element={<QuizDetailPage />} />
      <Route path="/quizzes/:quizId/take" element={<TakeQuizPage />} />
      <Route path="/quizzes/:quizId/edit" element={<QuizFormPage />} />
      <Route path="/quizzes/:quizId/questions/new" element={<QuestionFormPage />} />
      <Route path="/questions/:questionId/edit" element={<QuestionFormPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
