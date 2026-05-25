import { Component, For } from 'solid-js';
import { questions } from '../data/questions';
import type { ShuffleMap } from '@marriage-workbook/quiz-engine';
import { dataIndexToDisplayIndex } from '@marriage-workbook/quiz-engine';
import {
  PageShell,
  Card,
  Button,
  SectionLabel,
  Eyebrow,
  PageTitle,
  CardDivider,
  RadioOption,
  Progress,
  RadioGroup,
} from './ui';

interface QuizScreenProps {
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  shuffleMap: ShuffleMap;
  onSelectOption: (displayIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const QuizScreen: Component<QuizScreenProps> = (props) => {
  const q = () => questions[props.currentQuestionIndex];

  // Options displayed in shuffled order for this session.
  const displayOrder = () => props.shuffleMap[props.currentQuestionIndex] ?? [0, 1, 2, 3];
  const displayOptions = () => displayOrder().map((dataIdx) => q().options[dataIdx]);

  // Convert the stored data index back to the current display position for
  // RadioGroup's controlled value.
  const selectedDisplayIndex = () => {
    const dataIdx = props.userAnswers[props.currentQuestionIndex];
    if (dataIdx === null || dataIdx === undefined) return null;
    return dataIndexToDisplayIndex(displayOrder(), dataIdx);
  };

  const progressPercentage = () => {
    const answered = props.userAnswers.filter((a) => a !== null).length;
    return (answered / questions.length) * 100;
  };

  const isAnswered = () => props.userAnswers[props.currentQuestionIndex] !== null;
  const isLast = () => props.currentQuestionIndex === questions.length - 1;

  return (
    <PageShell maxWidth="2xl">
      <Card>
        <div class="quiz-screen__progress">
          <SectionLabel class="quiz-screen__section-label">
            Question {props.currentQuestionIndex + 1} of {questions.length}
          </SectionLabel>
          <Progress value={progressPercentage()} minValue={0} maxValue={100}>
            <Progress.Track>
              <Progress.Fill />
            </Progress.Track>
          </Progress>
        </div>

        <Eyebrow>{q().principle}</Eyebrow>
        <PageTitle as="h3" size="question" class="quiz-screen__title">
          {q().text}
        </PageTitle>

        <RadioGroup
          value={selectedDisplayIndex() !== null ? selectedDisplayIndex()!.toString() : ''}
          onChange={(val) => {
            if (val !== '') props.onSelectOption(parseInt(val));
          }}
          class="quiz-screen__radio-group"
        >
          <For each={displayOptions()}>
            {(option, displayIdx) => (
              <RadioOption
                value={displayIdx().toString()}
                selected={selectedDisplayIndex() === displayIdx()}
                label={option.text}
              />
            )}
          </For>
        </RadioGroup>

        <CardDivider class="quiz-screen__divider" />
        <div class="quiz-screen__buttons">
          <Button
            variant="secondary"
            fullWidth
            disabled={props.currentQuestionIndex === 0}
            onClick={props.onPrev}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            fullWidth
            disabled={!isAnswered()}
            onClick={props.onNext}
          >
            {isLast() ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </PageShell>
  );
};
