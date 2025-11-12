type QuestionType = 'multiple-choice' | 'true-false' | 'order-steps' | 'match-items' | 'fill-in-the-blank';

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

// 🎯 NUEVA INTERFAZ PARA COMPLETAR EL ESPACIO EN BLANCO
export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fill-in-the-blank';
  // El texto que contiene el espacio en blanco o la pregunta que requiere una respuesta de texto
  question: string; 
  // La respuesta correcta. Puede ser un string o un array de strings (para aceptar múltiples respuestas válidas).
  correctText: string | string[]; 
  explanation?: string;
}

// Actualización de Question para incluir el nuevo tipo
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OrderStepsQuestion
  | MatchItemsQuestion
  | FillInTheBlankQuestion; // ¡Añadido!

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