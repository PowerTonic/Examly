from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.get("/{question_id}", response_model=schemas.QuestionOut)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = crud.get_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found"
        )
    return question


@router.put("/{question_id}", response_model=schemas.QuestionOut)
def update_question(
    question_id: int, data: schemas.QuestionUpdate, db: Session = Depends(get_db)
):
    question = crud.get_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found"
        )
    return crud.update_question(db, question, data)


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = crud.get_question(db, question_id)
    if question is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question not found"
        )
    crud.delete_question(db, question)
