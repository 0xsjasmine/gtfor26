'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { WeeklyWrappedModal } from './WeeklyWrappedModal';
import { ReflectionModal } from './ReflectionModal';
import { cn, formatDate } from '@/lib/utils';
import type { FocusView, EnergyLevel } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
      mostProductiveDay: 'Tuesday',
      goalsProgress: totalGoalProgress,
      streakDays: 5,
    };
  };

  const navigateDay = (offset: number) => {
    const date = new Date(selectedDate + 'T12:00:00');
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

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
    console.log('Reflection answers:', answers);
  };

  return (
    <div className="h-full overflow-auto p-6 bg-transparent">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl text-neutral-800">Focus</h1>
            <p className="text-neutral-500 mt-1">
              {focusView === 'day' && formatDate(selectedDateObj, 'EEEE, MMMM d')}
              {focusView === 'week' && `Week of ${formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')}`}
              {focusView === 'month' && formatDate(selectedDateObj, 'MMMM yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isToday && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedDate(today);
                  setFocusView('day');
                }}
                className="px-4 py-2 text-sm bg-lavender-100 text-lavender-600 font-medium rounded-xl hover:bg-lavender-200 transition-colors"
              >
                Today
              </motion.button>
            )}
            <ViewToggle
              views={focusViews}
              activeView={focusView}
              onChange={setFocusView}
            />
          </div>
        </motion.div>

        {/* Intentions Reminder Banner */}
        <AnimatePresence>
          {isToday && goals.filter(g => g.status === 'active').length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => {
                setReflectionType('weekly');
                setShowReflection(true);
              }}
              className="mb-6 p-5 bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl cursor-pointer hover:border-lavender-300 transition-all group shadow-glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-100 to-lavender-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-lavender-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Set your intentions</p>
                    <p className="text-sm text-neutral-500">Start your week with clarity</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-lavender-500 transition-colors" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Day View */}
        {focusView === 'day' && (
          <div className="space-y-6">
            {/* Day Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-5 shadow-glass"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDay(-1)}
                className="p-2 hover:bg-lavender-50 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </motion.button>
              <div className="text-center">
                <p className="font-display text-xl text-neutral-800">
                  {formatDate(selectedDateObj, 'EEEE')}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatDate(selectedDateObj, 'MMMM d, yyyy')}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDay(1)}
                className="p-2 hover:bg-lavender-50 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </motion.button>
            </motion.div>

            {/* Today's Focus */}
            {isToday && scheduledActions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-6 shadow-glass"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-lavender-500" />
                  <h2 className="font-display text-xl text-neutral-800">Today's Focus</h2>
                </div>
                <div className="space-y-3">
                  {scheduledActions.map(({ action, goal }, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl transition-all",
                        action.status === 'done'
                          ? "bg-sage-50/50"
                          : "bg-white/80 border border-neutral-200/50"
                      )}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleActionComplete(goal.id, action.id)}
                        className={cn(
                          "w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                          action.status === 'done'
                            ? "bg-sage-400 border-sage-400"
                            : "border-neutral-300 hover:border-lavender-400"
                        )}
                      >
                        {action.status === 'done' && <Check className="w-4 h-4 text-white" />}
                      </motion.button>
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
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {isToday && scheduledActions.length === 0 && goals.filter(g => g.status === 'active').length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-8 text-center shadow-glass"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-lavender-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-lavender-400" />
                </div>
                <p className="font-display text-lg text-neutral-700">Nothing scheduled for today</p>
                <p className="text-sm text-neutral-500 mt-2">Visit your intentions and pick something to focus on</p>
              </motion.div>
            )}

            {/* Energy Check */}
            {isToday && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-5 shadow-glass"
              >
                <p className="text-sm font-medium text-neutral-600 mb-4">How's your energy?</p>
                <div className="flex gap-2">
                  {energyLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateTodayEnergy(level.value)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-medium transition-all",
                        todayContext?.energy_level === level.value
                          ? "bg-gradient-to-r from-lavender-400 to-lavender-500 text-white shadow-soft"
                          : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80"
                      )}
                    >
                      {level.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Week View */}
        {focusView === 'week' && (
          <div className="space-y-6">
            {/* Week Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-5 shadow-glass"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDay(-7)}
                className="p-2 hover:bg-lavender-50 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </motion.button>
              <p className="font-display text-xl text-neutral-800">
                {formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')} - {formatDate(new Date(weekDays[6] + 'T12:00:00'), 'MMM d, yyyy')}
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateDay(7)}
                className="p-2 hover:bg-lavender-50 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </motion.button>
            </motion.div>

            {/* Weekly Planning Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                setReflectionType('weekly');
                setShowReflection(true);
              }}
              className="p-5 bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl cursor-pointer hover:border-lavender-300 transition-all group shadow-glass"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-100 to-lavender-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-lavender-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">Weekly Planning</p>
                    <p className="text-sm text-neutral-500">Set your intentions for the week</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-lavender-500 transition-colors" />
              </div>
            </motion.div>

            {/* Week Calendar */}
            <div className="grid grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                  {day}
                </div>
              ))}
              {weekDays.map((date, index) => {
                const dayActions = getActionsForDate(date);
                const isTodayDate = date === today;
                const isWeekend = [0, 6].includes(new Date(date + 'T12:00:00').getDay());

                return (
                  <motion.button
                    key={date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => {
                      setSelectedDate(date);
                      setFocusView('day');
                    }}
                    className={cn(
                      "p-4 rounded-xl border transition-all min-h-[120px] flex flex-col backdrop-blur-sm",
                      isTodayDate
                        ? "border-lavender-300 bg-lavender-50/80 shadow-soft"
                        : isWeekend
                        ? "border-white/60 bg-white/40"
                        : "border-white/80 bg-white/60 hover:border-lavender-200 shadow-glass"
                    )}
                  >
                    <span className={cn(
                      "text-lg font-display",
                      isTodayDate ? "text-lavender-600" : "text-neutral-700"
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
                                ? "bg-sage-100 text-sage-600 line-through"
                                : "bg-white/80 text-neutral-600"
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
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Month View */}
        {focusView === 'month' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-5 shadow-glass"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const date = new Date(selectedDate + 'T12:00:00');
                  date.setMonth(date.getMonth() - 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="p-2 hover:bg-lavender-50 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </motion.button>
              <p className="font-display text-xl text-neutral-800">
                {formatDate(selectedDateObj, 'MMMM yyyy')}
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const date = new Date(selectedDate + 'T12:00:00');
                  date.setMonth(date.getMonth() + 1);
                  setSelectedDate(date.toISOString().split('T')[0]);
                }}
                className="p-2 hover:bg-lavender-50 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </motion.button>
            </motion.div>

            {/* Month Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Intentions', value: goals.filter(g => g.status === 'active').length, gradient: 'from-lavender-50 to-lavender-100', border: 'border-lavender-200/50' },
                { label: 'Done', value: goals.reduce((acc, g) => acc + g.actions.filter(a => a.status === 'done').length, 0), gradient: 'from-sage-50 to-sage-100', border: 'border-sage-200/50' },
                { label: 'Remaining', value: goals.reduce((acc, g) => acc + g.actions.filter(a => a.status !== 'done').length, 0), gradient: 'from-rose-50 to-rose-100', border: 'border-rose-200/50' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "bg-gradient-to-br rounded-2xl border p-5 text-center backdrop-blur-sm shadow-glass",
                    stat.gradient,
                    stat.border
                  )}
                >
                  <p className="font-display text-3xl text-neutral-800">
                    {stat.value}
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
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
