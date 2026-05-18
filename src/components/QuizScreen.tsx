import { Component, For } from 'solid-js';
import { questions } from '../data/questions';
import {
  PageShell,
  Card,
  OptionCard,
  OptionCardContent,
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
  onSelectOption: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const QuizScreen: Component<QuizScreenProps> = (props) => {
  const q = () => questions[props.currentQuestionIndex];
  const progressPercentage = () => {
    const answered = props.userAnswers.filter((a) => a !== null).length;
    return (answered / questions.length) * 100;
  };
  const isAnswered = () => props.userAnswers[props.currentQuestionIndex] !== null;
  const selectedIndex = () => props.userAnswers[props.currentQuestionIndex];
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
          value={selectedIndex() !== null ? selectedIndex()!.toString() : ''}
          onChange={(val) => {
            if (val !== '') props.onSelectOption(parseInt(val));
          }}
          class="quiz-screen__radio-group"
        >
          <For each={q().options}>
            {(option, index) => (
              <RadioOption
                value={index().toString()}
                selected={selectedIndex() === index()}
                label={option.text}
              />
            )}
          </For>
        </RadioGroup>

        <CardDivider class="quiz-screen__divider" />
        <div class="quiz-screen__buttons">
          <OptionCard
            layout="row"
            class="quiz-screen__button base-ui-button base-ui-button--secondary base-ui-button--default"
            disabled={props.currentQuestionIndex === 0}
            onClick={props.onPrev}
          >
            <OptionCardContent title="Previous" showArrow={false} />
          </OptionCard>
          <OptionCard
            layout="row"
            class="quiz-screen__button base-ui-button base-ui-button--primary base-ui-button--default"
            selected={isAnswered()}
            disabled={!isAnswered()}
            onClick={props.onNext}
          >
            <OptionCardContent
              title={isLast() ? 'Finish' : 'Next'}
              description={isAnswered() ? undefined : 'Select an answer to continue'}
              showArrow={false}
            />
          </OptionCard>
        </div>
      </Card>
    </PageShell>
  );
};
