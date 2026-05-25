import type { QuizResult } from '@marriage-workbook/quiz-engine';
import {
  getExportFilename,
  formatResultAsText,
  exportResultAsJSON,
  parseImportJSON,
} from '@marriage-workbook/quiz-engine';

export { getExportFilename, formatResultAsText, exportResultAsJSON, parseImportJSON };

/** Trigger a browser file-download for any text content. */
export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = 'text/plain;charset=utf-8',
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
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

/**
 * Open the user's default email client with the quiz results pre-filled.
 * Uses a mailto: link — no backend or API key required.
 */
export function openEmailWithResults(result: QuizResult): void {
  const name = result.participantName ? ` — ${result.participantName}` : '';
  const subject = encodeURIComponent(`Marriage Enrichment Quiz Results${name}`);
  const body = encodeURIComponent(formatResultAsText(result));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

/** Download quiz results as a JSON file. */
export function downloadResultsAsJSON(result: QuizResult): void {
  const json = exportResultAsJSON(result);
  downloadTextFile(getExportFilename(result, 'json'), json, 'application/json');
}
