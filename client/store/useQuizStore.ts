import { create } from 'zustand';
import { 
  Question, 
  QuizSession, 
  SessionConfig, 
  // ¡Nuevas importaciones necesarias para checkAnswer!
  MultipleChoiceQuestion, 
  TrueFalseQuestion, 
  OrderStepsQuestion, 
  MatchItemsQuestion, 
  FillInTheBlankQuestion 
} from '@/types';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/localStorage';

interface QuizState {
  questions: Question[];
  currentSession: QuizSession | null;
  availableSessions: SessionConfig[];
  currentSessionConfig: SessionConfig | null;
  
  setQuestions: (questions: Question[]) => void;
  addQuestions: (questions: Question[]) => void;
  clearQuestions: () => void;
  
  startSession: (config: SessionConfig, questionIds?: string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  answerQuestion: (questionId: string, answer: unknown) => void;
  endSession: () => void;
  
  createSessionConfig: (config: SessionConfig) => void;
  deleteSessionConfig: (configId: string) => void;
  loadSessionConfig: (configId: string) => void;
  
  loadInitialData: () => void;
  saveSessionConfig: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentSession: null,
  availableSessions: [],
  currentSessionConfig: null,

  setQuestions: (questions: Question[]) => {
    set({ questions });
    saveToLocalStorage('recall_questions', questions);
  },

  addQuestions: (newQuestions: Question[]) => {
    set((state) => {
      const combined = [...state.questions, ...newQuestions];
      saveToLocalStorage('recall_questions', combined);
      return { questions: combined };
    });
  },

  clearQuestions: () => {
    set({ questions: [] });
    localStorage.removeItem('recall_questions');
  },

  startSession: (config: SessionConfig, questionIds?: string[]) => {
    set((state) => {
      let selectedQuestions = state.questions;

      if (questionIds && questionIds.length > 0) {
        selectedQuestions = state.questions.filter((q) =>
          questionIds.includes(q.id)
        );
      } else if (config.categoryFilter) {
        selectedQuestions = selectedQuestions.filter(
          (q) => q.category === config.categoryFilter
        );
      }

      if (config.difficultyFilter) {
        selectedQuestions = selectedQuestions.filter(
          (q) => q.difficulty === config.difficultyFilter
        );
      }

      selectedQuestions = selectedQuestions.slice(0, config.questionsPerSession);

      if (config.randomizeQuestions) {
        selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);
      }

      const session: QuizSession = {
        id: Date.now().toString(),
        configId: config.id,
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        score: 0,
        answers: {},
        startedAt: Date.now(),
        correctAnswers: [],
        incorrectAnswers: [],
      };

      return { currentSession: session, currentSessionConfig: config };
    });
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.currentSession) return state;
      const nextIndex = state.currentSession.currentQuestionIndex + 1;
      if (nextIndex >= state.currentSession.questions.length) {
        return {
          currentSession: {
            ...state.currentSession,
            completedAt: Date.now(),
          },
        };
      }
      return {
        currentSession: {
          ...state.currentSession,
          currentQuestionIndex: nextIndex,
        },
      };
    });
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.currentSession) return state;
      const prevIndex = Math.max(state.currentSession.currentQuestionIndex - 1, 0);
      return {
        currentSession: {
          ...state.currentSession,
          currentQuestionIndex: prevIndex,
        },
      };
    });
  },

  answerQuestion: (questionId: string, answer: unknown) => {
    set((state) => {
      if (!state.currentSession) return state;

      const question = state.currentSession.questions.find(
        (q) => q.id === questionId
      );
      if (!question) return state;

      const isCorrect = checkAnswer(question, answer);
      const newScore = isCorrect ? state.currentSession.score + 1 : state.currentSession.score;

      return {
        currentSession: {
          ...state.currentSession,
          answers: {
            ...state.currentSession.answers,
            [questionId]: answer,
          },
          score: newScore,
          correctAnswers: isCorrect
            ? [...state.currentSession.correctAnswers, questionId]
            : state.currentSession.correctAnswers,
          incorrectAnswers: !isCorrect
            ? [...state.currentSession.incorrectAnswers, questionId]
            : state.currentSession.incorrectAnswers,
        },
      };
    });
  },

  endSession: () => {
    set((state) => ({
      currentSession: state.currentSession
        ? { ...state.currentSession, completedAt: Date.now() }
        : null,
    }));
  },

  createSessionConfig: (config: SessionConfig) => {
    set((state) => {
      const updated = [...state.availableSessions, config];
      saveToLocalStorage('recall_sessions', updated);
      return { availableSessions: updated };
    });
  },

  deleteSessionConfig: (configId: string) => {
    set((state) => {
      const updated = state.availableSessions.filter((s) => s.id !== configId);
      saveToLocalStorage('recall_sessions', updated);
      return { availableSessions: updated };
    });
  },

  loadSessionConfig: (configId: string) => {
    set((state) => ({
      currentSessionConfig:
        state.availableSessions.find((s) => s.id === configId) || null,
    }));
  },

  loadInitialData: () => {
    const questions = loadFromLocalStorage<Question[]>('recall_questions', []);
    const sessions = loadFromLocalStorage<SessionConfig[]>('recall_sessions', []);
    set({ questions, availableSessions: sessions });
  },

  saveSessionConfig: () => {
    set((state) => {
      if (state.currentSessionConfig) {
        const updated = state.availableSessions.map((s) =>
          s.id === state.currentSessionConfig!.id ? state.currentSessionConfig! : s
        );
        saveToLocalStorage('recall_sessions', updated);
        return { availableSessions: updated };
      }
      return state;
    });
  },
}));

// En useQuizStore.ts
// --- Type Guards (Aseguran que la Question tiene las propiedades necesarias) ---
function isMatchItemsQuestion(question: Question): question is MatchItemsQuestion {
    return question.type === 'match-items' && 'pairs' in question;
}

function isFillInTheBlankQuestion(question: Question): question is FillInTheBlankQuestion {
    return question.type === 'fill-in-the-blank' && 'correctText' in question;
}
// --------------------

function checkAnswer(question: Question, answer: unknown): boolean {
  switch (question.type) {
    case 'multiple-choice':
      // Usamos Type Assertion para acceder a .correctAnswer
      return answer === (question as MultipleChoiceQuestion).correctAnswer;
      
    case 'true-false':
      return answer === (question as TrueFalseQuestion).correctAnswer;
      
    case 'order-steps':
      // Usamos Type Assertion para acceder a .correctOrder
      return JSON.stringify(answer) === JSON.stringify((question as OrderStepsQuestion).correctOrder);
      
    case 'match-items':
      // Usamos Type Guard
      if (!isMatchItemsQuestion(question)) return false; 
      
      // La respuesta (answer) debe ser un array
      if (!Array.isArray(answer)) return false;
      
      // Lógica de verificación de Match Items (Asegúrese de que esta lógica coincida con cómo su front-end organiza la respuesta)
      // *Se mantiene la lógica previa, ya que debe coincidir con su front-end*
      return answer.every(
        (match: { left: number; right: number }, index: number) =>
          question.pairs[match.left]?.right === question.pairs[match.right]?.right
      );
      
    // Lógica para el nuevo tipo Fill-in-the-Blank
    case 'fill-in-the-blank':
      // Usamos Type Guard
      if (!isFillInTheBlankQuestion(question)) return false;

      // La respuesta del usuario debe ser un string
      if (typeof answer !== 'string') return false;
      
      // Función de normalización: convierte a minúsculas y quita espacios/puntuación
      const normalize = (text: string) => 
        text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      
      const normalizedUserAnswer = normalize(answer);
      
      // Usamos Type Assertion para acceder a .correctText
      const correctText = (question as FillInTheBlankQuestion).correctText;

      // Si correctText es un array (múltiples respuestas válidas)
      if (Array.isArray(correctText)) {
        return correctText.some(correct => normalize(correct) === normalizedUserAnswer);
      }
      
      // Si correctText es un string simple
      return normalize(correctText) === normalizedUserAnswer;

    default:
      return false;
  }
}