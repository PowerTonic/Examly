import "./Footer.css";

/** DESIGN.md `footer-region`: deep-teal background, on-dark-muted links. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">
          <span className="footer__mark" aria-hidden="true" />
          Examly
        </span>
        <span className="footer__note">A calm, focused way to study.</span>
      </div>
    </footer>
  );
}
