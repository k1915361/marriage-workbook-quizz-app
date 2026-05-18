import { Component } from 'solid-js';
import { questions } from '../data/questions';
import { PageShell, Card, Eyebrow, PageTitle, OptionCard, OptionCardContent, BodyText } from './ui';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: Component<WelcomeScreenProps> = (props) => {
  return (
    <PageShell maxWidth="lg">
      <Card textCenter>
        <Eyebrow class="welcome-screen__eyebrow">Marriage Enrichment</Eyebrow>
        <PageTitle class="welcome-screen__title">Marriage Enrichment Quiz</PageTitle>
        <BodyText variant="lead" class="welcome-screen__lead">
          Based on "The 7 Principles of Creation" by Stephen Stacey
        </BodyText>
        <BodyText class="welcome-screen__description">
          Discover the strengths of your relationship and identify areas for growth with this brief
          assessment.
        </BodyText>
        <OptionCard layout="row" class="welcome-screen__button base-ui-button base-ui-button--primary base-ui-button--default" onClick={props.onStart}>
          <OptionCardContent title="Start Quiz" description={`${questions.length} questions`} />
        </OptionCard>
      </Card>
    </PageShell>
  );
};
