import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuiz, getQuiz, updateQuiz } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { TextArea, TextInput } from "../components/TextInput";
import { AppLayout } from "../layouts/AppLayout";

export function QuizFormPage() {
  const { quizId } = useParams();
  const isEdit = Boolean(quizId);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    getQuiz(Number(quizId))
      .then((quiz) => {
        setTitle(quiz.title);
        setDescription(quiz.description ?? "");
      })
      .catch((e: Error) => setError(e.message));
  }, [quizId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = { title: title.trim(), description: description.trim() };
    try {
      if (isEdit) {
        await updateQuiz(Number(quizId), payload);
        navigate(`/quizzes/${quizId}`);
      } else {
        const created = await createQuiz(payload);
        navigate(`/quizzes/${created.id}`);
      }
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <h2 className="heading-2" style={{ marginBottom: "var(--space-xl)" }}>
        {isEdit ? "Edit quiz" : "New quiz"}
      </h2>

      <Card style={{ maxWidth: 640 }}>
        {error && <p className="error-text" style={{ marginBottom: "var(--space-md)" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="title">Title</label>
            <TextInput
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. World Geography"
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="description">Description</label>
            <TextArea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional summary of this quiz"
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" disabled={saving || !title.trim()}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create quiz"}
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
