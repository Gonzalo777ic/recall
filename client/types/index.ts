// =================================================================
// Bloque 1: Tipos Básicos y Constantes (Literal Unions)
// Utilizados para definir valores fijos y sencillos.
// =================================================================

/**
 * @description Enumeración de las posibles dificultades para una pregunta o un filtro de sesión.
 * Nomenclatura: Tipo de unión literal para valores constantes (T prefix).
 */
export type TQuestionDifficulty = 'easy' | 'medium' | 'hard';

/**
 * @description Enumeración de los tipos de pregunta disponibles en el sistema.
 * Nomenclatura: Tipo de unión literal para valores constantes (T prefix).
 */
export type TQuestionType = 'multiple-choice' | 'true-false' | 'order-steps' | 'match-items' | 'fill-in-the-blank';

/**
 * @description Estado de una sesión de cuestionario (QuizSession).
 * Nomenclatura: Tipo de utilidad para estados de flujo (T prefix).
 */
export type TQuizStatus = 'idle' | 'in-progress' | 'completed' | 'paused';

// =================================================================
// Bloque 2: Tipos de Dominio (Enriquecidos)
// Estructuras de datos principales del negocio (preguntas, sesiones, respuestas).
// =================================================================

/**
 * @description Bloque base para todos los tipos de pregunta.
 * Contiene metadatos comunes.
 * Nomenclatura: Interfaz de dominio (PascalCase).
 */
export interface BaseQuestion {
  id: string;
  category: string;
  difficulty: TQuestionDifficulty;
  createdAt: number; // Timestamp UNIX
  updatedAt?: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number; // Índice de la respuesta correcta
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
  steps: string[]; // Los pasos desordenados
  correctOrder: number[]; // El orden correcto (ej. [2, 0, 1])
  explanation?: string;
}

export interface MatchItemsQuestion extends BaseQuestion {
  type: 'match-items';
  question: string;
  // Se asume que `left` es lo que se tiene que parear con un `right`
  pairs: Array<{ left: string; right: string }>; 
  explanation?: string;
}

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fill-in-the-blank';
  question: string;
  // Array para respuestas alternativas válidas
  correctText: string | string[]; 
  explanation?: string;
}

/**
 * @description Tipo de unión para cualquier objeto de pregunta.
 */
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OrderStepsQuestion
  | MatchItemsQuestion
  | FillInTheBlankQuestion;

/**
 * @description Configuración de una sesión de cuestionario.
 */
export interface SessionConfig {
  id: string;
  name: string;
  categoryFilter?: string;
  difficultyFilter?: TQuestionDifficulty;
  questionsPerSession: number;
  randomizeQuestions: boolean;
  createdAt: number;
  userId: string; // Para identificar al creador (si aplica)
}

/**
 * @description Tipo de valor que el usuario puede proporcionar como respuesta.
 * Nomenclatura: Tipo de valor de dominio para la respuesta del usuario.
 */
export type QuizAnswerValue = number | boolean | number[] | Array<{ left: string, right: string }> | string;

/**
 * @description Representa la respuesta de un usuario a una pregunta.
 */
export interface UserAnswer {
  questionId: string;
  questionType: TQuestionType;
  value: QuizAnswerValue; 
  isCorrect?: boolean;
  answeredAt: number;
}

/**
 * @description Estado de una sesión de cuestionario en curso o completada.
 */
export interface QuizSession {
  id: string;
  configId: string;
  userId: string;
  questions: Question[];
  currentQuestionIndex: number;
  status: TQuizStatus; // Estado actual (idle, in-progress, completed)
  score: number;
  // Mapa de respuestas donde la clave es el ID de la pregunta
  answers: Record<string, UserAnswer>; 
  startedAt: number;
  completedAt?: number;
}

// =================================================================
// Bloque 3: Tipos de Utilidad y Presentación (UI/State/API)
// Utilizados principalmente por componentes, hooks o la capa de datos.
// =================================================================

/**
 * @description Propiedades para el componente QuestionRenderer.
 * Nomenclatura: Component Props (Props suffix).
 */
export interface QuestionRendererProps {
  question: Question;
  // Función de callback para cuando el usuario envía una respuesta
  onSubmitAnswer: (answerValue: QuizAnswerValue) => void; 
  currentAnswer?: QuizAnswerValue; 
  showFeedback?: boolean;
}

/**
 * @description Estado de la tienda global de Zustand para el Quiz.
 * Nomenclatura: Utilidad de Estado (State suffix).
 */
export interface QuizStoreState {
  session: QuizSession | null;
  configs: SessionConfig[];
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  // Definición de las acciones (métodos) de la tienda.
  startSession: (config: SessionConfig, questions: Question[]) => void;
  submitAnswer: (questionId: string, answerValue: QuizAnswerValue) => boolean;
  goToNextQuestion: () => void;
}

/**
 * @description Estructura de respuesta de API genérica (incluye éxito o error).
 * Nomenclatura: Tipo genérico de utilidad (T prefix, <T> para el payload).
 */
export type TApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  message: string;
  code?: number;
};

/**
 * @description Estructura para errores de validación en formularios (ej. CreateQuestionPage).
 * Nomenclatura: Tipo de utilidad para errores (T prefix, <T> para el objeto de formulario).
 */
export type TFormValidationErrors<T extends object> = {
  [K in keyof T]?: string; // Mapea las claves de T a un string de error opcional.
};