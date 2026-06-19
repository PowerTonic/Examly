# Quiz App

A minimal, clean quiz application with full CRUD on quizzes and questions.

- **Backend:** Python + FastAPI + SQLAlchemy (SQLite)
- **Frontend:** TypeScript + React (Vite), React Router
- **Design:** Every UI surface follows [`DESIGN.md`](./DESIGN.md) (MongoDB design system) — deep-teal hero/footer, bright-green pill CTAs, Euclid Circular A type, 12px cards.

See [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) for the full design and build breakdown.

## Project structure

```
backend/    FastAPI app, SQLAlchemy models, SQLite database
frontend/   React + TypeScript SPA (Vite)
DESIGN.md   Design system — source of truth for all styling
```

## Database schema (3NF)

Two tables, one-to-many with cascade delete:

- `quizzes` — `id`, `title`, `description`, `created_at`
- `questions` — `id`, `quiz_id` (FK → quizzes, cascade), `text`, `correct_answer`, `created_at`

## API endpoints

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/quizzes` | List quizzes |
| GET | `/api/quizzes/{id}` | Get a quiz (with questions) |
| POST | `/api/quizzes` | Create a quiz |
| PUT | `/api/quizzes/{id}` | Update a quiz |
| DELETE | `/api/quizzes/{id}` | Delete a quiz (cascades) |
| GET | `/api/quizzes/{id}/questions` | List a quiz's questions |
| POST | `/api/quizzes/{id}/questions` | Add a question |
| GET | `/api/questions/{id}` | Get a question |
| PUT | `/api/questions/{id}` | Update a question |
| DELETE | `/api/questions/{id}` | Delete a question |

## Running locally

### Backend (http://localhost:8000, docs at `/docs`)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://127.0.0.1:8000`; CORS is preconfigured for the Vite dev server.
