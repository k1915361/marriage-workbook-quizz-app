import { questions } from '../data/questions';

/** Maximum score achievable (3 pts × number of questions). */
export const MAX_SCORE = questions.length * 3;

/**
 * Calculate total score from an array of answer indices.
 * Null entries (unanswered questions) contribute 0 points.
 */
export function calculateScore(answers: (number | null)[]): number {
  return answers.reduce<number>((total, answerIndex, qIdx) => {
    if (answerIndex === null) return total;
    return total + (questions[qIdx]?.options[answerIndex]?.score ?? 0);
  }, 0);
}
