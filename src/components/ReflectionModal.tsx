'use client';

import { useState } from 'react';
import { X, BookOpen, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReflectionQuestion {
  id: string;
  question: string;
  placeholder: string;
}

const weeklyQuestions: ReflectionQuestion[] = [
  {
    id: 'priorities',
    question: 'What are your top 3 priorities this week?',
    placeholder: 'The things that matter most...',
  },
  {
    id: 'goal-focus',
    question: 'Which intention will you make progress on?',
    placeholder: 'I will focus on...',
  },
  {
    id: 'obstacles',
    question: 'What might get in your way, and how will you handle it?',
    placeholder: 'If I encounter... I will...',
  },
];

const dailyQuestions: ReflectionQuestion[] = [
  {
    id: 'today-focus',
    question: 'What\'s the one thing that would make today a win?',
    placeholder: 'Today will be a success if...',
  },
  {
    id: 'energy',
    question: 'How are you feeling today?',
    placeholder: 'I\'m feeling...',
  },
];

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'weekly' | 'daily';
  onComplete: (answers: Record<string, string>) => void;
}

export function ReflectionModal({ isOpen, onClose, type, onComplete }: ReflectionModalProps) {
  const questions = type === 'weekly' ? weeklyQuestions : dailyQuestions;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!isOpen) return null;

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleComplete = () => {
    onComplete(answers);
    setAnswers({});
    setCurrentQuestion(0);
  };

  const canComplete = questions.every(q => answers[q.id]?.trim());
  const Icon = type === 'weekly' ? Sun : Moon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-cream-100 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-cream-300">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">
                {type === 'weekly' ? 'Weekly Planning' : 'Daily Check-in'}
              </p>
              <h2 className="font-serif text-2xl text-neutral-800">
                {type === 'weekly' ? 'Set Your Intentions' : 'Start Your Day'}
              </h2>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="px-8 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className={cn(
                "animate-fade-in",
                index === 0 ? "" : `stagger-${index}`
              )}
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              <label className="block mb-3">
                <span className="text-sm font-medium text-neutral-700">
                  {q.question}
                </span>
              </label>
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                className="w-full px-4 py-3 bg-white border border-cream-300 rounded-xl
                         text-neutral-800 placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400
                         resize-none transition-all"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-cream-200/50 border-t border-cream-300">
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className={cn(
              "w-full py-4 rounded-xl font-medium text-lg transition-all",
              canComplete
                ? "bg-primary-400 text-white hover:bg-primary-500"
                : "bg-cream-300 text-neutral-400 cursor-not-allowed"
            )}
          >
            {type === 'weekly' ? 'Start the Week' : 'Begin Today'} →
          </button>
        </div>
      </div>
    </div>
  );
}
