import { Component } from 'solid-js';
import { questions } from '../data/questions';
import { PageShell, Card, Eyebrow, PageTitle, Button, BodyText } from './ui';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: Component<WelcomeScreenProps> = (props) => {
  return (
    <PageShell maxWidth="lg">
      <Card textCenter>
        <Eyebrow>Marriage Enrichment</Eyebrow>
        <PageTitle>Marriage Enrichment Quiz</PageTitle>
        <BodyText variant="lead">Based on "The 7 Principles of Creation" by Stephen Stacey</BodyText>
        <BodyText>
          Discover the strengths of your relationship and identify areas for growth with this brief
          assessment.
        </BodyText>
        <Button variant="primary" size="lg" fullWidth onClick={props.onStart}>
          Start Quiz · {questions.length} questions
        </Button>
      </Card>
    </PageShell>
  );
};
