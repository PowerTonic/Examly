"""Seed the database with sample multiple-choice quizzes.

Usage (from the backend/ directory, with the venv active):
    python seed.py

Idempotent: clears existing quizzes first, then inserts a fresh sample set.
Each question carries several options; the one marked True is correct.
"""

from app.database import Base, SessionLocal, engine
from app.models import Option, Question, Quiz

SAMPLE_DATA = [
    {
        "title": "World Geography",
        "description": "Capitals, rivers, and continents.",
        "questions": [
            (
                "What is the capital of Japan?",
                [("Tokyo", True), ("Osaka", False), ("Kyoto", False), ("Nagoya", False)],
            ),
            (
                "Which is the longest river in the world?",
                [("The Nile", True), ("The Amazon", False), ("The Yangtze", False), ("The Mississippi", False)],
            ),
            (
                "On which continent is the Sahara Desert?",
                [("Africa", True), ("Asia", False), ("Australia", False), ("South America", False)],
            ),
        ],
    },
    {
        "title": "Basic Science",
        "description": "Fundamentals of physics and chemistry.",
        "questions": [
            (
                "What is the chemical symbol for water?",
                [("H2O", True), ("O2", False), ("CO2", False), ("HO", False)],
            ),
            (
                "What planet is known as the Red Planet?",
                [("Mars", True), ("Venus", False), ("Jupiter", False), ("Saturn", False)],
            ),
        ],
    },
    {
        "title": "History Trivia",
        "description": "Key events and famous figures.",
        "questions": [
            (
                "In which year did World War II end?",
                [("1945", True), ("1939", False), ("1918", False), ("1950", False)],
            ),
            (
                "Who was the first President of the United States?",
                [("George Washington", True), ("Thomas Jefferson", False), ("Abraham Lincoln", False), ("John Adams", False)],
            ),
        ],
    },
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for quiz in db.query(Quiz).all():
            db.delete(quiz)
        db.commit()

        question_total = 0
        for entry in SAMPLE_DATA:
            quiz = Quiz(title=entry["title"], description=entry["description"])
            for text, options in entry["questions"]:
                question = Question(text=text)
                question.options = [
                    Option(text=opt_text, is_correct=is_correct)
                    for opt_text, is_correct in options
                ]
                quiz.questions.append(question)
                question_total += 1
            db.add(quiz)
        db.commit()

        print(f"Seeded {len(SAMPLE_DATA)} quizzes with {question_total} questions.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
