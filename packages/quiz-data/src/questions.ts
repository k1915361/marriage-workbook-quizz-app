import { z } from 'zod';

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

const optionSchema = z.object({
  text: z.string().min(1),
  score: z.number().int().min(0).max(3),
});

const questionSchema = z.object({
  id: z.number().int().positive(),
  principle: z.string().min(1),
  text: z.string().min(1),
  options: z.array(optionSchema).length(4),
});

export const questionsSchema = z.array(questionSchema).min(1);

// Score-3 positions across questions: 2,0,1,3,0,1,2,3,0,1,2,3,0,1
// No two consecutive questions share the same best-answer position.

export const questions: Question[] = [
  {
    id: 1,
    principle: "Principle 1: Clarity of the End Goal",
    text: "When you imagine your family five years from now, how well do you and your partner agree on that picture?",
    options: [
      { text: "We've talked about the future, but our pictures don't quite match up.", score: 1 },
      { text: "We've never really discussed it — our days are too full to look that far ahead.", score: 0 },
      { text: "We've deliberately discussed and written down a shared vision that guides our decisions.", score: 3 },
      { text: "We generally point in the same direction, though we haven't formalised it.", score: 2 },
    ],
  },
  {
    id: 2,
    principle: "Principle 1: Clarity of the End Goal",
    text: "How openly do you and your partner discuss the values you want your household to live by?",
    options: [
      { text: "We've named our core values together and use them to guide important decisions.", score: 3 },
      { text: "We sometimes bring up values, but they get lost in daily pressures.", score: 1 },
      { text: "Values rarely come up — we each go by our own unspoken rules.", score: 0 },
      { text: "We talk about values occasionally and have reasonable alignment.", score: 2 },
    ],
  },
  {
    id: 3,
    principle: "Principle 2: Diverse Contributions",
    text: "When you and your partner react very differently to the same situation, what is your most common response?",
    options: [
      { text: "We recognise the difference but sometimes struggle to bridge it.", score: 2 },
      { text: "We've learned to appreciate that our different reactions often complement each other.", score: 3 },
      { text: "It usually sparks conflict — I find their reaction hard to understand.", score: 0 },
      { text: "We tend to dismiss the other person's reaction as simply wrong or oversensitive.", score: 1 },
    ],
  },
  {
    id: 4,
    principle: "Principle 2: Diverse Contributions",
    text: "If you and your partner carry different cultural backgrounds or upbringings, how do you navigate those differences?",
    options: [
      { text: "We each defend our own way; our backgrounds feel more like competition than richness.", score: 1 },
      { text: "Cultural differences are a significant source of ongoing conflict for us.", score: 0 },
      { text: "We try to respect each other's background, though we don't always succeed.", score: 2 },
      { text: "We treat our different backgrounds as an asset, learning from each other and building shared traditions.", score: 3 },
    ],
  },
  {
    id: 5,
    principle: "Principle 3: Dialogue to Generate Energy",
    text: "How do you and your partner approach money decisions as a couple?",
    options: [
      { text: "We have clear, agreed-upon financial goals and a budget we both commit to.", score: 3 },
      { text: "We've talked through finances and mostly agree, though some tensions remain.", score: 2 },
      { text: "One of us tends to manage the money while the other stays largely uninvolved.", score: 1 },
      { text: "Money is a frequent source of arguments — we seem to want very different things.", score: 0 },
    ],
  },
  {
    id: 6,
    principle: "Principle 3: Dialogue to Generate Energy",
    text: "How united are you and your partner when it comes to parenting decisions?",
    options: [
      { text: "We agree on most things, but occasionally one of us overrides the other in front of the children.", score: 2 },
      { text: "We discuss parenting issues openly, reach agreements, and support each other consistently.", score: 3 },
      { text: "Parenting is a major source of conflict — our approaches feel incompatible.", score: 0 },
      { text: "We parent fairly independently and avoid discussing differences to keep the peace.", score: 1 },
    ],
  },
  {
    id: 7,
    principle: "Principle 3: Dialogue to Generate Energy",
    text: "How satisfied are both of you with the way household responsibilities are shared?",
    options: [
      { text: "One partner does almost everything; the imbalance causes resentment.", score: 0 },
      { text: "Roles are uneven and we know it, but we avoid discussing it directly.", score: 1 },
      { text: "We've talked openly about household roles and reached an arrangement we both feel is fair.", score: 3 },
      { text: "Things are roughly fair, though we could be more intentional about dividing tasks.", score: 2 },
    ],
  },
  {
    id: 8,
    principle: "Principle 3: Dialogue to Generate Energy",
    text: "How well do you and your partner manage expectations around extended family and friends?",
    options: [
      { text: "We generally agree, though family obligations sometimes cause minor friction.", score: 2 },
      { text: "We sometimes feel pulled in different directions by family loyalties.", score: 1 },
      { text: "Extended family or friends are a regular source of serious conflict in our relationship.", score: 0 },
      { text: "We have clear, agreed-upon boundaries with extended family and navigate those relationships as a united team.", score: 3 },
    ],
  },
  {
    id: 9,
    principle: "Principle 4: Love and Beauty",
    text: "How consistently do you and your partner create dedicated, uninterrupted time for just the two of you?",
    options: [
      { text: "We regularly schedule date nights and protect that time from everyday demands.", score: 3 },
      { text: "We hardly ever spend dedicated time together; we've drifted into mostly parallel lives.", score: 0 },
      { text: "Our time together is mostly swallowed up by chores, children, or screens.", score: 1 },
      { text: "We spend time together but it's rarely planned or free of distractions.", score: 2 },
    ],
  },
  {
    id: 10,
    principle: "Principle 4: Love and Beauty",
    text: "How would you describe the level of physical and emotional closeness between you and your partner?",
    options: [
      { text: "We feel reasonably close, though intimacy could be more consistent and intentional.", score: 2 },
      { text: "We enjoy a warm, satisfying level of both emotional and physical intimacy.", score: 3 },
      { text: "Intimacy happens occasionally but feels like an afterthought rather than a priority.", score: 1 },
      { text: "Closeness is rare; we feel more like housemates than intimate partners.", score: 0 },
    ],
  },
  {
    id: 11,
    principle: "Principle 4: Love and Beauty",
    text: "How much common ground do you and your partner share when it comes to meaning, purpose, or spiritual life?",
    options: [
      { text: "We rarely discuss meaning or spirituality; it's never felt like a shared space.", score: 1 },
      { text: "Our differences in this area create real tension between us.", score: 0 },
      { text: "We've explored each other's sense of meaning and either share it or genuinely respect our differences.", score: 3 },
      { text: "We have some alignment here, though we haven't talked about it deeply.", score: 2 },
    ],
  },
  {
    id: 12,
    principle: "Principle 5: Respect",
    text: "How would you describe the level of honesty and trust in your relationship?",
    options: [
      { text: "Trust has been broken or is fragile; honesty feels risky in our relationship.", score: 0 },
      { text: "We are mostly honest, though we sometimes hold back to avoid conflict.", score: 2 },
      { text: "We're honest about facts but tend to hide our deeper feelings or struggles.", score: 1 },
      { text: "We are genuinely transparent with each other, and both feel secure and trusted.", score: 3 },
    ],
  },
  {
    id: 13,
    principle: "Principle 6: Personal Growth",
    text: "How actively do you and your partner invest in growing as individuals and as a couple?",
    options: [
      { text: "We actively read, attend courses, or seek mentorship together and encourage each other's personal growth.", score: 3 },
      { text: "We're open to growth but rarely take concrete steps to pursue it together.", score: 2 },
      { text: "Personal development feels like a low priority; life is just too busy.", score: 0 },
      { text: "One of us wants to grow; the other shows little interest.", score: 1 },
    ],
  },
  {
    id: 14,
    principle: "Principle 7: Feedback and Vitality",
    text: "How well do you and your partner balance genuine appreciation with honest, constructive feedback?",
    options: [
      { text: "We struggle on both — encouragement is rare and criticism often stings.", score: 0 },
      { text: "We freely give praise and raise concerns with care and respect; feedback strengthens our bond.", score: 3 },
      { text: "We appreciate each other, though we could be more direct about areas for improvement.", score: 2 },
      { text: "We tend toward one extreme — either too critical or too reluctant to say anything at all.", score: 1 },
    ],
  },
];

questionsSchema.parse(questions);
