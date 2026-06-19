import type { HTMLAttributes } from "react";
import "./Badge.css";

/** Maps to DESIGN.md `badge-green-soft`: pale-mint pill, caption-bold. */
export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`badge ${className}`.trim()} {...props} />;
}
