import type { HTMLAttributes } from "react";
import "./Card.css";

/**
 * Maps to DESIGN.md `card-base`: canvas bg, rounded.lg (12px),
 * spacing.xl padding, 1px hairline border, flat (no heavy shadow).
 */
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`.trim()} {...props} />;
}
