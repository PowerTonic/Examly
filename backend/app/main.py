from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import questions, quizzes

Base.metadata.create_all(bind=engine)

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
