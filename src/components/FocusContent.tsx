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
  Calendar,
  Star,
  Target,
} from 'lucide-react';

const focusViews: { id: FocusView; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

const energyLevels: { value: EnergyLevel; label: string }[] = [
  { value: 1, label: 'Recharging' },
  { value: 2, label: 'Low Energy' },
  { value: 3, label: 'Rising' },
  { value: 4, label: 'Aligned' },
  { value: 5, label: 'In My Power' },
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

  const scheduledActions = getScheduledActionsForDate(selectedDate);

  const navigateDay = (offset: number) => {
    const date = new Date(selectedDate + 'T12:00:00');
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(today);
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
    <div className="h-full overflow-auto p-6 bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Focus</h1>
            <p className="text-neutral-500">
              {focusView === 'day' && formatDate(selectedDateObj, 'EEEE, MMMM d')}
              {focusView === 'week' && `Week of ${formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')}`}
              {focusView === 'month' && formatDate(selectedDateObj, 'MMMM yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isToday && focusView === 'day' && (
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200"
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
            <div className="flex items-center justify-between bg-white rounded-xl border border-neutral-200 p-4">
              <button
                onClick={() => navigateDay(-1)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="text-center">
                <p className="text-lg font-medium text-neutral-800">
                  {formatDate(selectedDateObj, 'EEEE')}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatDate(selectedDateObj, 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => navigateDay(1)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Currently Focusing On */}
            {isToday && scheduledActions.length > 0 && (
              <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-primary-400" />
                  <h2 className="text-lg font-semibold text-neutral-900">Currently Focusing On</h2>
                </div>
                <div className="space-y-3">
                  {scheduledActions.slice(0, 3).map(({ action, goal }) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-neutral-100"
                    >
                      <button
                        onClick={() => toggleActionComplete(goal.id, action.id)}
                        className="w-7 h-7 rounded-full border-2 border-primary-400 flex items-center justify-center hover:bg-primary-50 transition-colors flex-shrink-0"
                      >
                        {action.status === 'done' && <Check className="w-4 h-4 text-primary-500" />}
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-800">{action.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Target className="w-3 h-3 text-neutral-400" />
                          <p className="text-xs text-neutral-500">{goal.objective}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {scheduledActions.length > 3 && (
                  <p className="text-center text-sm text-neutral-500 mt-4">
                    +{scheduledActions.length - 3} more actions scheduled
                  </p>
                )}
              </div>
            )}

            {/* No Focus Message */}
            {isToday && scheduledActions.length === 0 && (
              <div className="bg-neutral-100 rounded-2xl border border-neutral-200 p-6 text-center">
                <Star className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-700 font-medium">Nothing scheduled for today</p>
                <p className="text-sm text-neutral-500 mt-1">Visit your goals and set something to focus on!</p>
              </div>
            )}

            {/* Energy Check-in */}
            {isToday && (
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Battery className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">Energy Level</span>
                </div>
                <div className="flex gap-2">
                  {energyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => updateTodayEnergy(level.value)}
                      className={cn(
                        "flex-1 py-3 rounded-lg text-xs font-medium transition-all text-center",
                        todayContext?.energy_level === level.value
                          ? "bg-primary-400 text-white shadow-md"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Journal Prompts */}
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
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-700">Scheduled Actions</span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {scheduledActions.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {scheduledActions.map(({ action, goal }) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                    >
                      <button
                        onClick={() => toggleActionComplete(goal.id, action.id)}
                        className="w-5 h-5 rounded border-2 border-neutral-300 flex items-center justify-center hover:border-primary-400 transition-colors flex-shrink-0"
                      >
                        {action.status === 'done' && <Check className="w-3 h-3 text-primary-500" />}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-700">{action.text}</p>
                        <p className="text-xs text-neutral-400">{goal.objective}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isToday && scheduledActions.length === 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                <p className="text-neutral-500">No actions scheduled for this day.</p>
              </div>
            )}
          </div>
        )}

        {/* Week View */}
        {focusView === 'week' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-neutral-200 p-4">
              <button
                onClick={() => navigateDay(-7)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="text-center">
                <p className="text-lg font-medium text-neutral-800">
                  {formatDate(new Date(weekDays[0] + 'T12:00:00'), 'MMM d')} - {formatDate(new Date(weekDays[6] + 'T12:00:00'), 'MMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => navigateDay(7)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <JournalPrompt type="weekly_planning" />

            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
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
                        ? "border-primary-400 bg-primary-50"
                        : isTodayDate
                        ? "border-primary-300 bg-primary-50/50"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium mb-2",
                      isTodayDate || isSelected ? "text-primary-600" : "text-neutral-700"
                    )}>
                      {new Date(date + 'T12:00:00').getDate()}
                    </span>
                    {dayActions.length > 0 && (
                      <div className="space-y-1 mt-auto">
                        {dayActions.slice(0, 2).map(({ action }) => (
                          <div
                            key={action.id}
                            className="text-xs text-neutral-600 bg-neutral-100 rounded px-1.5 py-0.5 truncate"
                          >
                            {action.text}
                          </div>
                        ))}
                        {dayActions.length > 2 && (
                          <span className="text-xs text-neutral-400">
                            +{dayActions.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDateObj.getDay() === 0 || selectedDateObj.getDay() === 6 ? (
              <JournalPrompt type="weekly_review" />
            ) : null}
          </div>
        )}

        {/* Month View */}
        {focusView === 'month' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white rounded-xl border border-neutral-200 p-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <p className="text-lg font-medium text-neutral-800">
                {formatDate(selectedDateObj, 'MMMM yyyy')}
              </p>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="grid grid-cols-7 gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
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
                          ? "bg-primary-400 text-white"
                          : isTodayDate
                          ? "bg-primary-100 text-primary-700"
                          : "hover:bg-neutral-100 text-neutral-700"
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
                                isSelected ? "bg-white/70" : "bg-primary-400"
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

            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h3 className="font-medium text-neutral-800 mb-3">
                {formatDate(selectedDateObj, 'MMMM')} Overview
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold text-neutral-800">
                    {goals.filter(g => g.status === 'active').length}
                  </p>
                  <p className="text-xs text-neutral-500">Active Goals</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600">
                    {goals.reduce((acc, g) => acc + g.actions.filter(a => a.status === 'done').length, 0)}
                  </p>
                  <p className="text-xs text-neutral-500">Actions Done</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <p className="text-2xl font-bold text-neutral-600">
                    {goals.reduce((acc, g) => acc + g.actions.filter(a => a.status === 'pending' || a.status === 'scheduled').length, 0)}
                  </p>
                  <p className="text-xs text-neutral-500">Remaining</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
