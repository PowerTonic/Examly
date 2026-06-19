import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteQuestion, deleteQuiz, getQuiz } from "../api/client";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { AppLayout } from "../layouts/AppLayout";
import type { Quiz } from "../types";
import "./QuizDetailPage.css";

export function QuizDetailPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    getQuiz(Number(quizId))
      .then(setQuiz)
      .catch((e: Error) => setError(e.message));
  }, [quizId]);

  useEffect(load, [load]);

  const handleDeleteQuiz = async () => {
    if (!quiz) return;
    if (!confirm(`Delete "${quiz.title}" and all its questions?`)) return;
    try {
      await deleteQuiz(quiz.id);
      navigate("/");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteQuestion(questionId);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (error) {
    return (
      <AppLayout>
        <p className="error-text">{error}</p>
        <div style={{ marginTop: "var(--space-md)" }}>
          <Button variant="secondary" onClick={() => navigate("/")}>Back to quizzes</Button>
        </div>
      </AppLayout>
    );
  }

  if (!quiz) {
    return (
      <AppLayout>
        <p className="empty-state">Loading…</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="row-between" style={{ marginBottom: "var(--space-lg)" }}>
        <div className="stack-sm">
          <div className="row-gap">
            <h2 className="heading-2">{quiz.title}</h2>
            <Badge>{quiz.questions.length} questions</Badge>
          </div>
          <p className="body-md text-steel">{quiz.description || "No description"}</p>
        </div>
      </div>

      <div className="row-gap" style={{ marginBottom: "var(--space-section)" }}>
        <Button variant="primary" onClick={() => navigate(`/quizzes/${quiz.id}/questions/new`)}>
          Add question
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}>
          Edit quiz
        </Button>
        <Button variant="danger" onClick={handleDeleteQuiz}>Delete quiz</Button>
        <Button variant="secondary" onClick={() => navigate("/")}>Back</Button>
      </div>

      <h3 className="heading-3" style={{ marginBottom: "var(--space-md)" }}>Questions</h3>

      {quiz.questions.length === 0 ? (
        <p className="empty-state">No questions yet. Add the first one.</p>
      ) : (
        <div className="stack-sm">
          {quiz.questions.map((question, index) => (
            <Card key={question.id}>
              <div className="row-between" style={{ alignItems: "flex-start" }}>
                <span className="heading-5">
                  {index + 1}. {question.text}
                </span>
                <div className="row-gap">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/questions/${question.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteQuestion(question.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <ul className="option-display">
                {question.options.map((option) => (
                  <li
                    key={option.id}
                    className={`option-display__item${
                      option.is_correct ? " option-display__item--correct" : ""
                    }`}
                  >
                    <span className="option-display__marker" aria-hidden="true">
                      {option.is_correct ? "✓" : ""}
                    </span>
                    <span>{option.text}</span>
                    {option.is_correct && <Badge>Correct</Badge>}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
