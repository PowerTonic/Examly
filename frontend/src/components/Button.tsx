import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/**
 * Maps to DESIGN.md `button-primary` / `button-secondary`.
 * Always pill-shaped (rounded.full) — brand signature.
 */
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button className={`btn btn--${variant} ${className}`.trim()} {...props} />
  );
}
