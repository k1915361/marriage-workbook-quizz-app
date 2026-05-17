import { Component, createSignal, For, Show } from 'solid-js';
import { Button } from '@kobalte/core/button';
import { questions, getScoreFeedback } from '../data/questions';
import {
  formatResultAsText,
  exportResultAsJSON,
  downloadTextFile,
  copyToClipboard,
  parseImportJSON,
} from '../utils/export';
import { QuizResult } from '../types';

interface ResultsScreenProps {
  result: QuizResult;
  onRestart: () => void;
  onRestore: (result: QuizResult) => void;
}

export const ResultsScreen: Component<ResultsScreenProps> = (props) => {
  const feedback = () => getScoreFeedback(props.result.totalScore);

  // ── Export state ──────────────────────────────────────────────────────────
  const [copyLabel, setCopyLabel] = createSignal('Copy Text');
  const [importText, setImportText] = createSignal('');
  const [importError, setImportError] = createSignal<string | null>(null);
  const [importSuccess, setImportSuccess] = createSignal(false);

  const handleCopyText = async () => {
    const text = formatResultAsText(props.result);
    const ok = await copyToClipboard(text);
    setCopyLabel(ok ? 'Copied ✓' : 'Copy failed');
    setTimeout(() => setCopyLabel('Copy Text'), 2500);
  };

  const handleDownloadJSON = () => {
    const json = exportResultAsJSON(props.result);
    const ts = new Date(props.result.completedAt).toISOString().slice(0, 10);
    downloadTextFile(`quiz-result-${ts}.json`, json, 'application/json');
  };

  const handlePrint = () => window.print();

  const handleRestore = () => {
    const result = parseImportJSON(importText());
    if (!result) {
      setImportError('Invalid export code. Paste an unmodified JSON export.');
      setImportSuccess(false);
      return;
    }
    setImportError(null);
    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
      props.onRestore(result);
    }, 600);
  };

  // ── Score colour ──────────────────────────────────────────────────────────
  const scoreColour = () => {
    const pct = props.result.totalScore / props.result.maxScore;
    if (pct >= 0.87) return 'text-emerald-600';
    if (pct >= 0.53) return 'text-blue-600';
    return 'text-amber-600';
  };

  return (
    <div class="min-h-screen bg-slate-50 p-4 print:p-0 print:bg-white">
      <div class="max-w-2xl mx-auto py-8 space-y-6">

        {/* ── Score card ──────────────────────────────────────────────── */}
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-8 text-center print:shadow-none print:ring-0">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Quiz Completed
          </p>

          <div class="inline-flex items-baseline gap-1 mb-4">
            <span class={`text-7xl font-bold tabular-nums ${scoreColour()}`}>
              {props.result.totalScore}
            </span>
            <span class="text-3xl text-slate-300 font-medium">
              / {props.result.maxScore}
            </span>
          </div>

          <h2 class="text-2xl font-bold text-slate-900 mb-2">{feedback().title}</h2>
          <p class="text-slate-600 leading-relaxed max-w-md mx-auto">{feedback().message}</p>

          {/* Export buttons — hidden when printing */}
          <div class="flex flex-wrap justify-center gap-2 mt-8 print:hidden">
            <button
              id="btn-copy-text"
              onClick={handleCopyText}
              class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              📋 {copyLabel()}
            </button>
            <button
              id="btn-download-json"
              onClick={handleDownloadJSON}
              class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              ⬇ Download JSON
            </button>
            <button
              id="btn-print"
              onClick={handlePrint}
              class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              🖨 Print
            </button>
          </div>
        </div>

        {/* ── Per-question breakdown ──────────────────────────────────── */}
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 overflow-hidden print:shadow-none print:ring-0">
          <div class="px-6 py-4 border-b border-slate-100">
            <h3 class="font-semibold text-slate-900">Answer Breakdown</h3>
          </div>
          <ul class="divide-y divide-slate-100">
            <For each={questions}>
              {(q, i) => {
                const answerIndex = props.result.answers[i()];
                const chosen = q.options[answerIndex];
                const pct = chosen.score / 3;
                const barColour = pct >= 1 ? 'bg-emerald-500' : pct >= 0.5 ? 'bg-blue-500' : 'bg-amber-500';
                return (
                  <li class="px-6 py-4">
                    <div class="flex items-start justify-between gap-4 mb-2">
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                          Q{i() + 1} · {q.principle}
                        </p>
                        <p class="text-sm text-slate-700 font-medium">{chosen.text}</p>
                      </div>
                      <span class={`shrink-0 text-sm font-bold tabular-nums ${pct >= 1 ? 'text-emerald-600' : pct >= 0.5 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {chosen.score}/3
                      </span>
                    </div>
                    <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        class={`h-full rounded-full ${barColour} transition-all duration-500`}
                        style={{ width: `${(chosen.score / 3) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>

        {/* ── Restore / import section — hidden when printing ─────────── */}
        <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-6 print:hidden">
          <h3 class="font-semibold text-slate-900 mb-1">Restore a Previous Session</h3>
          <p class="text-sm text-slate-500 mb-3">
            Paste a previously downloaded JSON export to reload those results.
          </p>
          <textarea
            id="restore-json-input"
            placeholder='{ "version": "1", "answers": [...], ... }'
            class="w-full h-28 bg-slate-50 text-slate-700 font-mono text-xs rounded-xl p-3 ring-1 ring-slate-200 focus:ring-blue-500 focus:outline-none resize-none placeholder-slate-400 transition-all"
            value={importText()}
            onInput={(e) => { setImportText(e.currentTarget.value); setImportError(null); }}
          />
          <Show when={importError()}>
            <p class="text-red-500 text-xs mt-1.5">{importError()}</p>
          </Show>
          <Show when={importSuccess()}>
            <p class="text-emerald-600 text-xs mt-1.5">Restored ✓ Loading…</p>
          </Show>
          <Button
            id="btn-restore"
            class="mt-3 w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20"
            disabled={!importText().trim()}
            onClick={handleRestore}
          >
            Restore Session
          </Button>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div class="flex justify-center print:hidden">
          <Button
            id="btn-retake"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 active:scale-95"
            onClick={props.onRestart}
          >
            Retake Quiz
          </Button>
        </div>

      </div>
    </div>
  );
};
