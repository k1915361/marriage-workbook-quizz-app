# @marriage-workbook/quiz-data

Question bank and scoring definitions for the *7 Principles of Creation Marriage Enrichment* quiz, based on the workbook by Stephen Stacey.

## Contents

- **14 questions** covering all 7 principles of creation as applied to marriage
- **Zod schema** validation (throws at module load if data is malformed)
- **Score feedback** tiers with thresholds proportional to the 42-point maximum

## Principles covered

| Questions | Principle |
|-----------|-----------|
| 1–2 | Principle 1: Clarity of the End Goal |
| 3–4 | Principle 2: Diverse Contributions |
| 5–8 | Principle 3: Dialogue to Generate Energy |
| 9–11 | Principle 4: Love and Beauty |
| 12 | Principle 5: Respect |
| 13 | Principle 6: Personal Growth |
| 14 | Principle 7: Feedback and Vitality |

## Usage

```typescript
import { questions, getScoreFeedback, MAX_SCORE } from '@marriage-workbook/quiz-data';

console.log(questions.length); // 14
console.log(MAX_SCORE);        // 42

const feedback = getScoreFeedback(38);
console.log(feedback.title);   // "Strong Foundation"
```

## Option scoring

Each question has 4 options scored 0–3. The options are intentionally ordered so the best answer (score 3) appears at a different position in each question, preventing pattern-based guessing.

## License

This package is MIT licensed. The underlying workbook content is published under the terms described in the workbook itself (freely shareable except for the 7 Principles of Creation model, which must be ascribed to Stephen Stacey, © 2006).
