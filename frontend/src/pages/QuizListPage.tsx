import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteQuiz, listQuizzes } from "../api/client";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { AppLayout, HeroBand } from "../layouts/AppLayout";
import type { Quiz } from "../types";
import "./QuizListPage.css";

export function QuizListPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listQuizzes()
      .then(setQuizzes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (quiz: Quiz) => {
    if (!confirm(`Delete "${quiz.title}" and all its questions?`)) return;
    try {
      await deleteQuiz(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const questionCount = quizzes.reduce((sum, q) => sum + q.questions.length, 0);

  return (
    <AppLayout
      hero={
        <HeroBand
          eyebrow="Quiz library"
          title="Your quizzes, in one calm place."
          subtitle="Create text or picture quizzes, add questions, and run them one focused screen at a time."
          stats={[
            { value: quizzes.length, label: "Quizzes" },
            { value: questionCount, label: "Questions" },
          ]}
          actions={
            <Button variant="primary" onClick={() => navigate("/quizzes/new")}>
              Create a quiz
            </Button>
          }
        />
      }
    >
      <div className="row-between" style={{ marginBottom: "var(--space-xl)" }}>
        <h2 className="heading-2">All quizzes</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : quizzes.length === 0 ? (
        <p className="empty-state">No quizzes yet. Create your first one.</p>
      ) : (
        <div className="card-grid">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="quiz-card">
              <div className="quiz-card__head">
                <Link to={`/quizzes/${quiz.id}`} className="quiz-card__title">
                  {quiz.title}
                </Link>
                <Badge>{quiz.questions.length} questions</Badge>
              </div>
              <p className="quiz-card__desc">
                {quiz.description || "No description"}
              </p>
              <div className="quiz-card__divider" />
              <div className="quiz-card__actions">
                <Button
                  variant="dark"
                  onClick={() => navigate(`/quizzes/${quiz.id}/take`)}
                  disabled={quiz.questions.length === 0}
                  title={
                    quiz.questions.length === 0
                      ? "Add a question first"
                      : "Take this quiz"
                  }
                >
                  Take quiz
                </Button>
                <div className="quiz-card__links">
                  <button
                    type="button"
                    className="quiz-card__link"
                    onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="quiz-card__link quiz-card__link--danger"
                    onClick={() => handleDelete(quiz)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
