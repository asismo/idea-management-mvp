import React, { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface OnboardingWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  {
    title: 'Welcome to Ideas',
    description: 'Capture your thoughts without friction. Text or voice, we organize everything for you.',
    icon: '👋',
  },
  {
    title: 'Capture Ideas',
    description: 'Click the "Capture" button to record a voice memo or type your idea. No need to organize manually.',
    icon: '💡',
  },
  {
    title: 'Automatic Organization',
    description: 'We automatically categorize your ideas into folders and assign relevant tags using AI.',
    icon: '🤖',
  },
  {
    title: 'Smart Search',
    description: 'Find your ideas using keywords or natural language questions. Search by tags or content.',
    icon: '🔍',
  },
  {
    title: 'Customize Settings',
    description: 'Configure AI behavior, input methods, and search type in Settings. Start simple, go advanced.',
    icon: '⚙️',
  },
];

export const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => {
              onComplete();
              onClose();
            }}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 py-6">
          <div className="text-5xl">{step.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{step.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1 justify-center mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx <= currentStep
                  ? 'bg-blue-500 w-6'
                  : 'bg-slate-300 dark:bg-slate-600 w-2'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <span className="text-xs text-slate-500 dark:text-slate-400 self-center">
            {currentStep + 1} / {steps.length}
          </span>
          <Button
            variant="primary"
            onClick={handleNext}
            className="flex items-center gap-1"
          >
            {isLastStep ? 'Get Started' : 'Next'}
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Skip */}
        <button
          onClick={() => {
            onComplete();
            onClose();
          }}
          className="w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mt-4 py-2"
        >
          Skip
        </button>
      </Card>
    </div>
  );
};
