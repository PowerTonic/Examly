from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


# ---------- Option ----------
class OptionBase(BaseModel):
    text: str = ""
    image_url: str | None = None
    is_correct: bool = False

    @model_validator(mode="after")
    def _require_content(self):
        if not self.text.strip() and not self.image_url:
            raise ValueError("Each option needs text, an image, or both")
        return self


class OptionOut(OptionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


# ---------- Question ----------
class QuestionBase(BaseModel):
    text: str = ""
    image_url: str | None = None

    @model_validator(mode="after")
    def _require_prompt(self):
        if not self.text.strip() and not self.image_url:
            raise ValueError("A question needs text, an image, or both")
        return self


class QuestionWrite(QuestionBase):
    options: list[OptionBase] = Field(min_length=2)

    @model_validator(mode="after")
    def _validate_options(self):
        correct = sum(1 for o in self.options if o.is_correct)
        if correct != 1:
            raise ValueError("Exactly one option must be marked correct")
        return self


class QuestionCreate(QuestionWrite):
    pass


class QuestionUpdate(QuestionWrite):
    pass


class QuestionOut(QuestionBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    quiz_id: int
    created_at: datetime
    options: list[OptionOut] = []


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
