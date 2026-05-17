import { Component, createSignal, Show } from 'solid-js';
import { Button } from '@kobalte/core/button';
import { QuizResult } from '../types';
import { calculateScore, MAX_SCORE } from '../utils/score';
import { parseImportJSON } from '../utils/export';

interface DevScreenProps {
  onJumpToResults: (result: QuizResult) => void;
  onStartQuiz: () => void;
}

// ── Preset scenarios ─────────────────────────────────────────────────────────
// option index 0 → score 3 (best), 1 → score 2, 2 → score 1 (see questions.ts)

const PRESETS: { label: string; emoji: string; tier: string; score: string; answers: number[] }[] = [
  {
    label: 'Perfect Score',
    emoji: '🏆',
    tier: 'Strong Foundation',
    score: '15 / 15',
    answers: [0, 0, 0, 0, 0],
  },
  {
    label: 'Mid Range',
    emoji: '📈',
    tier: 'Growing Together',
    score: '10 / 15',
    answers: [1, 1, 1, 1, 1],
  },
  {
    label: 'Low Score',
    emoji: '🌱',
    tier: 'Time to Reconnect',
    score: '5 / 15',
    answers: [2, 2, 2, 2, 2],
  },
];

function makeResult(answers: number[]): QuizResult {
  return {
    version: '1',
    answers,
    totalScore: calculateScore(answers),
    maxScore: MAX_SCORE,
    completedAt: new Date().toISOString(),
  };
}

export const DevScreen: Component<DevScreenProps> = (props) => {
  const [importText, setImportText] = createSignal('');
  const [importError, setImportError] = createSignal<string | null>(null);

  const handleImport = () => {
    const result = parseImportJSON(importText());
    if (!result) {
      setImportError('Invalid export code — paste an unmodified JSON export.');
      return;
    }
    setImportError(null);
    props.onJumpToResults(result);
  };

  return (
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-8 max-w-2xl w-full">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div class="mb-8">
          <p class="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">
            Dev / Admin
          </p>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Test Panel
          </h1>
          <p class="text-base text-slate-500 leading-relaxed">
            Jump straight to a results screen, or restore a previous session from
            a JSON export. Accessible at{' '}
            <code class="text-sm bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
              ?dev=1
            </code>
            .
          </p>
        </div>

        {/* ── Preset scenarios ────────────────────────────────────────────── */}
        <div class="mb-6">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Jump to Results — Presets
          </p>
          <div class="flex flex-col gap-3">
            {PRESETS.map((preset) => (
              <button
                class="group relative p-4 rounded-xl border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 hover:ring-1 hover:ring-blue-600 bg-white transition-all duration-200 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 flex items-center gap-4 text-left"
                onClick={() => props.onJumpToResults(makeResult(preset.answers))}
              >
                <span class="text-2xl">{preset.emoji}</span>
                <div class="flex-1 min-w-0">
                  <span class="block text-base font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {preset.label}
                  </span>
                  <span class="block text-sm text-slate-400 mt-0.5">
                    {preset.score} — {preset.tier}
                  </span>
                </div>
                <span class="text-slate-300 group-hover:text-blue-400 transition-colors text-lg">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div class="border-t border-slate-100 my-6" />

        {/* ── JSON restore ────────────────────────────────────────────────── */}
        <div class="mb-8">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Restore from JSON Export
          </p>
          <textarea
            id="dev-import-json"
            placeholder={'Paste exported JSON here...\n{\n  "version": "1",\n  "answers": [...],\n  ...\n}'}
            class="w-full h-32 bg-slate-50 text-slate-700 font-mono text-xs rounded-xl p-3 ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none placeholder-slate-400 transition-all leading-relaxed"
            value={importText()}
            onInput={(e) => { setImportText(e.currentTarget.value); setImportError(null); }}
          />
          <Show when={importError()}>
            <p class="text-red-500 text-sm mt-1.5">{importError()}</p>
          </Show>
          <Button
            class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 active:scale-95 disabled:active:scale-100"
            disabled={!importText().trim()}
            onClick={handleImport}
          >
            Restore Session
          </Button>
        </div>

        {/* ── Footer nav ──────────────────────────────────────────────────── */}
        <div class="flex justify-between pt-6 border-t border-slate-100">
          <Button
            class="bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 active:scale-95"
            onClick={props.onStartQuiz}
          >
            Start Quiz
          </Button>
          <a
            href="/"
            class="bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-medium transition-colors focus:outline-none inline-flex items-center"
          >
            ← Back to App
          </a>
        </div>

      </div>
    </div>
  );
};
