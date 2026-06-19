import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuiz } from "../api/client";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { AppLayout } from "../layouts/AppLayout";
import type { Quiz } from "../types";
import "./TakeQuizPage.css";

export function TakeQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  // questionId -> selected optionId
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getQuiz(Number(quizId))
      .then(setQuiz)
      .catch((e: Error) => setError(e.message));
  }, [quizId]);

  const score = useMemo(() => {
    if (!quiz) return 0;
    return quiz.questions.reduce((total, q) => {
      const chosen = answers[q.id];
      const correct = q.options.find((o) => o.is_correct);
      return correct && chosen === correct.id ? total + 1 : total;
    }, 0);
  }, [quiz, answers]);

  if (error) {
    return (
      <AppLayout>
        <p className="error-text">{error}</p>
        <div style={{ marginTop: "var(--space-md)" }}>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to quizzes
          </Button>
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

  const total = quiz.questions.length;

  if (total === 0) {
    return (
      <AppLayout>
        <h2 className="heading-2">{quiz.title}</h2>
        <p className="empty-state">This quiz has no questions yet.</p>
        <Button variant="secondary" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
          Back to quiz
        </Button>
      </AppLayout>
    );
  }

  // ---------- Results view ----------
  if (submitted) {
    const percent = Math.round((score / total) * 100);
    return (
      <AppLayout>
        <div className="take-result-head">
          <span className="micro-uppercase take-result-eyebrow">Results</span>
          <h2 className="heading-1">
            You scored {score} / {total}
          </h2>
          <p className="subtitle text-steel">{percent}% correct on “{quiz.title}”</p>
          <div className="take-actions">
            <Button
              variant="primary"
              onClick={() => {
                setAnswers({});
                setCurrent(0);
                setSubmitted(false);
              }}
            >
              Retake quiz
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
              Back to quiz
            </Button>
          </div>
        </div>

        <div className="stack-sm take-review">
          {quiz.questions.map((q, index) => {
            const chosen = answers[q.id];
            return (
              <Card key={q.id}>
                <span className="heading-5">
                  {index + 1}. {q.text}
                </span>
                <ul className="take-review-options">
                  {q.options.map((o) => {
                    const isChosen = chosen === o.id;
                    const wrongPick = isChosen && !o.is_correct;
                    let cls = "take-review-option";
                    if (o.is_correct) cls += " take-review-option--correct";
                    else if (wrongPick) cls += " take-review-option--wrong";
                    return (
                      <li key={o.id} className={cls}>
                        <span className="take-review-marker" aria-hidden="true">
                          {o.is_correct ? "✓" : wrongPick ? "✕" : ""}
                        </span>
                        <span>{o.text}</span>
                        {isChosen && <Badge>Your answer</Badge>}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            );
          })}
        </div>
      </AppLayout>
    );
  }

  // ---------- Taking view ----------
  const question = quiz.questions[current];
  const selected = answers[question.id];
  const isLast = current === total - 1;
  const progress = Math.round(((current + 1) / total) * 100);

  const choose = (optionId: number) =>
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));

  return (
    <AppLayout>
      <div className="take-head">
        <div className="row-between">
          <h2 className="heading-3">{quiz.title}</h2>
          <span className="body-sm text-steel">
            Question {current + 1} of {total}
          </span>
        </div>
        <div className="take-progress" aria-hidden="true">
          <div className="take-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="take-card">
        <span className="heading-4">{question.text}</span>
        <div className="take-options">
          {question.options.map((option) => {
            const active = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={`take-option${active ? " take-option--active" : ""}`}
                onClick={() => choose(option.id)}
                aria-pressed={active}
              >
                <span className="take-option__bullet" aria-hidden="true" />
                <span>{option.text}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="take-actions">
        <Button
          variant="secondary"
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
        >
          Previous
        </Button>
        {isLast ? (
          <Button
            variant="primary"
            onClick={() => setSubmitted(true)}
            disabled={selected === undefined}
          >
            Finish
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => setCurrent((c) => c + 1)}
            disabled={selected === undefined}
          >
            Next
          </Button>
        )}
      </div>
    </AppLayout>
  );
}
