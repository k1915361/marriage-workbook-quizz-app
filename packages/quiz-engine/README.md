# @marriage-workbook/quiz-engine

Framework-agnostic engine for the *7 Principles of Creation Marriage Enrichment* quiz. Provides types, runtime shuffle, score calculation, and export utilities.

## Features

- **`ShuffleMap` + `generateShuffleMap`** — per-session Fisher-Yates shuffle so answer options appear in a different order each time
- **`calculateScore`** — sum scores from stored *data indices* (shuffle-transparent)
- **`formatResultAsText`** / **`exportResultAsJSON`** — human-readable and JSON exports
- **`parseImportJSON`** — validated round-trip restore
- **`QuizResult` / `isQuizResult`** — canonical result type + runtime guard

## Install

```bash
pnpm add @marriage-workbook/quiz-engine @marriage-workbook/quiz-data
```

## Usage

```typescript
import {
  generateShuffleMap,
  dataIndexToDisplayIndex,
  calculateScore,
  exportResultAsJSON,
} from '@marriage-workbook/quiz-engine';
import { questions } from '@marriage-workbook/quiz-data';

// 1. Generate a fresh shuffle at quiz start
const shuffleMap = generateShuffleMap(questions.length);

// 2. For question i, render options in shuffled order
const displayOrder = shuffleMap[i]; // e.g. [2, 0, 3, 1]
const displayOptions = displayOrder.map(dataIdx => questions[i].options[dataIdx]);

// 3. User picks display position d — store the DATA index
const dataIndex = shuffleMap[i][d];

// 4. Calculate score from data indices (shuffle-transparent)
const score = calculateScore(answers);
```

## Why data indices?

Answers are stored as indices into the original `questions[n].options` array, not display positions. This means:
- Scores are stable and reproducible regardless of display order
- Exported JSON can be restored without knowing the original shuffle
- `calculateScore` needs no shuffle context
