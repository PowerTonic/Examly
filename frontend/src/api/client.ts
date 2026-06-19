import type { Question, QuestionInput, Quiz, QuizInput } from "../types";

const BASE_URL = "http://127.0.0.1:8000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = String(body.detail);
    } catch {
      /* response had no JSON body */
    }
    throw new Error(detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---------- Quizzes ----------
export const listQuizzes = () => request<Quiz[]>("/quizzes");

export const getQuiz = (id: number) => request<Quiz>(`/quizzes/${id}`);

export const createQuiz = (data: QuizInput) =>
  request<Quiz>("/quizzes", { method: "POST", body: JSON.stringify(data) });

export const updateQuiz = (id: number, data: QuizInput) =>
  request<Quiz>(`/quizzes/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteQuiz = (id: number) =>
  request<void>(`/quizzes/${id}`, { method: "DELETE" });

// ---------- Questions ----------
export const getQuestion = (id: number) =>
  request<Question>(`/questions/${id}`);

export const createQuestion = (quizId: number, data: QuestionInput) =>
  request<Question>(`/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateQuestion = (id: number, data: QuestionInput) =>
  request<Question>(`/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteQuestion = (id: number) =>
  request<void>(`/questions/${id}`, { method: "DELETE" });
