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

export interface HeroStat {
  value: string | number;
  label: string;
}

/** DESIGN.md `hero-band-dark`: deep-teal band, hero-display headline, on-dark text.
 *  Two-column on desktop — text column + optional aside (e.g. code-mockup card). */
export function HeroBand({
  eyebrow,
  title,
  subtitle,
  actions,
  stats,
  aside,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  stats?: HeroStat[];
  aside?: ReactNode;
}) {
  return (
    <section className="hero-band">
      <div className="container hero-band__inner">
        <div className="hero-band__text">
          {eyebrow && (
            <span className="micro-uppercase hero-band__eyebrow">{eyebrow}</span>
          )}
          <h1 className="hero-band__title">{title}</h1>
          {subtitle && <p className="subtitle hero-band__subtitle">{subtitle}</p>}
          {stats && stats.length > 0 && (
            <dl className="hero-band__stats">
              {stats.map((stat) => (
                <div className="hero-band__stat" key={stat.label}>
                  <dt className="hero-band__stat-value">{stat.value}</dt>
                  <dd className="hero-band__stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {actions && <div className="hero-band__actions">{actions}</div>}
        </div>
        {aside && <div className="hero-band__aside">{aside}</div>}
      </div>
    </section>
  );
}
