import { questions, getScoreFeedback } from '@marriage-workbook/quiz-data';
import { QuizResult, EnrichedExport, isQuizResult } from './types';

const DIVIDER = '─'.repeat(52);
const THICK = '━'.repeat(52);

function safeName(result: QuizResult): string {
  return result.participantName?.trim().replace(/\s+/g, '_').replace(/[^\w-]/g, '') || 'anonymous';
}

export function getExportFilename(result: QuizResult, ext = 'json'): string {
  const dt = new Date(result.completedAt)
    .toISOString()
    .slice(0, 16)
    .replace('T', '-')
    .replace(':', '-');
  return `${safeName(result)}-${dt}.${ext}`;
}

export function formatResultAsText(result: QuizResult): string {
  const fb = getScoreFeedback(result.totalScore);
  const dateStr = new Date(result.completedAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [
    'Marriage Enrichment Quiz — Results',
    '"The 7 Principles of Creation Marriage Enrichment Workbook"',
    'by Stephen Stacey',
    '',
    THICK,
    '',
    ...(result.participantName ? [`Participant: ${result.participantName}`, ''] : []),
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

export function exportResultAsJSON(result: QuizResult): string {
  const fb = getScoreFeedback(result.totalScore);

  const enriched: EnrichedExport = {
    version: result.version,
    completedAt: result.completedAt,
    totalScore: result.totalScore,
    maxScore: result.maxScore,
    answers: result.answers,
    ...(result.participantName !== undefined && { participantName: result.participantName }),
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

export function parseImportJSON(json: string): QuizResult | null {
  try {
    const parsed: unknown = JSON.parse(json);
    return isQuizResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
