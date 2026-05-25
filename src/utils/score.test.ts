import { describe, it, expect } from 'vitest';
import { calculateScore, MAX_SCORE } from '../utils/score';
import { questions, getScoreFeedback } from '../data/questions';

// Helpers that find the correct data index for each score tier.
// These are necessary because options are intentionally shuffled in the data
// so the best answer is not always at position 0.
const bestAnswers = () => questions.map((q) => q.options.findIndex((o) => o.score === 3));
const worstAnswers = () => questions.map((q) => q.options.findIndex((o) => o.score === 0));
const score2Answers = () => questions.map((q) => q.options.findIndex((o) => o.score === 2));

// ── calculateScore ────────────────────────────────────────────────────────

describe('calculateScore', () => {
  it('returns max score when the best option for each question is selected', () => {
    expect(calculateScore(bestAnswers())).toBe(MAX_SCORE);
  });

  it('returns 0 when the worst option for each question is selected', () => {
    expect(calculateScore(worstAnswers())).toBe(0);
  });

  it('returns 0 for an all-null (unanswered) array', () => {
    const unanswered = new Array(questions.length).fill(null);
    expect(calculateScore(unanswered)).toBe(0);
  });

  it('correctly sums answers that all score 2', () => {
    expect(calculateScore(score2Answers())).toBe(2 * questions.length);
  });

  it('skips null entries without throwing', () => {
    // Answer questions 0, 2, 4 with their best option only (3 pts each → 9).
    const best = bestAnswers();
    const partial = new Array(questions.length).fill(null);
    partial[0] = best[0];
    partial[2] = best[2];
    partial[4] = best[4];
    expect(calculateScore(partial)).toBe(9);
  });

  it('returns 0 for an empty array', () => {
    expect(calculateScore([])).toBe(0);
  });
});

// ── MAX_SCORE ─────────────────────────────────────────────────────────────

describe('MAX_SCORE', () => {
  it('equals 3 × number of questions', () => {
    expect(MAX_SCORE).toBe(questions.length * 3);
  });
});

// ── getScoreFeedback ──────────────────────────────────────────────────────

describe('getScoreFeedback', () => {
  it('returns "Strong Foundation" for a perfect score', () => {
    expect(getScoreFeedback(MAX_SCORE).title).toBe('Strong Foundation');
  });

  it('returns "Strong Foundation" at the lower boundary (36)', () => {
    expect(getScoreFeedback(36).title).toBe('Strong Foundation');
  });

  it('returns "Growing Together" just below Strong boundary (35)', () => {
    expect(getScoreFeedback(35).title).toBe('Growing Together');
  });

  it('returns "Growing Together" at the lower boundary (22)', () => {
    expect(getScoreFeedback(22).title).toBe('Growing Together');
  });

  it('returns "Time to Reconnect" just below Growing boundary (21)', () => {
    expect(getScoreFeedback(21).title).toBe('Time to Reconnect');
  });

  it('returns "Time to Reconnect" for zero score', () => {
    expect(getScoreFeedback(0).title).toBe('Time to Reconnect');
  });

  it('always returns a non-empty message string', () => {
    [0, 10, 22, 30, 36, MAX_SCORE].forEach((score) => {
      expect(getScoreFeedback(score).message.length).toBeGreaterThan(0);
    });
  });
});
