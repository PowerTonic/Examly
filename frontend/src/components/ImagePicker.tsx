import { useRef, useState } from "react";
import { fileToDataUrl } from "../utils/image";
import "./ImagePicker.css";

interface ImagePickerProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  /** "compact" is sized for inline use inside an answer-option row. */
  variant?: "full" | "compact";
  label?: string;
  /** Accessible description of what the image is for. */
  ariaLabel?: string;
}

export function ImagePicker({
  value,
  onChange,
  variant = "full",
  label,
  ariaLabel,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await fileToDataUrl(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const open = () => inputRef.current?.click();

  const hidden = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="image-picker__input"
      onChange={(e) => {
        void handleFile(e.target.files?.[0]);
        e.target.value = ""; // allow re-picking the same file
      }}
    />
  );

  if (value) {
    return (
      <div className={`image-picker image-picker--${variant}`}>
        {label && <span className="image-picker__label">{label}</span>}
        <div className="image-picker__preview">
          <img src={value} alt={ariaLabel ?? "Selected image"} />
          <div className="image-picker__overlay">
            <button type="button" className="image-picker__chip" onClick={open}>
              Replace
            </button>
            <button
              type="button"
              className="image-picker__chip image-picker__chip--danger"
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          </div>
        </div>
        {hidden}
      </div>
    );
  }

  return (
    <div className={`image-picker image-picker--${variant}`}>
      {label && <span className="image-picker__label">{label}</span>}
      <button
        type="button"
        className={`image-picker__drop${dragging ? " image-picker__drop--over" : ""}`}
        onClick={open}
        aria-label={ariaLabel ?? "Add an image"}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        <span className="image-picker__icon" aria-hidden="true">
          {busy ? "…" : "🖼"}
        </span>
        <span className="image-picker__hint">
          {busy
            ? "Processing…"
            : variant === "compact"
              ? "Add image"
              : "Add an image — click or drop a file"}
        </span>
      </button>
      {error && <span className="image-picker__error">{error}</span>}
      {hidden}
    </div>
  );
}
