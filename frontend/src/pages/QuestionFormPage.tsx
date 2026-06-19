import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createQuestion,
  getQuestion,
  updateQuestion,
} from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { TextArea, TextInput } from "../components/TextInput";
import { AppLayout } from "../layouts/AppLayout";

export function QuestionFormPage() {
  const { quizId: quizIdParam, questionId } = useParams();
  const isEdit = Boolean(questionId);
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState<number | null>(
    quizIdParam ? Number(quizIdParam) : null
  );
  const [text, setText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!questionId) return;
    getQuestion(Number(questionId))
      .then((q) => {
        setText(q.text);
        setCorrectAnswer(q.correct_answer);
        setQuizId(q.quiz_id);
      })
      .catch((e: Error) => setError(e.message));
  }, [questionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { text: text.trim(), correct_answer: correctAnswer.trim() };
    try {
      if (isEdit) {
        const updated = await updateQuestion(Number(questionId), payload);
        navigate(`/quizzes/${updated.quiz_id}`);
      } else if (quizId !== null) {
        await createQuestion(quizId, payload);
        navigate(`/quizzes/${quizId}`);
      }
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const canSubmit = text.trim() && correctAnswer.trim();

  return (
    <AppLayout>
      <h2 className="heading-2" style={{ marginBottom: "var(--space-xl)" }}>
        {isEdit ? "Edit question" : "Add question"}
      </h2>

      <Card style={{ maxWidth: 640 }}>
        {error && <p className="error-text" style={{ marginBottom: "var(--space-md)" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="text">Question</label>
            <TextArea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. What is the capital of France?"
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="answer">Correct answer</label>
            <TextInput
              id="answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="e.g. Paris"
              required
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={saving || !canSubmit}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add question"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}
