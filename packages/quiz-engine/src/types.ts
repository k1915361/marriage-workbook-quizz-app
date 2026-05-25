import { questions } from '@marriage-workbook/quiz-data';

export interface QuizResult {
  version: '1';
  participantName?: string;
  /** Data indices (0–3) for each question, not display indices. Length === questions.length. */
  answers: number[];
  totalScore: number;
  maxScore: number;
  completedAt: string;
}

export function isQuizResult(value: unknown): value is QuizResult {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    v['version'] === '1' &&
    typeof v['completedAt'] === 'string' &&
    typeof v['totalScore'] === 'number' &&
    typeof v['maxScore'] === 'number' &&
    Array.isArray(v['answers']) &&
    (v['answers'] as unknown[]).length === questions.length &&
    (v['answers'] as unknown[]).every(
      (a) => typeof a === 'number' && Number.isInteger(a) && a >= 0 && a <= 3,
    )
  );
}

export interface QuizBreakdownItem {
  questionNumber: number;
  principle: string;
  question: string;
  chosenAnswer: string;
  pointsEarned: number;
  pointsMax: 3;
}

export interface EnrichedExport extends QuizResult {
  assessment: {
    title: string;
    message: string;
  };
  breakdown: QuizBreakdownItem[];
}
