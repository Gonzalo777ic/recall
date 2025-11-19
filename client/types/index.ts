// =================================================================
// DEFINICIÓN IDEAL Y MANIFIESTO DE BUENAS PRÁCTICAS DEL PROYECTO
// =================================================================
/*
 * RESUMEN DE ARQUITECTURA DE TIPOS:
 *
 * 1. DISCRIMINATED UNIONS (Uniones Discriminadas):
 * Se usa en el tipo `Question`. Al forzar la propiedad literal 'type' en cada interfaz,
 * permitimos que TypeScript infiera automáticamente las propiedades disponibles (Type Narrowing)
 * sin necesidad de castings manuales. Es el estándar de oro para manejo de polimorfismo.
 *
 * 2. LITERAL TYPES vs ENUMS:
 * Para `TQuestionDifficulty` o `TQuizStatus`, usamos uniones de strings. Esto evita el código
 * extra que generan los Enums en tiempo de ejecución y mantiene el contrato con el API limpio
 * y legible (JSON strings en lugar de índices numéricos opacos).
 *
 * 3. MAPPED TYPES (Tipos Mapeados):
 * En `TFormValidationErrors`, usamos la sintaxis `[K in keyof T]`. Esto asegura mantenibilidad:
 * si el modelo de negocio cambia, el sistema de validación de errores alerta automáticamente
 * si faltan campos, actuando como una "red de seguridad" en desarrollo.
 *
 * 4. SEPARACIÓN DE DTOs vs ENTIDADES ENRIQUECIDAS:
 * Distinguimos entre datos crudos (`SessionConfig` - Pipe Directo) y datos hidratados para UI
 * (`QuizSession` - Enriquecido). Esto optimiza el frontend para tener todo lo necesario en memoria
 * sin hacer múltiples llamadas al backend durante el flujo crítico del examen.
 */

// =================================================================
// Bloque 1: Tipos Básicos y Constantes (Literal Unions)
// Utilizados para definir valores fijos y sencillos.
// =================================================================

/**
 * @description Enumeración de las posibles dificultades para una pregunta o un filtro de sesión.
 *
 * CLASIFICACIÓN: String Literal Union.
 * USO: Validación de formularios y filtros de consulta en BD.
 * ORIGEN (PIPE): Directo (Valor crudo almacenado en columna VARCHAR/ENUM de la BD).
 * BUENA PRÁCTICA: Uso de literales legibles en lugar de "Magic Numbers" o Enums numéricos.
 */
export type TQuestionDifficulty = 'easy' | 'medium' | 'hard';

/**
 * @description Enumeración de los tipos de pregunta disponibles en el sistema.
 *
 * CLASIFICACIÓN: String Literal Union (Discriminante).
 * USO: Actúa como la propiedad "discriminante" para el polimorfismo de `Question`.
 * ORIGEN (PIPE): Directo (Valor crudo en BD).
 */
export type TQuestionType = 'multiple-choice' | 'true-false' | 'order-steps' | 'match-items' | 'fill-in-the-blank';

/**
 * @description Estado de una sesión de cuestionario (QuizSession).
 *
 * CLASIFICACIÓN: String Literal Union (Máquina de Estados).
 * USO: Control de flujo de la UI (mostrar loader, preguntas o resultados).
 * ORIGEN (PIPE): Directo (Estado persistido).
 */
export type TQuizStatus = 'idle' | 'in-progress' | 'completed' | 'paused';

// =================================================================
// Bloque 2: Tipos de Dominio (Enriquecidos)
// Estructuras de datos principales del negocio (preguntas, sesiones, respuestas).
// =================================================================

/**
 * @description Bloque base para todos los tipos de pregunta. Contiene metadatos comunes.
 *
 * CLASIFICACIÓN: Interface (Base/Parent).
 * USO: Herencia para evitar duplicidad de código en las definiciones específicas.
 * ORIGEN (PIPE): Directo (Campos comunes de la tabla `questions`).
 */
export interface BaseQuestion {
  id: string;
  category: string;
  difficulty: TQuestionDifficulty;
  createdAt: number; // Timestamp UNIX
  updatedAt?: number;
}

// --- Variantes de Preguntas (Polimorfismo) ---

export interface MultipleChoiceQuestion extends BaseQuestion {
  // 'type' es el discriminante literal que hace funcionar la unión.
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: number; // Índice
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

export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'fill-in-the-blank';
  question: string;
  correctText: string | string[];
  explanation?: string;
}

/**
 * @description Tipo de unión para cualquier objeto de pregunta.
 *
 * CLASIFICACIÓN: Discriminated Union (Unión Discriminada).
 * USO: Permite iterar arrays de preguntas mixtas y renderizar componentes dinámicos.
 * ORIGEN (PIPE): Agregado Lógico (El backend devuelve un JSON, el frontend lo tipa así para seguridad).
 * BUENA PRÁCTICA: Habilita el "Type Narrowing" seguro en bloques switch/if.
 */
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | OrderStepsQuestion
  | MatchItemsQuestion
  | FillInTheBlankQuestion;

/**
 * @description Configuración de una sesión de cuestionario.
 *
 * CLASIFICACIÓN: Interface (DTO).
 * USO: Payload para crear una nueva sesión en el servidor.
 * ORIGEN (PIPE): Directo (Mapea 1:1 con la tabla de configuración de sesiones).
 */
export interface SessionConfig {
  id: string;
  name: string;
  categoryFilter?: string;
  difficultyFilter?: TQuestionDifficulty;
  questionsPerSession: number;
  randomizeQuestions: boolean;
  createdAt: number;
  userId: string;
}

/**
 * @description Tipo de valor que el usuario puede proporcionar como respuesta.
 *
 * CLASIFICACIÓN: Union Type (Primitivos y Objetos).
 * USO: Flexibilidad para inputs diversos (radio, checkbox, drag & drop, text).
 * ORIGEN (PIPE): Directo (Payload de respuesta HTTP).
 * BUENA PRÁCTICA: Desacopla el valor de la lógica de validación.
 */
export type QuizAnswerValue = number | boolean | number[] | Array<{ left: string, right: string }> | string;

/**
 * @description Representa la respuesta de un usuario a una pregunta.
 *
 * CLASIFICACIÓN: Interface.
 * USO: Registro histórico de respuestas.
 * ORIGEN (PIPE): Directo (Entidad transaccional `user_answers`).
 */
export interface UserAnswer {
  questionId: string;
  questionType: TQuestionType;
  value: QuizAnswerValue;
  isCorrect?: boolean; // Calculado a veces en back o front
  answeredAt: number;
}

/**
 * @description Estado de una sesión de cuestionario en curso o completada.
 *
 * CLASIFICACIÓN: Composite Interface (Agregado).
 * USO: Objeto principal del store en tiempo de ejecución.
 * ORIGEN (PIPE): Enriquecido / Agregado.
 * NOTA: A diferencia de una tabla SQL plana, este objeto contiene `questions: Question[]`
 * (objetos completos) y no solo IDs. Esto implica un proceso de "Hydration" previo.
 */
export interface QuizSession {
  id: string;
  configId: string;
  userId: string;
  questions: Question[]; // <-- Dato enriquecido (Join)
  currentQuestionIndex: number;
  status: TQuizStatus;
  score: number;
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
 *
 * CLASIFICACIÓN: Interface (React Props).
 * USO: Contrato de comunicación entre componentes padre/hijo.
 * ORIGEN: Frontend Only (UI).
 */
export interface QuestionRendererProps {
  question: Question;
  onSubmitAnswer: (answerValue: QuizAnswerValue) => void;
  currentAnswer?: QuizAnswerValue;
  showFeedback?: boolean;
}

/**
 * @description Estado de la tienda global de Zustand para el Quiz.
 *
 * CLASIFICACIÓN: Interface (State Store).
 * USO: Gestión de estado global del cliente.
 * ORIGEN: Frontend Only.
 */
export interface QuizStoreState {
  session: QuizSession | null;
  configs: SessionConfig[];
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  // Actions
  startSession: (config: SessionConfig, questions: Question[]) => void;
  submitAnswer: (questionId: string, answerValue: QuizAnswerValue) => boolean;
  goToNextQuestion: () => void;
}

/**
 * @description Estructura de respuesta de API genérica.
 *
 * CLASIFICACIÓN: Generic Discriminated Union.
 * USO: Estandarización de respuestas del servidor.
 * ORIGEN: Utility / Transport Layer.
 * BUENA PRÁCTICA: El uso de Genéricos (<T>) permite reutilizar este envoltorio
 * para cualquier entidad (User, Product, Quiz) manteniendo tipado fuerte.
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
 * @description Estructura para errores de validación en formularios.
 *
 * CLASIFICACIÓN: Mapped Type (Tipo Mapeado).
 * USO: Gestión de errores de formularios (React Hook Form / Formik).
 * ORIGEN: Utility / UI Logic.
 * BUENA PRÁCTICA: `[K in keyof T]` hace que este tipo sea "reactivo" a cambios
 * en la interfaz original. Si T cambia, los errores esperados también cambian.
 */
export type TFormValidationErrors<T extends object> = {
  [K in keyof T]?: string;
};