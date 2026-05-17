import { Component, createSignal, Switch, Match } from 'solid-js';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { DevScreen } from './components/DevScreen';
import { questions } from './data/questions';
import { calculateScore, MAX_SCORE } from './utils/score';
import { QuizResult } from './types';

type Screen = 'welcome' | 'quiz' | 'results';

/** True when the URL contains ?dev=1 — works in any environment. */
const IS_DEV_MODE = new URLSearchParams(window.location.search).has('dev');

export const App: Component = () => {
  const [currentScreen, setCurrentScreen] = createSignal<Screen>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
  const [userAnswers, setUserAnswers] = createSignal<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [quizResult, setQuizResult] = createSignal<QuizResult | null>(null);

  // ── Quiz flow ────────────────────────────────────────────────────────────

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setCurrentScreen('quiz');
  };

  const handleSelectOption = (index: number) => {
    const next = [...userAnswers()];
    next[currentQuestionIndex()] = index;
    setUserAnswers(next);
  };

  const handleNext = () => {
    if (currentQuestionIndex() < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex() + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex() > 0) {
      setCurrentQuestionIndex(currentQuestionIndex() - 1);
    }
  };

  const finishQuiz = () => {
    const answers = userAnswers().map((a) => a ?? 0);
    setQuizResult({
      version: '1',
      answers,
      totalScore: calculateScore(userAnswers()),
      maxScore: MAX_SCORE,
      completedAt: new Date().toISOString(),
    });
    setCurrentScreen('results');
  };

  // ── Restore (from DevScreen or ResultsScreen paste) ───────────────────────

  const handleRestore = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentScreen('results');
  };

  const handleRestart = () => setCurrentScreen('welcome');

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Switch>
      {/* Dev / admin panel — only reachable via ?dev=1 */}
      <Match when={IS_DEV_MODE && currentScreen() === 'welcome'}>
        <DevScreen onJumpToResults={handleRestore} onStartQuiz={startQuiz} />
      </Match>

      <Match when={currentScreen() === 'welcome'}>
        <WelcomeScreen onStart={startQuiz} />
      </Match>

      <Match when={currentScreen() === 'quiz'}>
        <QuizScreen
          currentQuestionIndex={currentQuestionIndex()}
          userAnswers={userAnswers()}
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
