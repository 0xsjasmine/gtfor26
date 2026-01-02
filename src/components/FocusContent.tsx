'use client';

import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { JournalPrompt } from './JournalPrompt';
import { cn, formatDate } from '@/lib/utils';
import type { FocusView, EnergyLevel } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Battery,
  Zap,
  Calendar,
  Star,
  Target,
} from 'lucide-react';

const focusViews: { id: FocusView; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

const energyLevels: { value: EnergyLevel; label: string; color: string }[] = [
  { value: 1, label: 'Recharging', color: 'bg-accent-400' },
  { value: 2, label: 'Low Vibe', color: 'bg-accent-300' },
  { value: 3, label: 'Rising', color: 'bg-warm-400' },
  { value: 4, label: 'Aligned', color: 'bg-sage-400' },
  { value: 5, label: 'In My Power', color: 'bg-sage-500' },
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

  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;
  const selectedDateObj = new Date(selectedDate + 'T12:00:00');
  const todayContext = getTodayContext();

  // Get scheduled actions for selected date
  const scheduledActions = getScheduledActionsForDate(selectedDate);

  // Navigation helpers
  const navigateDay = (offset: number) => {
    const date = new Date(selectedDate + 'T12:00:00');
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(today);
  };

  // Week helpers
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

  // Month helpers
  const getMonthDays = () => {
    const date = new Date(selectedDate + 'T12:00:00');
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;

    const days: (string | null)[] = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push(d.toISOString().split('T')[0]);
    }

    return days;
  };

  const monthDays = getMonthDays();

  const navigateMonth = (offset: number) => {
    const date = new Date(selectedDate + 'T12:00:00');
    date.setMonth(date.getMonth() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const getActionsForDate = (date: string) => {
    return getScheduledActionsForDate(date);
  };

  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isEvening = currentHour >= 18 || currentHour < 5;

  return (
    <div className="h-full overflow-auto p-6 bg-warm-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-warm-900">Focus</h1>
            <p className="text-warm-500">
              {focusView === 'day' && formatDate(selectedDateObj, 'EEEE, MMMM d')}
              {focusView === 'week' && `Week of ${formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')}`}
              {focusView === 'month' && formatDate(selectedDateObj, 'MMMM yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isToday && focusView === 'day' && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200"
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

        {/* Day View */}
        {focusView === 'day' && (
          <div className="space-y-6">
            {/* Day Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-warm-200 p-4">
              <button
                onClick={() => navigateDay(-1)}
                className="p-2 hover:bg-warm-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-warm-600" />
              </button>
              <div className="text-center">
                <p className="text-lg font-medium text-warm-800">
                  {formatDate(selectedDateObj, 'EEEE')}
                </p>
                <p className="text-sm text-warm-500">
                  {formatDate(selectedDateObj, 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => navigateDay(1)}
                className="p-2 hover:bg-warm-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-warm-600" />
              </button>
            </div>

            {/* Currently Focusing On - Hero Section */}
            {isToday && scheduledActions.length > 0 && (
              <div className="bg-gradient-to-br from-accent-50 to-warm-50 rounded-2xl border border-accent-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent-500" />
                  <h2 className="text-lg font-serif font-semibold text-warm-900">Currently Focusing On</h2>
                </div>
                <div className="space-y-3">
                  {scheduledActions.slice(0, 3).map(({ action, goal }) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
                    >
                      <button
                        onClick={() => toggleActionComplete(goal.id, action.id)}
                        className="w-7 h-7 rounded-full border-2 border-accent-400 flex items-center justify-center hover:bg-accent-50 transition-colors flex-shrink-0"
                      >
                        {action.status === 'done' && <Check className="w-4 h-4 text-accent-500" />}
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-warm-800">{action.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Target className="w-3 h-3 text-warm-400" />
                          <p className="text-xs text-warm-500">{goal.objective}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {scheduledActions.length > 3 && (
                  <p className="text-center text-sm text-warm-500 mt-4">
                    +{scheduledActions.length - 3} more actions scheduled
                  </p>
                )}
              </div>
            )}

            {/* No Focus Message */}
            {isToday && scheduledActions.length === 0 && (
              <div className="bg-warm-100 rounded-2xl border border-warm-200 p-6 text-center">
                <Star className="w-8 h-8 text-warm-400 mx-auto mb-3" />
                <p className="text-warm-700 font-medium">Nothing scheduled for today</p>
                <p className="text-sm text-warm-500 mt-1">Visit your goals and set something to focus on!</p>
              </div>
            )}

            {/* Energy Check-in (only show for today) */}
            {isToday && (
              <div className="bg-white rounded-xl border border-warm-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Battery className="w-4 h-4 text-warm-500" />
                  <span className="text-sm font-medium text-warm-700">Energy Level</span>
                </div>
                <div className="flex gap-2">
                  {energyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateTodayEnergy(level.value)}
                      className={cn(
                        "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                        todayContext?.energy_level === level.value
                          ? `${level.color} text-white shadow-md`
                          : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                      )}
                    >
                      <Zap className={cn(
                        "w-4 h-4 mx-auto mb-1",
                        todayContext?.energy_level === level.value ? "text-white" : "text-warm-400"
                      )} />
                      <span className="text-xs">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Journal Prompts (only show for today) */}
            {isToday && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isMorning && <JournalPrompt type="morning" />}
                {isEvening && <JournalPrompt type="evening" />}
                {!isMorning && !isEvening && (
                  <>
                    <JournalPrompt type="morning" />
                    <JournalPrompt type="evening" />
                  </>
                )}
              </div>
            )}

            {/* Other Scheduled Actions */}
            {!isToday && scheduledActions.length > 0 && (
              <div className="bg-white rounded-xl border border-warm-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-warm-500" />
                    <span className="text-sm font-medium text-warm-700">Scheduled Actions</span>
                  </div>
                  <span className="text-xs text-warm-400">
                    {scheduledActions.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {scheduledActions.map(({ action, goal }) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 p-3 bg-warm-50 rounded-lg"
                    >
                      <button
                        onClick={() => toggleActionComplete(goal.id, action.id)}
                        className="w-5 h-5 rounded border-2 border-warm-300 flex items-center justify-center hover:border-sage-400 transition-colors flex-shrink-0"
                      >
                        {action.status === 'done' && <Check className="w-3 h-3 text-sage-500" />}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm text-warm-700">{action.text}</p>
                        <p className="text-xs text-warm-400">{goal.objective}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isToday && scheduledActions.length === 0 && (
              <div className="bg-white rounded-xl border border-warm-200 p-8 text-center">
                <p className="text-warm-500">No actions scheduled for this day.</p>
              </div>
            )}
          </div>
        )}

        {/* Week View */}
        {focusView === 'week' && (
          <div className="space-y-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-warm-200 p-4">
              <button
                onClick={() => navigateDay(-7)}
                className="p-2 hover:bg-warm-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-warm-600" />
              </button>
              <div className="text-center">
                <p className="text-lg font-medium text-warm-800">
                  {formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')} - {formatDate(new Date(weekDays[6] + 'T12:00:00'), 'MMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => navigateDay(7)}
                className="p-2 hover:bg-warm-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-warm-600" />
              </button>
            </div>

            {/* Week Planning Prompt */}
            <JournalPrompt type="weekly_planning" />

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-warm-500 py-2">
                  {day}
                </div>
              ))}
              {weekDays.map((date) => {
                const dayActions = getActionsForDate(date);
                const isSelected = date === selectedDate;
                const isTodayDate = date === today;

                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setFocusView('day');
                    }}
                    className={cn(
                      "p-3 rounded-xl border transition-all min-h-[100px] flex flex-col",
                      isSelected
                        ? "border-accent-400 bg-accent-50"
                        : isTodayDate
                        ? "border-sage-400 bg-sage-50"
                        : "border-warm-200 bg-white hover:border-warm-300"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium mb-2",
                      isTodayDate ? "text-sage-700" : "text-warm-700"
                    )}>
                      {new Date(date + 'T12:00:00').getDate()}
                    </span>
                    {dayActions.length > 0 && (
                      <div className="space-y-1 mt-auto">
                        {dayActions.slice(0, 2).map(({ action }) => (
                          <div
                            key={action.id}
                            className="text-xs text-warm-600 bg-warm-100 rounded px-1.5 py-0.5 truncate"
                          >
                            {action.text}
                          </div>
                        ))}
                        {dayActions.length > 2 && (
                          <span className="text-xs text-warm-400">
                            +{dayActions.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Weekly Review (show on weekends) */}
            {selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6 ? (
              <JournalPrompt type="weekly_review" />
            ) : null}
          </div>
        )}

        {/* Month View */}
        {focusView === 'month' && (
          <div className="space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-warm-200 p-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-warm-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-warm-600" />
              </button>
              <p className="text-lg font-medium text-warm-800">
                {formatDate(selectedDateObj, 'MMMM yyyy')}
              </p>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-warm-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-warm-600" />
              </button>
            </div>

            {/* Month Grid */}
            <div className="bg-white rounded-xl border border-warm-200 p-4">
              <div className="grid grid-cols-7 gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-warm-500 py-2">
                    {day}
                  </div>
                ))}
                {monthDays.map((date, i) => {
                  if (!date) {
                    return <div key={`empty-${i}`} className="p-2" />;
                  }

                  const dayActions = getActionsForDate(date);
                  const isSelected = date === selectedDate;
                  const isTodayDate = date === today;
                  const dayNum = new Date(date + 'T12:00:00').getDate();

                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setFocusView('day');
                      }}
                      className={cn(
                        "p-2 rounded-lg transition-all aspect-square flex flex-col items-center justify-center relative",
                        isSelected
                          ? "bg-accent-500 text-white"
                          : isTodayDate
                          ? "bg-sage-100 text-sage-700"
                          : "hover:bg-warm-100 text-warm-700"
                      )}
                    >
                      <span className="text-sm font-medium">{dayNum}</span>
                      {dayActions.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {dayActions.slice(0, 3).map((_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "w-1 h-1 rounded-full",
                                isSelected ? "bg-white/70" : "bg-accent-400"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-xl border border-warm-200 p-5">
              <h3 className="font-medium text-warm-800 mb-3">
                {formatDate(selectedDateObj, 'MMMM')} Overview
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-warm-50 rounded-xl">
                  <p className="text-2xl font-bold text-warm-800">
                    {goals.filter(g => g.status === 'active').length}
                  </p>
                  <p className="text-xs text-warm-500">Active Goals</p>
                </div>
                <div className="text-center p-4 bg-sage-50 rounded-xl">
                  <p className="text-2xl font-bold text-sage-700">
                    {goals.reduce((acc, g) => acc + g.actions.filter(a => a.status === 'done').length, 0)}
                  </p>
                  <p className="text-xs text-warm-500">Actions Done</p>
                </div>
                <div className="text-center p-4 bg-accent-50 rounded-xl">
                  <p className="text-2xl font-bold text-accent-700">
                    {goals.reduce((acc, g) => acc + g.actions.filter(a => a.status === 'pending' || a.status === 'scheduled').length, 0)}
                  </p>
                  <p className="text-xs text-warm-500">Remaining</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
