import { Component, createSignal, Switch, Match } from 'solid-js';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { DevScreen } from './components/DevScreen';
import { questions } from './data/questions';
import { calculateScore, MAX_SCORE } from './utils/score';
import { QuizResult } from './types';
import { generateShuffleMap } from '@marriage-workbook/quiz-engine';
import type { ShuffleMap } from '@marriage-workbook/quiz-engine';

type Screen = 'welcome' | 'quiz' | 'results';

const IS_DEV_MODE = new URLSearchParams(window.location.search).has('dev');
const STORAGE_KEY = 'quiz-progress';

interface SavedProgress {
  answers: (number | null)[];
  currentQuestion: number;
  participantName: string;
}

function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedProgress) : null;
  } catch {
    return null;
  }
}

function saveProgress(data: SavedProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export const App: Component = () => {
  const saved = loadProgress();

  const [currentScreen, setCurrentScreen] = createSignal<Screen>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [userAnswers, setUserAnswers] = createSignal<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [quizResult, setQuizResult] = createSignal<QuizResult | null>(null);
  const [participantName, setParticipantName] = createSignal('');
  const [hasSavedProgress, setHasSavedProgress] = createSignal(saved !== null);
  // Per-session shuffle: options appear in a different order each quiz attempt.
  // Answers are stored as data indices so scores are shuffle-independent.
  const [shuffleMap, setShuffleMap] = createSignal<ShuffleMap>(
    generateShuffleMap(questions.length),
  );

  // ── Quiz flow ────────────────────────────────────────────────────────────

  const startQuiz = (name: string) => {
    clearProgress();
    setParticipantName(name);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setShuffleMap(generateShuffleMap(questions.length));
    setCurrentScreen('quiz');
  };

  const resumeQuiz = () => {
    const progress = loadProgress();
    if (!progress) return;
    setParticipantName(progress.participantName);
    setUserAnswers(progress.answers);
    setCurrentQuestionIndex(progress.currentQuestion);
    // Generate a new shuffle for the resumed session — stored data indices are
    // still valid and the previously selected answer will show as selected.
    setShuffleMap(generateShuffleMap(questions.length));
    setCurrentScreen('quiz');
  };

  const persistProgress = (answers: (number | null)[], questionIndex: number) => {
    saveProgress({ answers, currentQuestion: questionIndex, participantName: participantName() });
  };

  // displayIndex is the position the user tapped in the shuffled list.
  // Convert to a data index before storing so scores remain stable.
  const handleSelectOption = (displayIndex: number) => {
    const dataIndex = shuffleMap()[currentQuestionIndex()][displayIndex];
    const next = [...userAnswers()];
    next[currentQuestionIndex()] = dataIndex;
    setUserAnswers(next);
    persistProgress(next, currentQuestionIndex());
  };

  const handleNext = () => {
    if (currentQuestionIndex() < questions.length - 1) {
      const next = currentQuestionIndex() + 1;
      setCurrentQuestionIndex(next);
      persistProgress(userAnswers(), next);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex() > 0) {
      const prev = currentQuestionIndex() - 1;
      setCurrentQuestionIndex(prev);
      persistProgress(userAnswers(), prev);
    }
  };

  const finishQuiz = () => {
    clearProgress();
    setHasSavedProgress(false);
    const answers = userAnswers().map((a) => a ?? 0);
    setQuizResult({
      version: '1',
      participantName: participantName() || undefined,
      answers,
      totalScore: calculateScore(userAnswers()),
      maxScore: MAX_SCORE,
      completedAt: new Date().toISOString(),
    });
    setCurrentScreen('results');
  };

  // ── Restore ───────────────────────────────────────────────────────────────

  const handleRestore = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentScreen('results');
  };

  const handleRestart = () => {
    clearProgress();
    setHasSavedProgress(false);
    setCurrentScreen('welcome');
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Switch>
      <Match when={IS_DEV_MODE && currentScreen() === 'welcome'}>
        <DevScreen onJumpToResults={handleRestore} onStartQuiz={() => startQuiz('')} />
      </Match>

      <Match when={currentScreen() === 'welcome'}>
        <WelcomeScreen
          hasSavedProgress={hasSavedProgress()}
          onStart={startQuiz}
          onResume={resumeQuiz}
        />
      </Match>

      <Match when={currentScreen() === 'quiz'}>
        <QuizScreen
          currentQuestionIndex={currentQuestionIndex()}
          userAnswers={userAnswers()}
          shuffleMap={shuffleMap()}
          onSelectOption={handleSelectOption}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </Match>

      <Match when={currentScreen() === 'results'}>
        <ResultsScreen
          result={quizResult()!}
          onRestart={handleRestart}
          onRestore={handleRestore}
        />
      </Match>
    </Switch>
  );
};
