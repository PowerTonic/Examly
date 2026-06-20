# Browser testing with agent-browser

This project uses [`agent-browser`](https://github.com/vercel-labs/agent-browser)
(a fast native Rust browser-automation CLI) instead of Playwright for verifying
the UI. It produces far smaller snapshots and near-zero-cost action results,
which keeps agent token usage low.

## Setup

1. **Binary** — installed at `~/.agent-browser/agent-browser.exe` (downloaded
   from the project's GitHub release). To reinstall:

   ```bash
   # Grab the prebuilt binary for your platform from the release assets:
   #   https://github.com/vercel-labs/agent-browser/releases
   # e.g. agent-browser-win32-x64.exe -> ~/.agent-browser/agent-browser.exe
   ```

2. **Chrome** — `agent-browser install` downloads Chrome for Testing, but if
   that host is blocked it auto-detects an existing Chrome/Edge/Brave. We pin the
   path in a project-level **`agent-browser.json`** (auto-discovered from the
   working directory). It's git-ignored because the path is machine-specific:

   ```json
   {
     "$schema": "https://agent-browser.dev/schema.json",
     "executablePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
   }
   ```

   Recreate it pointing at your own Chrome/Edge/Brave binary.

## Running

Run commands **from the repo root** so `agent-browser.json` is picked up. Start
the app first (`start.bat`), then drive it:

```bash
ab=~/.agent-browser/agent-browser.exe

$ab open http://localhost:5173      # NOTE: Vite binds to localhost, not 127.0.0.1
$ab snapshot -i                     # interactive elements only -> @e1, @e2, ...
$ab click @e5                       # act on refs from the latest snapshot
$ab fill @e6 "some text"
$ab upload ".option-row:nth-child(1) .image-picker__input" /path/to/img.png
$ab screenshot --full shot.png
$ab close --all
```

## Gotchas (learned in use)

- **Refs reset on navigation / DOM change.** After `open`, a submit, or anything
  that re-renders, run `snapshot` again and use the *new* refs. Don't reuse refs
  across pages.
- **`batch` splits commands on spaces.** A selector containing a space (a
  descendant combinator like `.row .input`) breaks arg-mode batching — run those
  as individual quoted calls, or use `batch --json` (stdin).
- **`confirm()` dialogs block.** Delete actions use `confirm()`. The triggering
  `click` will appear to time out while the dialog is open; resolve it with
  `agent-browser dialog accept` (or `dialog dismiss`). `alert`/`beforeunload`
  are auto-accepted.
- File inputs are hidden behind the image picker — target the underlying
  `input.image-picker__input` directly with `upload`.
