'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { WeeklyWrappedModal } from './WeeklyWrappedModal';
import { ReflectionModal } from './ReflectionModal';
import { cn, formatDate } from '@/lib/utils';
import type { FocusView, EnergyLevel } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const focusViews: { id: FocusView; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

const energyLevels: { value: EnergyLevel; label: string }[] = [
  { value: 1, label: 'Recharging' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Rising' },
  { value: 4, label: 'Aligned' },
  { value: 5, label: 'Powerful' },
];

export function FocusContent() {
  const {
    focusView,
    setFocusView,
    selectedDate,
    setSelectedDate,
    goals,
    toggleActionComplete,
    getTodayContext,
    updateTodayEnergy,
    getScheduledActionsForDate,
  } = useAppStore();

  const [showWrapped, setShowWrapped] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionType, setReflectionType] = useState<'weekly' | 'daily'>('weekly');
  const [hasSeenWrapped, setHasSeenWrapped] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;
  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const todayContext = getTodayContext();
  const scheduledActions = getScheduledActionsForDate(selectedDate);

  // Check if it's Sunday and should show wrapped
  useEffect(() => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const hour = now.getHours();

    if (isSunday && hour >= 8 && !hasSeenWrapped) {
      setShowWrapped(true);
    }
  }, [hasSeenWrapped]);

  // Calculate weekly stats for wrapped
  const getWeeklyStats = () => {
    const activeGoals = goals.filter(g => g.status === 'active');
    const totalMilestones = activeGoals.reduce((acc, g) => acc + g.success_measures.length, 0);
    const completedMilestones = activeGoals.reduce(
      (acc, g) => acc + g.success_measures.filter(m => m.current >= m.target).length,
      0
    );
    const actionsCompleted = activeGoals.reduce(
      (acc, g) => acc + g.actions.filter(a => a.status === 'done').length,
      0
    );
    const totalGoalProgress = totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

    return {
      milestonesCompleted: completedMilestones,
      totalMilestones,
      actionsCompleted,
      mostProductiveDay: 'Tuesday', // Would calculate from actual data
      goalsProgress: totalGoalProgress,
      streakDays: 5, // Would track actual streak
    };
  };

  const navigateDay = (offset: number) => {
    const date = new Date(selectedDate + 'T12:00:00');
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => setSelectedDate(today);

  const getWeekDays = () => {
    const date = new Date(selectedDate + 'T12:00:00');
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  };

  const weekDays = getWeekDays();

  const getActionsForDate = (date: string) => getScheduledActionsForDate(date);

  const handleWrappedComplete = () => {
    setShowWrapped(false);
    setHasSeenWrapped(true);
    setReflectionType('weekly');
    setShowReflection(true);
  };

  const handleReflectionComplete = (answers: Record<string, string>) => {
    setShowReflection(false);
    // Save reflection answers to store
    console.log('Reflection answers:', answers);
  };

  return (
    <div className="h-full overflow-auto p-6 bg-cream-100">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-neutral-800">Focus</h1>
            <p className="text-neutral-500 mt-1">
              {focusView === 'day' && formatDate(selectedDateObj, 'EEEE, MMMM d')}
              {focusView === 'week' && `Week of ${formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')}`}
              {focusView === 'month' && formatDate(selectedDateObj, 'MMMM yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isToday && focusView === 'day' && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm bg-cream-200 text-neutral-700 rounded-lg hover:bg-cream-300"
              >
                Today
              </button>
            )}
            <ViewToggle
              views={focusViews}
              activeView={focusView}
              onChange={setFocusView}
            />
          </div>
        </div>

        {/* Intentions Reminder Banner */}
        {isToday && goals.filter(g => g.status === 'active').length === 0 && (
          <div
            onClick={() => {
              setReflectionType('weekly');
              setShowReflection(true);
            }}
            className="mb-6 p-5 bg-cream-50 border border-cream-300 rounded-2xl cursor-pointer hover:border-primary-300 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-medium text-neutral-800">Don't forget to set your intentions</p>
                  <p className="text-sm text-neutral-500">Start your week with clarity</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 transition-colors" />
            </div>
          </div>
        )}

        {/* Day View */}
        {focusView === 'day' && (
          <div className="space-y-6">
            {/* Day Navigation */}
            <div className="flex items-center justify-between bg-cream-50 rounded-2xl border border-cream-200 p-5">
              <button
                onClick={() => navigateDay(-1)}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="text-center">
                <p className="font-serif text-xl text-neutral-800">
                  {formatDate(selectedDateObj, 'EEEE')}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatDate(selectedDateObj, 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => navigateDay(1)}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Today's Focus */}
            {isToday && scheduledActions.length > 0 && (
              <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-primary-400" />
                  <h2 className="font-serif text-xl text-neutral-800">Today's Focus</h2>
                </div>
                <div className="space-y-3">
                  {scheduledActions.map(({ action, goal }) => (
                    <div
                      key={action.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl transition-all",
                        action.status === 'done'
                          ? "bg-cream-200/50"
                          : "bg-white border border-cream-200"
                      )}
                    >
                      <button
                        onClick={() => toggleActionComplete(goal.id, action.id)}
                        className={cn(
                          "w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                          action.status === 'done'
                            ? "bg-primary-400 border-primary-400"
                            : "border-cream-400 hover:border-primary-400"
                        )}
                      >
                        {action.status === 'done' && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium",
                          action.status === 'done'
                            ? "text-neutral-500 line-through"
                            : "text-neutral-800"
                        )}>
                          {action.text}
                        </p>
                        <p className="text-sm text-neutral-400 mt-1">{goal.objective}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {isToday && scheduledActions.length === 0 && goals.filter(g => g.status === 'active').length > 0 && (
              <div className="bg-cream-50 rounded-2xl border border-cream-200 p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cream-200 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-neutral-400" />
                </div>
                <p className="font-serif text-lg text-neutral-700">Nothing scheduled for today</p>
                <p className="text-sm text-neutral-500 mt-2">Visit your intentions and pick something to focus on</p>
              </div>
            )}

            {/* Energy Check */}
            {isToday && (
              <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5">
                <p className="text-sm font-medium text-neutral-600 mb-4">How's your energy?</p>
                <div className="flex gap-2">
                  {energyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateTodayEnergy(level.value)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-medium transition-all",
                        todayContext?.energy_level === level.value
                          ? "bg-primary-400 text-white"
                          : "bg-cream-200 text-neutral-600 hover:bg-cream-300"
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Week View */}
        {focusView === 'week' && (
          <div className="space-y-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-cream-50 rounded-2xl border border-cream-200 p-5">
              <button
                onClick={() => navigateDay(-7)}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <p className="font-serif text-xl text-neutral-800">
                {formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')} - {formatDate(new Date(weekDays[6] + 'T12:00:00'), 'MMM d, yyyy')}
              </p>
              <button
                onClick={() => navigateDay(7)}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Weekly Planning Banner */}
            <div
              onClick={() => {
                setReflectionType('weekly');
                setShowReflection(true);
              }}
              className="p-5 bg-cream-50 border border-cream-200 rounded-2xl cursor-pointer hover:border-primary-300 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Weekly Planning</p>
                    <p className="text-sm text-neutral-500">Set your intentions for the week</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-400 transition-colors" />
              </div>
            </div>

            {/* Week Calendar */}
            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                  {day}
                </div>
              ))}
              {weekDays.map((date) => {
                const dayActions = getActionsForDate(date);
                const isTodayDate = date === today;
                const isWeekend = [0, 6].includes(new Date(date + 'T12:00:00').getDay());

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setFocusView('day');
                    }}
                    className={cn(
                      "p-4 rounded-xl border transition-all min-h-[120px] flex flex-col",
                      isTodayDate
                        ? "border-primary-300 bg-primary-50"
                        : isWeekend
                        ? "border-cream-200 bg-cream-100"
                        : "border-cream-200 bg-cream-50 hover:border-cream-400"
                    )}
                  >
                    <span className={cn(
                      "text-lg font-serif",
                      isTodayDate ? "text-primary-600" : "text-neutral-700"
                    )}>
                      {new Date(date + 'T12:00:00').getDate()}
                    </span>
                    {dayActions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {dayActions.slice(0, 2).map(({ action }) => (
                          <div
                            key={action.id}
                            className={cn(
                              "text-xs px-2 py-1 rounded truncate",
                              action.status === 'done'
                                ? "bg-cream-300 text-neutral-500 line-through"
                                : "bg-white text-neutral-600"
                            )}
                          >
                            {action.text}
                          </div>
                        ))}
                        {dayActions.length > 2 && (
                          <span className="text-xs text-neutral-400">+{dayActions.length - 2}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Month View */}
        {focusView === 'month' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-cream-50 rounded-2xl border border-cream-200 p-5">
              <button
                onClick={() => {
                  const date = new Date(selectedDate + 'T12:00:00');
                  date.setMonth(date.getMonth() - 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <p className="font-serif text-xl text-neutral-800">
                {formatDate(selectedDateObj, 'MMMM yyyy')}
              </p>
              <button
                onClick={() => {
                  const date = new Date(selectedDate + 'T12:00:00');
                  date.setMonth(date.getMonth() + 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Month Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5 text-center">
                <p className="font-serif text-3xl text-neutral-800">
                  {goals.filter(g => g.status === 'active').length}
                </p>
                <p className="text-sm text-neutral-500 mt-1">Intentions</p>
              </div>
              <div className="bg-primary-50 rounded-2xl border border-primary-200 p-5 text-center">
                <p className="font-serif text-3xl text-primary-600">
                  {goals.reduce((acc, g) => acc + g.actions.filter(a => a.status === 'done').length, 0)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">Done</p>
              </div>
              <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5 text-center">
                <p className="font-serif text-3xl text-neutral-600">
                  {goals.reduce((acc, g) => acc + g.actions.filter(a => a.status !== 'done').length, 0)}
                </p>
                <p className="text-sm text-neutral-500 mt-1">Remaining</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Wrapped Modal */}
      <WeeklyWrappedModal
        isOpen={showWrapped}
        onClose={() => {
          setShowWrapped(false);
          setHasSeenWrapped(true);
        }}
        stats={getWeeklyStats()}
        onStartWeek={handleWrappedComplete}
      />

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        type={reflectionType}
        onComplete={handleReflectionComplete}
      />
    </div>
  );
}
