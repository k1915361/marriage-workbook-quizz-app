import { questions } from '@marriage-workbook/quiz-data';

export { MAX_SCORE } from '@marriage-workbook/quiz-data';

/**
 * Sum the scores for an array of data-index answers.
 * Null entries (unanswered) contribute 0 points.
 */
export function calculateScore(answers: (number | null)[]): number {
  return answers.reduce<number>((total, dataIndex, qIdx) => {
    if (dataIndex === null) return total;
    return total + (questions[qIdx]?.options[dataIndex]?.score ?? 0);
  }, 0);
}
