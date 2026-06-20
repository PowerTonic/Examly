import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestion, getQuestion, updateQuestion } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ImagePicker } from "../components/ImagePicker";
import { TextArea, TextInput } from "../components/TextInput";
import { AppLayout } from "../layouts/AppLayout";
import "./QuestionFormPage.css";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

interface OptionDraft {
  text: string;
  image: string | null;
}

const emptyOption = (): OptionDraft => ({ text: "", image: null });
const DEFAULT_OPTIONS: OptionDraft[] = [
  emptyOption(),
  emptyOption(),
  emptyOption(),
  emptyOption(),
];

export function QuestionFormPage() {
  const { quizId: quizIdParam, questionId } = useParams();
  const isEdit = Boolean(questionId);
  const navigate = useNavigate();

  const [quizId, setQuizId] = useState<number | null>(
    quizIdParam ? Number(quizIdParam) : null
  );
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<OptionDraft[]>(DEFAULT_OPTIONS);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!questionId) return;
    getQuestion(Number(questionId))
      .then((q) => {
        setText(q.text);
        setImage(q.image_url);
        setQuizId(q.quiz_id);
        setOptions(q.options.map((o) => ({ text: o.text, image: o.image_url })));
        const correct = q.options.findIndex((o) => o.is_correct);
        setCorrectIndex(correct >= 0 ? correct : 0);
      })
      .catch((e: Error) => setError(e.message));
  }, [questionId]);

  const patchOption = (index: number, patch: Partial<OptionDraft>) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, ...patch } : o)));
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions((prev) => [...prev, emptyOption()]);
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
    // Keep the correct selection pointing at the same option.
    setCorrectIndex((prev) => {
      if (index === prev) return 0;
      return index < prev ? prev - 1 : prev;
    });
  };

  // An option/prompt is valid as long as it has text OR an image.
  const optionFilled = (o: OptionDraft) => o.text.trim().length > 0 || o.image !== null;
  const promptFilled = text.trim().length > 0 || image !== null;
  const canSubmit = promptFilled && options.every(optionFilled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      text: text.trim(),
      image_url: image,
      options: options.map((o, i) => ({
        text: o.text.trim(),
        image_url: o.image,
        is_correct: i === correctIndex,
      })),
    };
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

  return (
    <AppLayout>
      <h2 className="heading-2" style={{ marginBottom: "var(--space-xl)" }}>
        {isEdit ? "Edit question" : "Add question"}
      </h2>

      <Card style={{ maxWidth: 760 }}>
        {error && (
          <p className="error-text" style={{ marginBottom: "var(--space-md)" }}>
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="text">
              Question
            </label>
            <TextArea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Which diagram shows a binary tree? (text optional if you add an image)"
            />
          </div>

          <div className="field">
            <ImagePicker
              value={image}
              onChange={setImage}
              label="Question image (optional)"
              ariaLabel="Question image"
            />
          </div>

          <div className="field">
            <div className="options-header">
              <span className="field-label">Answer options</span>
              <span className="options-hint">
                Each option can be text, a picture, or both — pick the radio to mark
                the correct answer
              </span>
            </div>

            <div className="options-list">
              {options.map((option, index) => {
                const selected = index === correctIndex;
                return (
                  <div
                    key={index}
                    className={`option-row${selected ? " option-row--correct" : ""}`}
                  >
                    <label className="option-radio">
                      <input
                        type="radio"
                        name="correct"
                        checked={selected}
                        onChange={() => setCorrectIndex(index)}
                        aria-label={`Mark option ${index + 1} as correct`}
                      />
                    </label>

                    <div className="option-body">
                      <TextInput
                        value={option.text}
                        onChange={(e) => patchOption(index, { text: e.target.value })}
                        placeholder={`Option ${index + 1} text (optional if image added)`}
                      />
                      <ImagePicker
                        variant="compact"
                        value={option.image}
                        onChange={(img) => patchOption(index, { image: img })}
                        ariaLabel={`Option ${index + 1} image`}
                      />
                    </div>

                    <button
                      type="button"
                      className="option-remove"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= MIN_OPTIONS}
                      aria-label={`Remove option ${index + 1}`}
                      title={
                        options.length <= MIN_OPTIONS
                          ? `At least ${MIN_OPTIONS} options required`
                          : "Remove option"
                      }
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            {options.length < MAX_OPTIONS && (
              <button type="button" className="option-add" onClick={addOption}>
                + Add option
              </button>
            )}
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
