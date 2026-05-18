import { Component, createSignal, For, Show } from 'solid-js';
import { Form } from '@msviderok/base-ui-solid/form';
import { QuizResult } from '../types';
import { calculateScore, MAX_SCORE } from '../utils/score';
import { parseImportJSON } from '../utils/export';
import {
  PageShell,
  Card,
  Textarea,
  SectionLabel,
  Eyebrow,
  PageTitle,
  CardDivider,
  OptionCard,
  OptionCardContent,
  LinkButton,
  BodyText,
  InlineCode,
  FormMessage,
} from './ui';

interface DevScreenProps {
  onJumpToResults: (result: QuizResult) => void;
  onStartQuiz: () => void;
}

const PRESETS: { label: string; tier: string; score: string; answers: number[] }[] = [
  {
    label: 'Perfect Score',
    tier: 'Strong Foundation',
    score: '15 / 15',
    answers: [0, 0, 0, 0, 0],
  },
  {
    label: 'Mid Range',
    tier: 'Growing Together',
    score: '10 / 15',
    answers: [1, 1, 1, 1, 1],
  },
  {
    label: 'Low Score',
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
      setImportError('Invalid export code - paste an unmodified JSON export.');
      return;
    }
    setImportError(null);
    props.onJumpToResults(result);
  };

  return (
    <PageShell maxWidth="2xl">
      <Card>
        <Eyebrow>Dev / Admin</Eyebrow>
        <PageTitle class="dev-screen__title">Test Panel</PageTitle>
        <BodyText class="dev-screen__description">
          Jump straight to a results screen, or restore a previous session from a JSON export.
          Accessible at <InlineCode>?dev=1</InlineCode>.
        </BodyText>

        <SectionLabel class="dev-screen__section-label">Jump to Results - Presets</SectionLabel>
        <div class="dev-screen__presets">
          <For each={PRESETS}>
            {(preset) => (
              <OptionCard
                layout="row"
                class="dev-screen__preset"
                onClick={() => props.onJumpToResults(makeResult(preset.answers))}
              >
                <OptionCardContent
                  title={preset.label}
                  description={`${preset.score} - ${preset.tier}`}
                />
              </OptionCard>
            )}
          </For>
        </div>

        <CardDivider />

        <SectionLabel class="dev-screen__section-label">Restore from JSON Export</SectionLabel>
        <Form
          class="dev-screen__restore-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleImport();
          }}
        >
          <Textarea
            id="dev-import-json"
            placeholder={'Paste exported JSON here...\n{\n  "version": "1",\n  "answers": [...],\n  ...\n}'}
            rows={8}
            value={importText()}
            onInput={(e) => {
              setImportText(e.currentTarget.value);
              setImportError(null);
            }}
          />
          <Show when={importError()}>
            <FormMessage variant="error">{importError()}</FormMessage>
          </Show>
          <OptionCard
            layout="row"
            class="dev-screen__restore"
            disabled={!importText().trim()}
            type="submit"
          >
            <OptionCardContent title="Restore Session" showArrow={false} />
          </OptionCard>
        </Form>

        <CardDivider class="dev-screen__divider" />
        <div class="dev-screen__actions">
          <OptionCard layout="row" class="dev-screen__action" onClick={props.onStartQuiz}>
            <OptionCardContent title="Start Quiz" description="Begin from question 1" />
          </OptionCard>
          <LinkButton href="/" class="dev-screen__link">
            Back to App
          </LinkButton>
        </div>
      </Card>
    </PageShell>
  );
};
