import { X, ArrowRight } from 'lucide-react';

interface TutorialCalloutProps {
  step: string;
  title: string;
  description: string;
  onNext: () => void;
  onDismiss: () => void;
}

export function TutorialCallout({ step, title, description, onNext, onDismiss }: TutorialCalloutProps) {
  return (
    <div className="fixed bottom-4 left-4 max-w-sm bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-4 border-2 border-blue-500 shadow-2xl z-50 animate-bounce">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <button
          onClick={onDismiss}
          className="text-blue-300 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <p className="text-blue-100 text-sm mb-4">{description}</p>

      <button
        onClick={onNext}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        Got it!
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
