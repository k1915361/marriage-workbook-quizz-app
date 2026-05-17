import { describe, it, expect } from 'vitest';
import { formatResultAsText, exportResultAsJSON, parseImportJSON } from '../utils/export';
import { questions } from '../data/questions';
import { QuizResult } from '../types';

// ── Fixture ───────────────────────────────────────────────────────────────

const FIXTURE: QuizResult = {
  version: '1',
  answers: new Array(questions.length).fill(0), // all best options
  totalScore: questions.length * 3,
  maxScore: questions.length * 3,
  completedAt: '2026-05-16T21:00:00.000Z',
};

// ── formatResultAsText ────────────────────────────────────────────────────

describe('formatResultAsText', () => {
  it('includes the app title', () => {
    expect(formatResultAsText(FIXTURE)).toContain('Marriage Enrichment Quiz');
  });

  it('includes the score line', () => {
    const text = formatResultAsText(FIXTURE);
    expect(text).toContain(`${FIXTURE.totalScore} / ${FIXTURE.maxScore}`);
  });

  it('includes a line for every question principle', () => {
    const text = formatResultAsText(FIXTURE);
    questions.forEach((q) => {
      expect(text).toContain(q.principle);
    });
  });

  it('includes the answer text for each question', () => {
    const text = formatResultAsText(FIXTURE);
    questions.forEach((q, i) => {
      expect(text).toContain(q.options[FIXTURE.answers[i]].text);
    });
  });

  it('includes the assessment title', () => {
    expect(formatResultAsText(FIXTURE)).toContain('Strong Foundation');
  });

  it('returns a non-empty string', () => {
    expect(formatResultAsText(FIXTURE).length).toBeGreaterThan(100);
  });
});

// ── exportResultAsJSON — enriched content ────────────────────────────────

describe('exportResultAsJSON — enriched fields', () => {
  let parsed: Record<string, unknown>;

  // Parse once and reuse across all assertions
  beforeEach(() => {
    parsed = JSON.parse(exportResultAsJSON(FIXTURE)) as Record<string, unknown>;
  });

  it('produces valid JSON', () => {
    expect(() => JSON.parse(exportResultAsJSON(FIXTURE))).not.toThrow();
  });

  it('retains all base QuizResult fields', () => {
    expect(parsed['version']).toBe('1');
    expect(parsed['totalScore']).toBe(FIXTURE.totalScore);
    expect(parsed['maxScore']).toBe(FIXTURE.maxScore);
    expect(parsed['answers']).toEqual(FIXTURE.answers);
    expect(typeof parsed['completedAt']).toBe('string');
  });

  it('includes assessment title and message', () => {
    const assessment = parsed['assessment'] as Record<string, string>;
    expect(assessment['title']).toBe('Strong Foundation');
    expect(assessment['message'].length).toBeGreaterThan(0);
  });

  it('includes a breakdown entry for every question', () => {
    const breakdown = parsed['breakdown'] as unknown[];
    expect(breakdown).toHaveLength(questions.length);
  });

  it('each breakdown item has the principle from questions.ts', () => {
    const breakdown = parsed['breakdown'] as Record<string, unknown>[];
    questions.forEach((q, i) => {
      expect(breakdown[i]['principle']).toBe(q.principle);
    });
  });

  it('each breakdown item has the full question text', () => {
    const breakdown = parsed['breakdown'] as Record<string, unknown>[];
    questions.forEach((q, i) => {
      expect(breakdown[i]['question']).toBe(q.text);
    });
  });

  it('each breakdown item has the chosen answer text', () => {
    const breakdown = parsed['breakdown'] as Record<string, unknown>[];
    questions.forEach((q, i) => {
      const expectedText = q.options[FIXTURE.answers[i]].text;
      expect(breakdown[i]['chosenAnswer']).toBe(expectedText);
    });
  });

  it('each breakdown item has correct pointsEarned and pointsMax', () => {
    const breakdown = parsed['breakdown'] as Record<string, unknown>[];
    questions.forEach((q, i) => {
      expect(breakdown[i]['pointsEarned']).toBe(q.options[FIXTURE.answers[i]].score);
      expect(breakdown[i]['pointsMax']).toBe(3);
    });
  });

  it('enriched export still round-trips through parseImportJSON', () => {
    const json = exportResultAsJSON(FIXTURE);
    const restored = parseImportJSON(json);
    expect(restored).not.toBeNull();
    expect(restored!.totalScore).toBe(FIXTURE.totalScore);
    expect(restored!.answers).toEqual(FIXTURE.answers);
    expect(restored!.version).toBe('1');
  });
});

// ── parseImportJSON — rejection cases ────────────────────────────────────

describe('parseImportJSON', () => {
  it('returns null for an empty string', () => {
    expect(parseImportJSON('')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    expect(parseImportJSON('{not valid json')).toBeNull();
  });

  it('returns null when version field is missing', () => {
    const bad = JSON.stringify({ answers: [0, 0, 0, 0, 0], totalScore: 15, maxScore: 15, completedAt: '2026-01-01' });
    expect(parseImportJSON(bad)).toBeNull();
  });

  it('returns null when version is wrong', () => {
    const bad = JSON.stringify({ ...FIXTURE, version: '99' });
    expect(parseImportJSON(bad)).toBeNull();
  });

  it('returns null when answers array is wrong length', () => {
    const bad = JSON.stringify({ ...FIXTURE, answers: [0, 0] });
    expect(parseImportJSON(bad)).toBeNull();
  });

  it('returns null when an answer is out of range', () => {
    const bad = JSON.stringify({ ...FIXTURE, answers: new Array(questions.length).fill(99) });
    expect(parseImportJSON(bad)).toBeNull();
  });

  it('returns null when answers contains a non-integer', () => {
    const bad = JSON.stringify({ ...FIXTURE, answers: [0.5, 0, 0, 0, 0] });
    expect(parseImportJSON(bad)).toBeNull();
  });

  it('returns null for a plain empty object', () => {
    expect(parseImportJSON('{}')).toBeNull();
  });

  it('returns a valid QuizResult for a well-formed payload', () => {
    const result = parseImportJSON(JSON.stringify(FIXTURE));
    expect(result).not.toBeNull();
    expect(result!.version).toBe('1');
  });
});
