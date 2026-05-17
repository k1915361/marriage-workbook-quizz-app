import { Component } from 'solid-js';
import { Button } from '@kobalte/core/button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: Component<WelcomeScreenProps> = (props) => {
  return (
    <div class="flex items-center justify-center min-h-screen p-4">
      <div class="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 p-8 max-w-lg w-full text-center">
        <h1 class="text-3xl font-bold mb-3 text-slate-900 tracking-tight">Marriage Enrichment Quiz</h1>
        <p class="text-lg font-medium text-slate-600 mb-6">Based on "The 7 Principles of Creation" by Stephen Stacey</p>
        <p class="text-base text-slate-500 mb-8 leading-relaxed">Discover the strengths of your relationship and identify areas for growth with this brief assessment.</p>
        
        <Button 
          class="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20 active:scale-95"
          onClick={props.onStart}
        >
          Start Quiz
        </Button>
      </div>
    </div>
  );
};
