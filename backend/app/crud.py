from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas


# ---------- Quiz ----------
def list_quizzes(db: Session) -> list[models.Quiz]:
    return list(db.scalars(select(models.Quiz).order_by(models.Quiz.id)))


def get_quiz(db: Session, quiz_id: int) -> models.Quiz | None:
    return db.get(models.Quiz, quiz_id)


def create_quiz(db: Session, data: schemas.QuizCreate) -> models.Quiz:
    quiz = models.Quiz(title=data.title, description=data.description)
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def update_quiz(db: Session, quiz: models.Quiz, data: schemas.QuizUpdate) -> models.Quiz:
    quiz.title = data.title
    quiz.description = data.description
    db.commit()
    db.refresh(quiz)
    return quiz


def delete_quiz(db: Session, quiz: models.Quiz) -> None:
    db.delete(quiz)
    db.commit()


# ---------- Question ----------
def list_questions(db: Session, quiz_id: int) -> list[models.Question]:
    return list(
        db.scalars(
            select(models.Question)
            .where(models.Question.quiz_id == quiz_id)
            .order_by(models.Question.id)
        )
    )


def get_question(db: Session, question_id: int) -> models.Question | None:
    return db.get(models.Question, question_id)


def create_question(
    db: Session, quiz_id: int, data: schemas.QuestionCreate
) -> models.Question:
    question = models.Question(
        quiz_id=quiz_id, text=data.text, image_url=data.image_url
    )
    question.options = [
        models.Option(text=o.text, image_url=o.image_url, is_correct=o.is_correct)
        for o in data.options
    ]
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


def update_question(
    db: Session, question: models.Question, data: schemas.QuestionUpdate
) -> models.Question:
    question.text = data.text
    question.image_url = data.image_url
    # Replace the full option set; orphaned rows are removed via delete-orphan.
    question.options[:] = [
        models.Option(text=o.text, image_url=o.image_url, is_correct=o.is_correct)
        for o in data.options
    ]
    db.commit()
    db.refresh(question)
    return question


def delete_question(db: Session, question: models.Question) -> None:
    db.delete(question)
    db.commit()
