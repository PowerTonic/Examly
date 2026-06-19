export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  correct_answer: string;
  created_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  questions: Question[];
}

export interface QuizInput {
  title: string;
  description: string;
}

export interface QuestionInput {
  text: string;
  correct_answer: string;
}
