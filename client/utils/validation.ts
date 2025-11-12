import { Question } from '@/types'; // Eliminamos QuestionType de la importación
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  questions?: Question[];
}

export type QuestionType = 
  | 'multiple-choice' 
  | 'true-false' 
  | 'order-steps' 
  | 'match-items'
  | 'fill-in-the-blank'; // ¡Añadido!

export function validateQuestionsJSON(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push('JSON must be an array of questions');
    return { isValid: false, errors };
  }

  if (data.length === 0) {
    errors.push('JSON array cannot be empty');
    return { isValid: false, errors };
  }

  const questions: Question[] = [];

  data.forEach((item, index) => {
    const itemErrors = validateQuestion(item);
    if (itemErrors.length > 0) {
      errors.push(`Question ${index + 1}: ${itemErrors.join(', ')}`);
    } else {
      questions.push(item as Question);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    questions: errors.length === 0 ? questions : undefined,
  };
}



function isValidQuestionType(type: unknown): type is QuestionType {
  // ¡Añadir 'fill-in-the-blank'!
  return ['multiple-choice', 'true-false', 'order-steps', 'match-items', 'fill-in-the-blank'].includes(
    type as string
  );
}



function validateQuestion(item: unknown): string[] {
  const errors: string[] = [];

  if (!item || typeof item !== 'object') {
    errors.push('Question must be an object');
    return errors;
  }

  const q = item as Record<string, unknown>;

  if (!q.id || typeof q.id !== 'string') {
    errors.push('Missing or invalid "id" (must be string)');
  }

  // Comprobación de tipo (CORREGIDO PARA RESOLVER TS2345)
  if (typeof q.type !== 'string') {
      errors.push('Missing or invalid "type" (must be a string)');
  } else if (!isValidQuestionType(q.type)) {
      errors.push(
        'Missing or invalid "type" (must be: multiple-choice, true-false, order-steps, match-items, fill-in-the-blank)'
      );
  }

  // Si no pasó la validación de tipo, retornamos los errores inmediatamente
  // para evitar que 'q.type as QuestionType' cause problemas más adelante.
  if (errors.length > 0) {
      return errors;
  }

  if (!q.category || typeof q.category !== 'string') {
    errors.push('Missing or invalid "category" (must be string)');
  }
  // ... (el resto del código se mantiene igual)

  const type = q.type as QuestionType; // Ahora TypeScript está seguro de que es un QuestionType válido

  if (type === 'multiple-choice') {
    validateMultipleChoice(q, errors);
  } else if (type === 'true-false') {
    validateTrueFalse(q, errors);
  } else if (type === 'order-steps') {
    validateOrderSteps(q, errors);
  } else if (type === 'match-items') {
    validateMatchItems(q, errors);
  } else if (type === 'fill-in-the-blank') {
    validateFillInTheBlank(q, errors);
  }

  return errors;
}

function validateMultipleChoice(q: Record<string, unknown>, errors: string[]): void {
  if (!q.question || typeof q.question !== 'string') {
    errors.push('Missing or invalid "question" (must be string)');
  }

  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push('Missing or invalid "options" (must be array with at least 2 items)');
  }

  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0) {
    errors.push('Missing or invalid "correctAnswer" (must be valid option index)');
  }
}

function validateTrueFalse(q: Record<string, unknown>, errors: string[]): void {
  if (!q.statement || typeof q.statement !== 'string') {
    errors.push('Missing or invalid "statement" (must be string)');
  }

  if (typeof q.correctAnswer !== 'boolean') {
    errors.push('Missing or invalid "correctAnswer" (must be boolean)');
  }
}

function validateOrderSteps(q: Record<string, unknown>, errors: string[]): void {
  if (!q.question || typeof q.question !== 'string') {
    errors.push('Missing or invalid "question" (must be string)');
  }

  if (!Array.isArray(q.steps) || q.steps.length < 2) {
    errors.push('Missing or invalid "steps" (must be array with at least 2 items)');
  }

  if (!Array.isArray(q.correctOrder) || q.correctOrder.length === 0) {
    errors.push('Missing or invalid "correctOrder" (must be array of indices)');
  }
}

function validateMatchItems(q: Record<string, unknown>, errors: string[]): void {
  if (!q.question || typeof q.question !== 'string') {
    errors.push('Missing or invalid "question" (must be string)');
  }

  if (!Array.isArray(q.pairs) || q.pairs.length < 2) {
    errors.push('Missing or invalid "pairs" (must be array with at least 2 items)');
  }

  if (Array.isArray(q.pairs)) {
    q.pairs.forEach((pair, idx) => {
      if (!pair || typeof pair !== 'object') {
        errors.push(`Pair ${idx} must be an object with "left" and "right"`);
        return;
      }

      if (typeof (pair as Record<string, unknown>).left !== 'string') {
        errors.push(`Pair ${idx} missing or invalid "left" (must be string)`);
      }

      if (typeof (pair as Record<string, unknown>).right !== 'string') {
        errors.push(`Pair ${idx} missing or invalid "right" (must be string)`);
      }
    });
  }
}

// client/utils/validation.ts (Función validateFillInTheBlank)

function validateFillInTheBlank(q: Record<string, unknown>, errors: string[]): void {
  if (!q.question || typeof q.question !== 'string') {
    errors.push('Missing or invalid "question" (must be string)');
  }

  // correctText debe ser un string o un array de strings, y no puede estar vacío.
  if (!q.correctText) {
    errors.push('Missing "correctText"');
    return;
  }
  
  // Modificación aquí: Si es string, debe tener contenido
  const isString = typeof q.correctText === 'string' && q.correctText.trim() !== ''; 
  
  // Si es array, todos los elementos deben ser strings no vacíos
  const isStringArray = Array.isArray(q.correctText) && q.correctText.every(item => typeof item === 'string' && item.trim() !== '');

  if (!isString && !isStringArray) {
    errors.push('Invalid "correctText" (must be a non-empty string or an array of non-empty strings)');
  }

  if (isStringArray && (q.correctText as string[]).length === 0) {
     errors.push('"correctText" array cannot be empty');
  }
}