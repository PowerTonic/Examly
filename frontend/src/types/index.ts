export interface Option {
  id: number;
  text: string;
  image_url: string | null;
  is_correct: boolean;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  image_url: string | null;
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
  image_url: string | null;
  is_correct: boolean;
}

export interface QuestionInput {
  text: string;
  image_url: string | null;
  options: OptionInput[];
}
