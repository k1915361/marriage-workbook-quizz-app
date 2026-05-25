/**
 * ShuffleMap[questionIndex] is an array of data indices in display order.
 *
 * Example: ShuffleMap[0] = [2, 0, 3, 1] means the first question's options
 * are displayed as: data[2], data[0], data[3], data[1].
 *
 * Answers are always stored as data indices so that scores are stable across
 * sessions regardless of the runtime display order.
 */
export type ShuffleMap = number[][];

/** Fisher-Yates shuffle (mutates in place). */
function shuffleArray(arr: number[]): number[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/**
 * Generate a per-question random display ordering for `questionCount` questions,
 * each with `optionCount` options.
 *
 * Call once at quiz start and pass the result down to the UI. Do not persist
 * the map — stored answers use data indices that remain valid across reshuffles.
 */
export function generateShuffleMap(questionCount: number, optionCount = 4): ShuffleMap {
  return Array.from({ length: questionCount }, () =>
    shuffleArray(Array.from({ length: optionCount }, (_, i) => i)),
  );
}

/**
 * Given a ShuffleMap for one question, return the display position of a stored
 * data index. Returns -1 if the data index is not found (should never happen
 * with valid data).
 */
export function dataIndexToDisplayIndex(questionMap: number[], dataIndex: number): number {
  return questionMap.indexOf(dataIndex);
}
