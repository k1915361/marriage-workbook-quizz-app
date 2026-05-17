import { questions, getScoreFeedback } from '../data/questions';
import { QuizResult, EnrichedExport, isQuizResult } from '../types';

const DIVIDER = '─'.repeat(52);
const THICK   = '━'.repeat(52);

/**
 * Format a QuizResult as a human-readable plain-text string.
 * Suitable for copying to clipboard or pasting into any document.
 */
export function formatResultAsText(result: QuizResult): string {
  const fb = getScoreFeedback(result.totalScore);
  const dateStr = new Date(result.completedAt).toLocaleString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const lines: string[] = [
    'Marriage Enrichment Quiz — Results',
    '"The 7 Principles of Creation Marriage Enrichment Workbook"',
    'by Stephen Stacey',
    '',
    THICK,
    '',
    `Completed : ${dateStr}`,
    `Score     : ${result.totalScore} / ${result.maxScore}`,
    `Assessment: ${fb.title}`,
    '',
    fb.message,
    '',
    THICK,
    '',
    'QUESTION-BY-QUESTION BREAKDOWN',
    '',
  ];

  questions.forEach((q, i) => {
    const chosen = q.options[result.answers[i]];
    lines.push(DIVIDER);
    lines.push(`Q${i + 1} · ${q.principle}`);
    lines.push('');
    lines.push(q.text);
    lines.push('');
    lines.push(`Answer : ${chosen.text}`);
    lines.push(`Points : ${chosen.score} / 3`);
    lines.push('');
  });

  lines.push(THICK);
  lines.push('"The 7 Principles of Creation Marriage Enrichment Workbook"');
  lines.push('by Stephen Stacey');
  return lines.join('\n');
}

/**
 * Serialise a QuizResult to a self-contained JSON string (EnrichedExport).
 *
 * The JSON includes:
 *  - All base QuizResult fields (so the file can always be pasted into Restore)
 *  - assessment — human-readable title + message matching the score tier
 *  - breakdown   — per-question principle, question text, chosen answer, points
 */
export function exportResultAsJSON(result: QuizResult): string {
  const fb = getScoreFeedback(result.totalScore);

  const enriched: EnrichedExport = {
    // Base fields first so they appear at the top of the file
    version: result.version,
    completedAt: result.completedAt,
    totalScore: result.totalScore,
    maxScore: result.maxScore,
    answers: result.answers,
    // Human-readable additions
    assessment: {
      title: fb.title,
      message: fb.message,
    },
    breakdown: questions.map((q, i) => {
      const chosen = q.options[result.answers[i]];
      return {
        questionNumber: i + 1,
        principle: q.principle,
        question: q.text,
        chosenAnswer: chosen.text,
        pointsEarned: chosen.score,
        pointsMax: 3,
      };
    }),
  };

  return JSON.stringify(enriched, null, 2);
}

/**
 * Parse and validate a JSON string back into a QuizResult.
 * Returns null if the payload is invalid, malformed, or incompatible.
 */
export function parseImportJSON(json: string): QuizResult | null {
  try {
    const parsed: unknown = JSON.parse(json);
    return isQuizResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Trigger a browser file-download for any text content. */
export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/plain;charset=utf-8',
): void {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

/** Copy text to clipboard. Returns true on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
