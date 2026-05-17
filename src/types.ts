import { questions } from './data/questions';

/**
 * A fully completed (or restored) quiz session.
 * This is the canonical data structure for both export formats.
 */
export interface QuizResult {
  /** Schema version — increment when the shape changes. */
  version: '1';
  /** Option index chosen per question (0–3). Length === questions.length. */
  answers: number[];
  totalScore: number;
  maxScore: number;
  /** ISO-8601 timestamp of when the quiz was completed or imported. */
  completedAt: string;
}

/**
 * Runtime validator. Returns true only if value is a well-formed QuizResult
 * that is compatible with the current question set.
 */
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

/** One entry in the human-readable breakdown embedded in the JSON export. */
export interface QuizBreakdownItem {
  questionNumber: number;
  principle: string;
  question: string;
  chosenAnswer: string;
  pointsEarned: number;
  pointsMax: 3;
}

/**
 * The full JSON export shape — a superset of QuizResult.
 * Adds human-readable feedback and a per-question breakdown so the
 * downloaded file is self-contained and readable without the app.
 *
 * isQuizResult still validates correctly because it only checks the
 * QuizResult base fields; extra keys are ignored by the validator,
 * so EnrichedExport JSON can always be pasted back into Restore.
 */
export interface EnrichedExport extends QuizResult {
  assessment: {
    title: string;
    message: string;
  };
  breakdown: QuizBreakdownItem[];
}
