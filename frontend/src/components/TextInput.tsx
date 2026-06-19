import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import "./TextInput.css";

/** Maps to DESIGN.md `text-input`: 44px height, rounded.md, focus -> brand-green-dark. */
export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={`text-input ${className}`.trim()} {...rest} />;
}

/** Multi-line variant sharing text-input styling (no fixed height). */
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea className={`text-input text-input--area ${className}`.trim()} {...rest} />
  );
}
