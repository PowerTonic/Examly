export interface Option {
  id: number;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  created_at: string;
  options: Option[];
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

export interface OptionInput {
  text: string;
  is_correct: boolean;
}

export interface QuestionInput {
  text: string;
  options: OptionInput[];
}
