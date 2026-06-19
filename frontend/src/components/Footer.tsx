import "./Footer.css";

/** DESIGN.md `footer-region`: deep-teal background, on-dark-muted links. */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">Quiz App</span>
        <span className="footer__note">
          Built with FastAPI, React &amp; SQLite — styled per DESIGN.md
        </span>
      </div>
    </footer>
  );
}
