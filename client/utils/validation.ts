import { Question, QuestionType } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  questions?: Question[];
}

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

  if (!q.type || !isValidQuestionType(q.type)) {
    errors.push(
      'Missing or invalid "type" (must be: multiple-choice, true-false, order-steps, match-items)'
    );
  }

  if (!q.category || typeof q.category !== 'string') {
    errors.push('Missing or invalid "category" (must be string)');
  }

  if (!q.difficulty || !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push('Missing or invalid "difficulty" (must be: easy, medium, hard)');
  }

  const type = q.type as QuestionType;

  if (type === 'multiple-choice') {
    validateMultipleChoice(q, errors);
  } else if (type === 'true-false') {
    validateTrueFalse(q, errors);
  } else if (type === 'order-steps') {
    validateOrderSteps(q, errors);
  } else if (type === 'match-items') {
    validateMatchItems(q, errors);
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

function isValidQuestionType(type: unknown): type is QuestionType {
  return ['multiple-choice', 'true-false', 'order-steps', 'match-items'].includes(
    type as string
  );
}
