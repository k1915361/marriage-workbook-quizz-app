export interface Option {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  principle: string;
  text: string;
  options: Option[];
}

export interface ScoreFeedback {
  title: string;
  message: string;
}

export const questions: Question[] = [
  {
    id: 1,
    principle: "Principle 1: Establish a Shared Vision",
    text: "When facing a major life decision, how do you and your partner typically respond?",
    options: [
      { text: "We discuss it thoroughly and ensure our goals align before moving forward.", score: 3 },
      { text: "We talk about it, but often one person ultimately makes the final call.", score: 2 },
      { text: "We usually act independently or avoid discussing it until the last minute.", score: 1 },
      { text: "We frequently argue because we have entirely different visions for our future.", score: 0 }
    ]
  },
  {
    id: 2,
    principle: "Principle 2: Cultivate Constant Appreciation",
    text: "How often do you express genuine gratitude or appreciation to your spouse for the small things?",
    options: [
      { text: "Daily. We make it a habit to thank each other for everyday efforts.", score: 3 },
      { text: "A few times a week, usually when they do something out of the ordinary.", score: 2 },
      { text: "Rarely. We know we appreciate each other, so we don't feel the need to say it.", score: 1 },
      { text: "Almost never. I feel like my efforts are taken for granted.", score: 0 }
    ]
  },
  {
    id: 3,
    principle: "Principle 3: Constructive Conflict Resolution",
    text: "When a disagreement arises, what is the most common outcome?",
    options: [
      { text: "We listen to each other's perspectives and find a compromise we both accept.", score: 3 },
      { text: "We argue, take a break, and eventually smooth things over without fully resolving it.", score: 2 },
      { text: "One of us usually yields just to keep the peace, harboring some resentment.", score: 1 },
      { text: "It turns into a loud argument and is often left unresolved for days.", score: 0 }
    ]
  },
  {
    id: 4,
    principle: "Principle 4: Maintain the 'Pair' Connection",
    text: "How do you prioritize quality time as a couple amidst busy schedules?",
    options: [
      { text: "We have dedicated, uninterrupted 'us time' scheduled regularly (e.g., date nights).", score: 3 },
      { text: "We spend time together when we can, but it's often interrupted or unstructured.", score: 2 },
      { text: "Most of our time is spent managing kids, chores, or work; rarely just the two of us.", score: 1 },
      { text: "We live somewhat parallel lives and rarely spend quality time together.", score: 0 }
    ]
  },
  {
    id: 5,
    principle: "Principle 5: Grow Together as a Team",
    text: "Do you actively support each other's personal growth and individual goals?",
    options: [
      { text: "Absolutely, we are each other's biggest cheerleaders and actively help each other.", score: 3 },
      { text: "Yes, conceptually, but we don't always take active steps to support them.", score: 2 },
      { text: "We are mostly indifferent to each other's individual pursuits outside the marriage.", score: 1 },
      { text: "No, individual goals often feel like a threat to our time or resources.", score: 0 }
    ]
  }
];

export const getScoreFeedback = (totalScore: number): ScoreFeedback => {
  if (totalScore >= 13) {
    return {
      title: "Strong Foundation",
      message: "You have a solid understanding of the principles of a creation marriage. Keep nurturing your connection and shared vision!"
    };
  } else if (totalScore >= 8) {
    return {
      title: "Growing Together",
      message: "You are doing well, but there is room for improvement. Focus on cultivating constant appreciation and constructive conflict resolution."
    };
  } else {
    return {
      title: "Time to Reconnect",
      message: "Your relationship could benefit significantly from revisiting the 7 Principles. Consider dedicating more time to open communication and establishing a shared vision."
    };
  }
};
