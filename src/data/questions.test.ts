import { describe, it, expect } from 'vitest';
import { questions } from '../data/questions';

describe('questions data integrity', () => {
  it('has at least one question', () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it('every question has exactly 4 options', () => {
    questions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('every option score is one of {0, 1, 2, 3}', () => {
    questions.forEach((q) => {
      q.options.forEach((opt) => {
        expect([0, 1, 2, 3]).toContain(opt.score);
      });
    });
  });

  it('every question has a non-empty text', () => {
    questions.forEach((q) => {
      expect(q.text.trim().length).toBeGreaterThan(0);
    });
  });

  it('every question has a non-empty principle', () => {
    questions.forEach((q) => {
      expect(q.principle.trim().length).toBeGreaterThan(0);
    });
  });

  it('question IDs are unique', () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each question has a best option with score 3', () => {
    questions.forEach((q) => {
      const scores = q.options.map((o) => o.score);
      expect(Math.max(...scores)).toBe(3);
    });
  });

  it('each question has a worst option with score 0', () => {
    questions.forEach((q) => {
      const scores = q.options.map((o) => o.score);
      expect(Math.min(...scores)).toBe(0);
    });
  });
});
