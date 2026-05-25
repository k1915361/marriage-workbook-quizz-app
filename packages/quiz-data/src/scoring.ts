import { questions } from './questions';

export const MAX_SCORE = questions.length * 3;

export function getScoreFeedback(totalScore: number): { title: string; message: string } {
  if (totalScore >= 36) {
    return {
      title: "Strong Foundation",
      message: "You have a strong, well-rounded partnership. You share a vision, appreciate each other, navigate differences with respect, and invest in your growth as a couple. Keep nurturing this foundation — it is the ground from which a truly flourishing family grows.",
    };
  } else if (totalScore >= 22) {
    return {
      title: "Growing Together",
      message: "You have real strengths as a couple and a genuine desire to build something meaningful together. Some areas could use more intentional attention — perhaps aligning on values, creating dedicated time for each other, or improving how you handle conflict. The awareness you already have is a great starting point.",
    };
  } else {
    return {
      title: "Time to Reconnect",
      message: "Your relationship has room for significant growth, and recognising that is the first and most courageous step. Consider choosing one or two areas from The 7 Principles of Creation Workbook to work through together. Seeking support from a mentor couple, counsellor, or trusted friend can also make a real difference.",
    };
  }
}
