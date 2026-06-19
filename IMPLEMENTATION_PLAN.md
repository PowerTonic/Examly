# Quiz App — Implementation Plan

A minimal, clean quiz application: **FastAPI + SQLAlchemy (SQLite)** backend, **React + TypeScript** frontend. Full CRUD on quizzes and questions. All UI follows `DESIGN.md` (MongoDB design system) with no deviations.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Backend | Python 3.11+, FastAPI, Uvicorn |
| ORM | SQLAlchemy 2.x |
| Database | SQLite (single file `quiz.db`) |
| Validation | Pydantic v2 |
| Frontend | React 18 + TypeScript (Vite) |
| HTTP client | Native `fetch` (no extra framework) |
| Styling | Plain CSS with design tokens from `DESIGN.md` |

No state library, no UI kit, no CSS framework. Routing uses `react-router-dom` (only essential dependency added).

---

## 2. Folder Structure

```
EXamly/
├── DESIGN.md
├── IMPLEMENTATION_PLAN.md
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app, CORS, router mount
│   │   ├── database.py        # engine, session, Base
│   │   ├── models.py          # SQLAlchemy models (Quiz, Question)
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── crud.py            # DB operations
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── quizzes.py     # /quizzes endpoints
│   │       └── questions.py   # /quizzes/{id}/questions endpoints
│   ├── quiz.db                # created at runtime
│   └── requirements.txt
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx            # routes
        ├── api/
        │   └── client.ts      # typed fetch wrappers
        ├── types/
        │   └── index.ts       # Quiz, Question interfaces
        ├── styles/
        │   ├── tokens.css     # ALL DESIGN.md tokens as CSS variables
        │   └── global.css     # base element styling using tokens
        ├── components/
        │   ├── Button.tsx     # button-primary / button-secondary
        │   ├── Card.tsx       # card-base
        │   ├── TextInput.tsx  # text-input
        │   ├── Badge.tsx      # badge-green-soft
        │   ├── TopNav.tsx     # marketing top nav
        │   └── Footer.tsx     # footer-region
        ├── layouts/
        │   └── AppLayout.tsx  # TopNav + content container + Footer
        └── pages/
            ├── QuizListPage.tsx
            ├── QuizFormPage.tsx      # create + edit quiz
            ├── QuizDetailPage.tsx    # quiz + its questions
            └── QuestionFormPage.tsx  # create + edit question
```

---

## 3. Database Schema (3NF)

Two tables. One-to-many: a quiz has many questions; a question belongs to one quiz. No repeating groups, no transitive dependencies — fully normalized.

### `quizzes`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `title` | TEXT | NOT NULL |
| `description` | TEXT | NULL |
| `created_at` | DATETIME | NOT NULL, default `now()` |

### `questions`

| Column | Type | Constraints |
|---|---|---|
| `id` | INTEGER | PK, autoincrement |
| `quiz_id` | INTEGER | FK → `quizzes.id`, NOT NULL, `ON DELETE CASCADE` |
| `text` | TEXT | NOT NULL |
| `correct_answer` | TEXT | NOT NULL |
| `created_at` | DATETIME | NOT NULL, default `now()` |

### Relationship

```
quizzes (1) ──────< (many) questions
        id            quiz_id (FK, cascade delete)
```

Deleting a quiz cascades to its questions. Each question is atomic and depends only on its own primary key (3NF satisfied). Multiple-choice options are intentionally out of scope (start simple); the schema can be extended later with an `options` table without breaking these two.

---

## 4. API Endpoints

Base URL: `/api`

### Quizzes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/quizzes` | List all quizzes |
| `GET` | `/api/quizzes/{quiz_id}` | Get one quiz (with its questions) |
| `POST` | `/api/quizzes` | Create a quiz |
| `PUT` | `/api/quizzes/{quiz_id}` | Update a quiz |
| `DELETE` | `/api/quizzes/{quiz_id}` | Delete a quiz (cascades to questions) |

### Questions (nested under a quiz)

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/quizzes/{quiz_id}/questions` | List questions for a quiz |
| `POST` | `/api/quizzes/{quiz_id}/questions` | Add a question to a quiz |
| `GET` | `/api/questions/{question_id}` | Get one question |
| `PUT` | `/api/questions/{question_id}` | Update a question |
| `DELETE` | `/api/questions/{question_id}` | Delete a question |

All responses are JSON. Errors return standard FastAPI `{ "detail": ... }` with appropriate status codes (404 not found, 422 validation).

### Pydantic Schemas

- `QuizCreate` / `QuizUpdate`: `title`, `description?`
- `QuizOut`: `id`, `title`, `description`, `created_at`, `questions: QuestionOut[]`
- `QuestionCreate` / `QuestionUpdate`: `text`, `correct_answer`
- `QuestionOut`: `id`, `quiz_id`, `text`, `correct_answer`, `created_at`

---

## 5. Frontend Component List

### Primitives (built directly from `DESIGN.md` tokens)

| Component | DESIGN.md mapping |
|---|---|
| `Button` | `button-primary` (green pill, `rounded.full`), `button-secondary` (outlined pill) |
| `Card` | `card-base` — canvas bg, `rounded.lg`, `spacing.xl` padding, `hairline` border |
| `TextInput` | `text-input` — 44px height, `rounded.md`, focus → `2px brand-green-dark` border |
| `Badge` | `badge-green-soft` — used for question counts / status |

### Layout

| Component | DESIGN.md mapping |
|---|---|
| `TopNav` | Marketing top nav — white sticky bar, 64px, `hairline` bottom border, green "New Quiz" pill on right |
| `Footer` | `footer-region` — `brand-teal-deep` background, `on-dark-muted` links |
| `AppLayout` | Hero band (`hero-band-dark`) header on list page + 1280px max-width content container |

### Pages

| Page | Purpose | Key components |
|---|---|---|
| `QuizListPage` | Grid of quiz cards (3-up, collapses per breakpoints) | `Card`, `Badge`, `Button` |
| `QuizFormPage` | Create / edit a quiz | `TextInput`, `Button` |
| `QuizDetailPage` | Quiz info + its questions list + add/edit/delete | `Card`, `Button`, `Badge` |
| `QuestionFormPage` | Create / edit a question | `TextInput`, `Button` |

### Styling rules (enforced everywhere)

- **Font:** Euclid Circular A with documented fallbacks, applied globally.
- **Buttons:** always `rounded.full` (pill). Primary = `brand-green` bg + `on-primary` text.
- **Cards:** always `rounded.lg` (12px) + `hairline` border, flat (no heavy shadow).
- **Hero / footer:** `brand-teal-deep`; green is reserved for CTAs only — never body text or large surfaces.
- **Spacing/radius/color:** only token values from `DESIGN.md`, surfaced as CSS variables in `tokens.css`.

---

## 6. Step-by-Step Build Order

> **Step 0 (already done): Read `DESIGN.md`.** Every styling decision below references its tokens and components. This is the foundation — no UI is written before tokens are in place.

### Phase A — Backend foundation
1. Create `backend/`, add `requirements.txt` (`fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`), set up venv.
2. `database.py`: SQLite engine (`sqlite:///./quiz.db`), `SessionLocal`, `Base`, `get_db` dependency. Enable FK enforcement (`PRAGMA foreign_keys=ON`).
3. `models.py`: `Quiz` and `Question` models with the cascade relationship.
4. `schemas.py`: Pydantic create/update/out models.
5. `crud.py`: get/list/create/update/delete for quizzes and questions.

### Phase B — Backend API
6. `routers/quizzes.py` and `routers/questions.py`: wire endpoints to CRUD, raise 404 where needed.
7. `main.py`: create FastAPI app, `Base.metadata.create_all`, mount routers under `/api`, add CORS for `http://localhost:5173`.
8. Verify all endpoints via Swagger UI (`/docs`).

### Phase C — Frontend foundation (design first)
9. Scaffold Vite React+TS app in `frontend/`. Add only `react-router-dom`.
10. `styles/tokens.css`: translate **all** `DESIGN.md` colors, typography, spacing, radius into CSS variables.
11. `styles/global.css`: set Euclid Circular A + fallbacks, `canvas` background, `ink` text, base resets — all from tokens.
12. `types/index.ts`: `Quiz`, `Question` interfaces mirroring backend schemas.
13. `api/client.ts`: typed `fetch` wrappers for every endpoint.

### Phase D — Frontend primitives (each maps to a DESIGN.md component)
14. Build `Button`, `Card`, `TextInput`, `Badge` strictly from their token mappings.
15. Build `TopNav`, `Footer`, `AppLayout`.

### Phase E — Frontend pages
16. `QuizListPage` — fetch + render quiz card grid, "New Quiz" CTA, delete action.
17. `QuizFormPage` — create/edit quiz form.
18. `QuizDetailPage` — quiz detail + nested questions list with add/edit/delete.
19. `QuestionFormPage` — create/edit question form.
20. `App.tsx` — define routes; wrap all pages in `AppLayout`.

### Phase F — Wrap up
21. Manual end-to-end pass: create → read → update → delete for both quizzes and questions.
22. Confirm every screen matches `DESIGN.md` (pill buttons, 12px cards, teal hero/footer, green CTAs only).
23. Add short run instructions to a `README.md` (backend: `uvicorn app.main:app --reload`; frontend: `npm run dev`).

---

## 7. Run Commands

```bash
# Backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload          # http://localhost:8000  (docs at /docs)

# Frontend
cd frontend
npm install
npm run dev                            # http://localhost:5173
```

---

## 8. Scope Boundaries

**In scope:** CRUD for quizzes and questions, normalized 2-table schema, design-system-compliant UI.

**Out of scope (kept simple intentionally):** authentication, quiz-taking/scoring flow, multiple-choice options table, pagination, search. Schema and folder layout leave room to add these later without rework.
