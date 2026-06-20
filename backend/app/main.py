from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text as _sql

from .database import Base, engine
from .routers import questions, quizzes

Base.metadata.create_all(bind=engine)


def _ensure_image_columns() -> None:
    """Add the `image_url` columns to pre-existing tables (SQLite has no ALTER via create_all)."""
    with engine.begin() as conn:
        for table in ("questions", "options"):
            cols = {row[1] for row in conn.execute(_sql(f"PRAGMA table_info({table})"))}
            if "image_url" not in cols:
                conn.execute(_sql(f"ALTER TABLE {table} ADD COLUMN image_url TEXT"))


_ensure_image_columns()

app = FastAPI(title="Quiz App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quizzes.router)
app.include_router(questions.router)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok"}
