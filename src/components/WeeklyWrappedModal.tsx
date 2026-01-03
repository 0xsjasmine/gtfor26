'use client';

import { useState } from 'react';
import { X, ChevronRight, Sparkles, Target, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeeklyStats {
  milestonesCompleted: number;
  totalMilestones: number;
  actionsCompleted: number;
  mostProductiveDay: string;
  goalsProgress: number;
  streakDays: number;
}

interface WeeklyWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: WeeklyStats;
  onStartWeek: () => void;
}

const slides = [
  'intro',
  'milestones',
  'productive-day',
  'progress',
  'ready',
] as const;

type Slide = typeof slides[number];

export function WeeklyWrappedModal({ isOpen, onClose, stats, onStartWeek }: WeeklyWrappedModalProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentSlide(0);
    onClose();
  };

  const handleStartWeek = () => {
    setCurrentSlide(0);
    onStartWeek();
  };

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 aspect-[9/16] max-h-[85vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl"
        onClick={nextSlide}
      >
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress dots */}
        <div className="absolute top-4 left-4 right-12 flex gap-1 z-10">
          {slides.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                i <= currentSlide ? "bg-primary-400" : "bg-white/20"
              )}
            />
          ))}
        </div>

        {/* Slides */}
        <div className="h-full flex flex-col justify-center items-center p-8 text-center text-white">

          {/* Intro Slide */}
          {slide === 'intro' && (
            <div className="animate-scale-in space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Your week in review</p>
                <h1 className="font-serif text-4xl font-bold">Let's see how you did</h1>
              </div>
              <p className="text-white/60">Tap to continue</p>
            </div>
          )}

          {/* Milestones Slide */}
          {slide === 'milestones' && (
            <div className="animate-scale-in space-y-6">
              <Target className="w-12 h-12 mx-auto text-primary-400" />
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-4">Milestones hit</p>
                <p className="font-serif text-7xl font-bold text-primary-400">
                  {stats.milestonesCompleted}
                </p>
                <p className="text-white/60 mt-2">
                  out of {stats.totalMilestones} this week
                </p>
              </div>
              {stats.milestonesCompleted > 0 && (
                <p className="text-lg">
                  {stats.milestonesCompleted >= stats.totalMilestones
                    ? "You crushed it! 🎉"
                    : stats.milestonesCompleted >= stats.totalMilestones / 2
                    ? "Solid progress! Keep pushing 💪"
                    : "Every step counts ✨"}
                </p>
              )}
            </div>
          )}

          {/* Most Productive Day Slide */}
          {slide === 'productive-day' && (
            <div className="animate-scale-in space-y-6">
              <Calendar className="w-12 h-12 mx-auto text-primary-400" />
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-4">Your power day</p>
                <p className="font-serif text-5xl font-bold">
                  {stats.mostProductiveDay}
                </p>
                <p className="text-white/60 mt-4">
                  was when you were most focused
                </p>
              </div>
              <p className="text-lg">
                Maybe lean into that energy this week? 🌟
              </p>
            </div>
          )}

          {/* Progress Slide */}
          {slide === 'progress' && (
            <div className="animate-scale-in space-y-6">
              <TrendingUp className="w-12 h-12 mx-auto text-primary-400" />
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-4">Q1 Progress</p>
                <p className="font-serif text-7xl font-bold">
                  {stats.goalsProgress}%
                </p>
                <p className="text-white/60 mt-2">
                  toward your goals
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full max-w-xs mx-auto">
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.goalsProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-lg">
                {stats.goalsProgress >= 75
                  ? "You're in the home stretch!"
                  : stats.goalsProgress >= 50
                  ? "Halfway there, keep going!"
                  : stats.goalsProgress >= 25
                  ? "Building momentum 🚀"
                  : "Just getting started ✨"}
              </p>
            </div>
          )}

          {/* Ready Slide */}
          {slide === 'ready' && (
            <div className="animate-scale-in space-y-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <ArrowRight className="w-10 h-10" />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold mb-4">Ready for a new week?</h1>
                <p className="text-white/60">
                  Set your intentions and make it count
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleStartWeek(); }}
                className="px-8 py-4 bg-primary-400 hover:bg-primary-500 text-white font-semibold rounded-full transition-colors"
              >
                Let's go →
              </button>
            </div>
          )}
        </div>

        {/* Navigation hint */}
        {currentSlide < slides.length - 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <ChevronRight className="w-6 h-6 text-white/40 animate-pulse" />
          </div>
        )}

        {/* Click areas for prev/next */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3"
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        />
      </div>
    </div>
  );
}
