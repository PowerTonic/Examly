from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])


@router.get("", response_model=list[schemas.QuizOut])
def list_quizzes(db: Session = Depends(get_db)):
    return crud.list_quizzes(db)


@router.get("/{quiz_id}", response_model=schemas.QuizOut)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return quiz


@router.post("", response_model=schemas.QuizOut, status_code=status.HTTP_201_CREATED)
def create_quiz(data: schemas.QuizCreate, db: Session = Depends(get_db)):
    return crud.create_quiz(db, data)


@router.put("/{quiz_id}", response_model=schemas.QuizOut)
def update_quiz(quiz_id: int, data: schemas.QuizUpdate, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return crud.update_quiz(db, quiz, data)


@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    crud.delete_quiz(db, quiz)


# ---------- Nested questions under a quiz ----------
@router.get("/{quiz_id}/questions", response_model=list[schemas.QuestionOut])
def list_questions(quiz_id: int, db: Session = Depends(get_db)):
    quiz = crud.get_quiz(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return crud.list_questions(db, quiz_id)


@router.post(
    "/{quiz_id}/questions",
    response_model=schemas.QuestionOut,
    status_code=status.HTTP_201_CREATED,
)
def create_question(
    quiz_id: int, data: schemas.QuestionCreate, db: Session = Depends(get_db)
):
    quiz = crud.get_quiz(db, quiz_id)
    if quiz is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return crud.create_question(db, quiz_id, data)
