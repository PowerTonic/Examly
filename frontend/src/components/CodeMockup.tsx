import "./CodeMockup.css";

/**
 * DESIGN.md `code-mockup-card`: canvas-dark terminal-aesthetic card that sits
 * on the dark hero band (the signature MongoDB hero treatment). Elevation 3.
 */
export function CodeMockup() {
  return (
    <div className="code-mockup" role="img" aria-label="Sample API response for a quiz">
      <div className="code-mockup__bar">
        <span className="code-mockup__dot" />
        <span className="code-mockup__dot" />
        <span className="code-mockup__dot" />
        <span className="code-mockup__file">quiz.json</span>
      </div>
      <pre className="code-mockup__body">
        <code>
          <span className="code-mockup__prompt">$ GET /api/questions/1</span>
          {"\n\n"}
          {"{\n"}
          {"  "}<span className="code-mockup__key">"id"</span>: <span className="code-mockup__num">1</span>,{"\n"}
          {"  "}<span className="code-mockup__key">"text"</span>: <span className="code-mockup__str">"Capital of Japan?"</span>,{"\n"}
          {"  "}<span className="code-mockup__key">"options"</span>: [{"\n"}
          {"    "}{"{ "}<span className="code-mockup__key">"text"</span>: <span className="code-mockup__str">"Tokyo"</span>, <span className="code-mockup__key">"is_correct"</span>: <span className="code-mockup__num">true</span> {"}"},{"\n"}
          {"    "}{"{ "}<span className="code-mockup__key">"text"</span>: <span className="code-mockup__str">"Osaka"</span>, <span className="code-mockup__key">"is_correct"</span>: <span className="code-mockup__num">false</span> {"}"}{"\n"}
          {"  "}]{"\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}
