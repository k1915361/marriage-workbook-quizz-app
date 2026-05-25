import { Component, createSignal, For, Show } from 'solid-js';
import { questions, getScoreFeedback } from '../data/questions';
import { Form } from '@msviderok/base-ui-solid/form';
import {
  formatResultAsText,
  copyToClipboard,
  parseImportJSON,
  openEmailWithResults,
  downloadResultsAsJSON,
} from '../utils/export';
import { QuizResult } from '../types';
import {
  PageShell,
  Card,
  Textarea,
  SectionLabel,
  CardHeader,
  PageTitle,
  BodyText,
  OptionCard,
  OptionCardContent,
  FormMessage,
} from './ui';

interface ResultsScreenProps {
  result: QuizResult;
  onRestart: () => void;
  onRestore: (result: QuizResult) => void;
}

export const ResultsScreen: Component<ResultsScreenProps> = (props) => {
  const feedback = () => getScoreFeedback(props.result.totalScore);
  const [copyLabel, setCopyLabel] = createSignal('Copy Text');
  const [importText, setImportText] = createSignal('');
  const [importError, setImportError] = createSignal<string | null>(null);
  const [importSuccess, setImportSuccess] = createSignal(false);

  const handleCopyText = async () => {
    const text = formatResultAsText(props.result);
    const ok = await copyToClipboard(text);
    setCopyLabel(ok ? 'Copied' : 'Copy failed');
    setTimeout(() => setCopyLabel('Copy Text'), 2500);
  };

  const handleDownloadJSON = () => downloadResultsAsJSON(props.result);

  const handleEmail = () => openEmailWithResults(props.result);

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

  const scoreColour = () => {
    const pct = props.result.totalScore / props.result.maxScore;
    if (pct >= 0.87) return 'text-success';
    if (pct >= 0.53) return 'text-primary';
    return 'text-warning';
  };

  const barColour = (pct: number) =>
    pct >= 1 ? 'bg-success-bg' : pct >= 0.5 ? 'bg-primary' : 'bg-warning-bg';

  const scoreTextColour = (pct: number) =>
    pct >= 1 ? 'text-success' : pct >= 0.5 ? 'text-primary' : 'text-warning';

  return (
    <PageShell centered={false} maxWidth="2xl" class="results-screen">
      <div class="results-screen__container">
        <Card textCenter class="results-screen__card">
          <SectionLabel class="results-screen__section-label">Quiz Completed</SectionLabel>
          <div class="results-screen__score">
            <span class={`results-screen__score-number ${scoreColour()}`}>
              {props.result.totalScore}
            </span>
            <span class="results-screen__score-max">/ {props.result.maxScore}</span>
          </div>
          <PageTitle as="h2" size="question" class="results-screen__feedback-title">
            {feedback().title}
          </PageTitle>
          <BodyText class="results-screen__feedback-text">{feedback().message}</BodyText>
          <div class="results-screen__actions">
            <OptionCard layout="compact" onClick={handleCopyText}>
              <OptionCardContent title={copyLabel()} showArrow={false} />
            </OptionCard>
            <OptionCard layout="compact" onClick={handleDownloadJSON}>
              <OptionCardContent title="Download JSON" showArrow={false} />
            </OptionCard>
            <OptionCard layout="compact" onClick={handleEmail}>
              <OptionCardContent title="Email Results" showArrow={false} />
            </OptionCard>
            <OptionCard layout="compact" onClick={handlePrint}>
              <OptionCardContent title="Print" showArrow={false} />
            </OptionCard>
          </div>
        </Card>

        <Card padding="none" class="results-screen__breakdown-card">
          <div class="results-screen__breakdown-header">
            <CardHeader title="Answer Breakdown" class="results-screen__breakdown-header-content" />
          </div>
          <ul class="results-screen__breakdown-list">
            <For each={questions}>
              {(q, index) => {
                const answerIndex = () => props.result.answers[index()];
                const chosen = () => q.options[answerIndex()];
                const pct = () => chosen().score / 3;
                return (
                  <li class="results-screen__breakdown-item">
                    <div class="results-screen__breakdown-item-header">
                      <div class="results-screen__breakdown-item-content">
                        <p class="results-screen__breakdown-item-label">
                          Q{index() + 1} - {q.principle}
                        </p>
                        <p class="results-screen__breakdown-item-text">{chosen().text}</p>
                      </div>
                      <span
                        class={`results-screen__breakdown-item-score ${scoreTextColour(pct())}`}
                      >
                        {chosen().score}/3
                      </span>
                    </div>
                    <div class="results-screen__progress-bar">
                      <div
                        class={`results-screen__progress-fill ${barColour(pct())}`}
                        style={{ width: `${(chosen().score / 3) * 100}%` }}
                      />
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </Card>

        <Card padding="sm" class="results-screen__restore-card">
          <CardHeader
            title="Restore a Previous Session"
            description="Paste a previously downloaded JSON export to reload those results."
          />
          <Form
            class="results-screen__restore-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleRestore();
            }}
          >
            <Textarea
              id="restore-json-input"
              placeholder='{ "version": "1", "answers": [...], ... }'
              rows={7}
              value={importText()}
              onInput={(e) => {
                setImportText(e.currentTarget.value);
                setImportError(null);
              }}
            />
            <Show when={importError()}>
              <FormMessage variant="error">{importError()}</FormMessage>
            </Show>
            <Show when={importSuccess()}>
              <FormMessage variant="success">Restored. Loading...</FormMessage>
            </Show>
            <OptionCard
              layout="row"
              class="results-screen__restore-button base-ui-button base-ui-button--secondary base-ui-button--default"
              disabled={!importText().trim()}
              type="submit"
            >
              <OptionCardContent title="Restore Session" showArrow={false} />
            </OptionCard>
          </Form>
        </Card>

        <OptionCard
          layout="row"
          class="results-screen__restart-button base-ui-button base-ui-button--primary base-ui-button--default"
          onClick={props.onRestart}
        >
          <OptionCardContent title="Retake Quiz" description="Start a new assessment" />
        </OptionCard>
      </div>
    </PageShell>
  );
};
