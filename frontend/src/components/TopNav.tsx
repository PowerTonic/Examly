import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import "./TopNav.css";

/** DESIGN.md "Top Navigation (Marketing)": sticky white bar, hairline bottom border. */
export function TopNav() {
  const navigate = useNavigate();
  return (
    <header className="topnav">
      <div className="container topnav__inner">
        <Link to="/" className="topnav__brand">
          <span className="topnav__mark" aria-hidden="true" />
          Examly
        </Link>
        <Button variant="primary" onClick={() => navigate("/quizzes/new")}>
          New quiz
        </Button>
      </div>
    </header>
  );
}
