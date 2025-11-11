export type QuestionType = 'multiple-choice' | 'true-false' | 'order-steps' | 'match-items';

export interface BaseQuestion {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  statement: string;
  correctAnswer: boolean;
  explanation?: string;
}

export interface OrderStepsQuestion extends BaseQuestion {
  type: 'order-steps';
  question: string;
  steps: string[];
  correctOrder: number[];
  explanation?: string;
}

export interface MatchItemsQuestion extends BaseQuestion {
  type: 'match-items';
  question: string;
  pairs: Array<{ left: string; right: string }>;
  explanation?: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OrderStepsQuestion
  | MatchItemsQuestion;

export interface SessionConfig {
  id: string;
  name: string;
  categoryFilter?: string;
  difficultyFilter?: 'easy' | 'medium' | 'hard';
  questionsPerSession: number;
  randomizeQuestions: boolean;
  createdAt: number;
}

export interface QuizSession {
  id: string;
  configId: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, unknown>;
  startedAt: number;
  completedAt?: number;
  correctAnswers: string[];
  incorrectAnswers: string[];
}

export interface Answer {
  questionId: string;
  value: unknown;
}
