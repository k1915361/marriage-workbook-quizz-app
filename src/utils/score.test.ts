import { describe, it, expect } from 'vitest';
import { calculateScore, MAX_SCORE } from '../utils/score';
import { questions, getScoreFeedback } from '../data/questions';

// ── calculateScore ────────────────────────────────────────────────────────

describe('calculateScore', () => {
  it('returns max score when all best options (index 0) are selected', () => {
    const perfect = new Array(questions.length).fill(0);
    expect(calculateScore(perfect)).toBe(MAX_SCORE);
  });

  it('returns 0 when all worst options (index 3) are selected', () => {
    const worst = new Array(questions.length).fill(3);
    expect(calculateScore(worst)).toBe(0);
  });

  it('returns 0 for an all-null (unanswered) array', () => {
    const unanswered = new Array(questions.length).fill(null);
    expect(calculateScore(unanswered)).toBe(0);
  });

  it('correctly sums mixed answers', () => {
    // option 1 = score 2 for every question → total 2 × n
    const mixed = new Array(questions.length).fill(1);
    expect(calculateScore(mixed)).toBe(2 * questions.length);
  });

  it('skips null entries without throwing', () => {
    const partial = [0, null, 0, null, 0];
    // only questions 0, 2, 4 answered with score 3 each → 9
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
  it('returns "Strong Foundation" for a perfect score (15)', () => {
    expect(getScoreFeedback(15).title).toBe('Strong Foundation');
  });

  it('returns "Strong Foundation" at the lower boundary (13)', () => {
    expect(getScoreFeedback(13).title).toBe('Strong Foundation');
  });

  it('returns "Growing Together" just below Strong boundary (12)', () => {
    expect(getScoreFeedback(12).title).toBe('Growing Together');
  });

  it('returns "Growing Together" at the lower boundary (8)', () => {
    expect(getScoreFeedback(8).title).toBe('Growing Together');
  });

  it('returns "Time to Reconnect" just below Growing boundary (7)', () => {
    expect(getScoreFeedback(7).title).toBe('Time to Reconnect');
  });

  it('returns "Time to Reconnect" for zero score', () => {
    expect(getScoreFeedback(0).title).toBe('Time to Reconnect');
  });

  it('always returns a non-empty message string', () => {
    [0, 5, 8, 10, 13, 15].forEach((score) => {
      expect(getScoreFeedback(score).message.length).toBeGreaterThan(0);
    });
  });
});
