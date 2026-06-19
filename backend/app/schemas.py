from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ---------- Question ----------
class QuestionBase(BaseModel):
    text: str = Field(min_length=1)
    correct_answer: str = Field(min_length=1)


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(QuestionBase):
    pass


class QuestionOut(QuestionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quiz_id: int
    created_at: datetime


# ---------- Quiz ----------
class QuizBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None


class QuizCreate(QuizBase):
    pass


class QuizUpdate(QuizBase):
    pass


class QuizOut(QuizBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    questions: list[QuestionOut] = []
