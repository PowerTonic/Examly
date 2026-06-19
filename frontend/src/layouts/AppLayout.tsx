import type { ReactNode } from "react";
import { Footer } from "../components/Footer";
import { TopNav } from "../components/TopNav";
import "./AppLayout.css";

interface AppLayoutProps {
  /** Optional deep-teal hero band (DESIGN.md hero-band-dark). */
  hero?: ReactNode;
  children: ReactNode;
}

export function AppLayout({ hero, children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <TopNav />
      {hero}
      <main className="app-main">
        <div className="container section">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

/** DESIGN.md `hero-band-dark`: deep-teal band, hero-display headline, on-dark text. */
export function HeroBand({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="hero-band">
      <div className="container hero-band__inner">
        {eyebrow && (
          <span className="micro-uppercase hero-band__eyebrow">{eyebrow}</span>
        )}
        <h1 className="hero-band__title">{title}</h1>
        {subtitle && <p className="subtitle hero-band__subtitle">{subtitle}</p>}
        {actions && <div className="hero-band__actions">{actions}</div>}
      </div>
    </section>
  );
}
