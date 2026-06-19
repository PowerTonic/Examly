import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteQuiz, listQuizzes } from "../api/client";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CodeMockup } from "../components/CodeMockup";
import { AppLayout, HeroBand } from "../layouts/AppLayout";
import type { Quiz } from "../types";

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
          eyebrow="Quiz App"
          title="Build and manage your quizzes."
          subtitle="Create quizzes, add questions, and keep everything organized in one place."
          stats={[
            { value: quizzes.length, label: "Quizzes" },
            { value: questionCount, label: "Questions" },
          ]}
          actions={
            <Button variant="primary" onClick={() => navigate("/quizzes/new")}>
              New Quiz
            </Button>
          }
          aside={<CodeMockup />}
        />
      }
    >
      <div className="row-between" style={{ marginBottom: "var(--space-xl)" }}>
        <h2 className="heading-2">Your quizzes</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : quizzes.length === 0 ? (
        <p className="empty-state">No quizzes yet. Create your first one.</p>
      ) : (
        <div className="card-grid">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="stack-sm">
              <div className="row-between">
                <Link to={`/quizzes/${quiz.id}`} className="heading-3" style={{ color: "var(--color-ink)" }}>
                  {quiz.title}
                </Link>
                <Badge>{quiz.questions.length} Q</Badge>
              </div>
              <p className="body-sm text-steel">
                {quiz.description || "No description"}
              </p>
              <div className="row-gap" style={{ marginTop: "var(--space-sm)" }}>
                <Button variant="secondary" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
                  Open
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(quiz)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
