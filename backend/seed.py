"""Seed the database with sample quizzes and questions.

Usage (from the backend/ directory, with the venv active):
    python seed.py

Idempotent: clears existing quizzes first, then inserts a fresh sample set.
"""

from app.database import Base, SessionLocal, engine
from app.models import Question, Quiz

SAMPLE_DATA = [
    {
        "title": "World Geography",
        "description": "Capitals, rivers, and continents.",
        "questions": [
            ("What is the capital of Japan?", "Tokyo"),
            ("Which is the longest river in the world?", "The Nile"),
            ("On which continent is the Sahara Desert?", "Africa"),
        ],
    },
    {
        "title": "Basic Science",
        "description": "Fundamentals of physics and chemistry.",
        "questions": [
            ("What is the chemical symbol for water?", "H2O"),
            ("What planet is known as the Red Planet?", "Mars"),
        ],
    },
    {
        "title": "History Trivia",
        "description": "Key events and famous figures.",
        "questions": [
            ("In which year did World War II end?", "1945"),
            ("Who was the first President of the United States?", "George Washington"),
        ],
    },
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Clear existing data (questions cascade with their quizzes).
        for quiz in db.query(Quiz).all():
            db.delete(quiz)
        db.commit()

        for entry in SAMPLE_DATA:
            quiz = Quiz(title=entry["title"], description=entry["description"])
            quiz.questions = [
                Question(text=text, correct_answer=answer)
                for text, answer in entry["questions"]
            ]
            db.add(quiz)
        db.commit()

        total_q = sum(len(e["questions"]) for e in SAMPLE_DATA)
        print(f"Seeded {len(SAMPLE_DATA)} quizzes with {total_q} questions.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
