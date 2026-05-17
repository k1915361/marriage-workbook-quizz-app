import { Component, For } from 'solid-js';
import { Progress } from '@kobalte/core/progress';
import { RadioGroup } from '@kobalte/core/radio-group';
import { Button } from '@kobalte/core/button';
import { questions } from '../data/questions';

interface QuizScreenProps {
  currentQuestionIndex: number;
  userAnswers: (number | null)[];
  onSelectOption: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const QuizScreen: Component<QuizScreenProps> = (props) => {
  const q = () => questions[props.currentQuestionIndex];
  // Show progress based on answered questions rather than position, so the bar
  // only fills when the user has actually committed an answer.
  const progressPercentage = () => {
    const answered = props.userAnswers.filter((a) => a !== null).length;
    return (answered / questions.length) * 100;
  };
  const isAnswered = () => props.userAnswers[props.currentQuestionIndex] !== null;

  return (
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-8 max-w-2xl w-full">
        
        {/* Header */}
        <div class="mb-8">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Question {props.currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <Progress value={progressPercentage()} minValue={0} maxValue={100} class="w-full">
            <Progress.Track class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <Progress.Fill class="h-full bg-blue-600 transition-all duration-500 ease-out" />
            </Progress.Track>
          </Progress>
        </div>
        
        {/* Question */}
        <h2 class="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">{q().principle}</h2>
        <h3 class="text-2xl text-slate-900 font-bold mb-8 tracking-tight leading-snug">{q().text}</h3>
        
        {/* Options using RadioGroup for accessibility */}
        <RadioGroup
          // Fix: pass "" (not undefined) when unanswered so Kobalte resets its
          // internal selection state on every question navigation.
          // Passing undefined is treated as "uncontrolled" and keeps the stale
          // visual selection while isAnswered() is still false → Next stays disabled.
          value={props.userAnswers[props.currentQuestionIndex] !== null
            ? props.userAnswers[props.currentQuestionIndex]!.toString()
            : ""}
          onChange={(val) => { if (val !== "") props.onSelectOption(parseInt(val)); }}
          class="flex flex-col gap-3 mb-8"
        >
          <For each={q().options}>
            {(option, index) => (
              <RadioGroup.Item 
                value={index().toString()}
                class={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 flex items-center
                  ${props.userAnswers[props.currentQuestionIndex] === index() 
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'}`}
              >
                <RadioGroup.ItemInput class="absolute w-0 h-0 opacity-0" />
                <RadioGroup.ItemControl class={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center transition-colors
                  ${props.userAnswers[props.currentQuestionIndex] === index() ? 'border-blue-600' : 'border-slate-300 group-hover:border-slate-400'}`}>
                  <RadioGroup.ItemIndicator class="w-2.5 h-2.5 rounded-full bg-blue-600" />
                </RadioGroup.ItemControl>
                <RadioGroup.ItemLabel class={`text-base font-medium cursor-pointer transition-colors
                  ${props.userAnswers[props.currentQuestionIndex] === index() ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {option.text}
                </RadioGroup.ItemLabel>
              </RadioGroup.Item>
            )}
          </For>
        </RadioGroup>
        
        {/* Footer */}
        <div class="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <Button 
            class={`px-6 py-2.5 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 active:scale-95
              ${props.currentQuestionIndex === 0 ? 'invisible' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'}`} 
            onClick={props.onPrev}
          >
            Previous
          </Button>
          
          <Button 
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20 active:scale-95 disabled:active:scale-100" 
            disabled={!isAnswered()}
            onClick={props.onNext}
          >
            {props.currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};
