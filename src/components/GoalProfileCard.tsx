'use client';

import { useState } from 'react';
import { cn, getCategoryIcon, generateId } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { Goal, GoalAction } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  MoreHorizontal,
  Archive,
  Trash2,
  Star,
  Calendar,
} from 'lucide-react';

interface GoalProfileCardProps {
  goal: Goal;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex: number;
  totalGoals: number;
}

export function GoalProfileCard({
  goal,
  onNext,
  onPrev,
  currentIndex,
  totalGoals,
}: GoalProfileCardProps) {
  const {
    updateGoal,
    deleteGoal,
    addGoalAction,
    toggleActionComplete,
    updateGoalAction,
    scheduleAction,
    updateSuccessMeasure,
  } = useAppStore();

  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  // Find the focused action (first scheduled or first pending)
  const focusedAction = goal.actions.find(a => a.status === 'scheduled')
    || goal.actions.find(a => a.status === 'pending');

  const pendingActions = goal.actions.filter(a => a.status === 'pending' || a.status === 'scheduled');
  const completedActions = goal.actions.filter(a => a.status === 'done');

  // Calculate overall progress
  const totalProgress = goal.success_measures.reduce((acc, m) => {
    return acc + (m.current / m.target);
  }, 0);
  const progressPercent = goal.success_measures.length > 0
    ? Math.round((totalProgress / goal.success_measures.length) * 100)
    : 0;

  const handleAddAction = () => {
    if (!newActionText.trim()) return;

    const action: GoalAction = {
      id: generateId(),
      text: newActionText.trim(),
      status: 'pending',
      priority: 'medium',
      goal_id: goal.id,
    };

    addGoalAction(goal.id, action);
    setNewActionText('');
    setShowAddAction(false);
  };

  const setAsFocus = (actionId: string) => {
    // Set this action as scheduled (focused)
    const today = new Date().toISOString().split('T')[0];
    scheduleAction(goal.id, actionId, today);
  };

  const incrementMeasure = (measureId: string, amount: number) => {
    const measure = goal.success_measures.find(m => m.id === measureId);
    if (measure) {
      const newValue = Math.max(0, Math.min(measure.target, measure.current + amount));
      updateSuccessMeasure(goal.id, measureId, { current: newValue });
    }
  };

  return (
    <div className="relative max-w-md mx-auto">
      {/* Navigation Arrows */}
      {totalGoals > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 p-3 rounded-full bg-white border border-warm-200 shadow-md hover:bg-warm-50 hover:scale-105 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-warm-600" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 p-3 rounded-full bg-white border border-warm-200 shadow-md hover:bg-warm-50 hover:scale-105 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-warm-600" />
          </button>
        </>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-warm-200 shadow-lg overflow-hidden">
        {/* Header with Category */}
        <div className="bg-gradient-to-r from-warm-100 to-accent-50 px-6 py-4 border-b border-warm-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
              <span className="text-sm font-medium text-warm-600 capitalize">{goal.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-warm-500">
                {currentIndex + 1} of {totalGoals}
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-warm-500" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 w-40 bg-white border border-warm-200 rounded-xl shadow-lg py-1 z-20">
                    <button
                      onClick={() => {
                        updateGoal(goal.id, { status: 'backlogged' });
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-warm-50 flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      Backlog
                    </button>
                    <button
                      onClick={() => {
                        deleteGoal(goal.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-warm-50 flex items-center gap-2 text-accent-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Objective */}
        <div className="px-6 py-5 border-b border-warm-100">
          <h2 className="text-xl font-serif font-semibold text-warm-900 leading-tight">
            {goal.objective}
          </h2>
          {goal.why && (
            <p className="mt-2 text-sm text-warm-500 italic">"{goal.why}"</p>
          )}
        </div>

        {/* Focusing On - Current Action */}
        {focusedAction && (
          <div className="px-6 py-4 bg-accent-50 border-b border-accent-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-semibold text-accent-600 uppercase tracking-wide">Focusing On</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActionComplete(goal.id, focusedAction.id)}
                className="w-6 h-6 rounded-full border-2 border-accent-400 flex items-center justify-center hover:bg-accent-100 transition-colors flex-shrink-0"
              >
                {focusedAction.status === 'done' && <Check className="w-4 h-4 text-accent-500" />}
              </button>
              <span className="text-warm-800 font-medium">{focusedAction.text}</span>
            </div>
          </div>
        )}

        {/* Success Measures */}
        <div className="px-6 py-4 border-b border-warm-100">
          <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-3">
            Success Measures
          </h3>
          {goal.success_measures.length > 0 ? (
            <div className="space-y-3">
              {goal.success_measures.map((measure) => (
                <div key={measure.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-warm-700">{measure.metric}</span>
                      <span className="text-sm font-medium text-warm-800">
                        {measure.current}/{measure.target}
                      </span>
                    </div>
                    <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((measure.current / measure.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => incrementMeasure(measure.id, -1)}
                      className="w-7 h-7 rounded-lg bg-warm-100 text-warm-600 hover:bg-warm-200 text-sm font-medium"
                    >
                      -
                    </button>
                    <button
                      onClick={() => incrementMeasure(measure.id, 1)}
                      className="w-7 h-7 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-400 italic">No measures defined</p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-b border-warm-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wide">
              Actions ({completedActions.length}/{goal.actions.length})
            </h3>
            <button
              onClick={() => setShowAddAction(true)}
              className="p-1 hover:bg-warm-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-warm-500" />
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className={cn(
                  "group flex items-center gap-3 p-2 rounded-lg transition-colors",
                  action.status === 'scheduled' ? "bg-accent-50" : "hover:bg-warm-50"
                )}
              >
                <button
                  onClick={() => toggleActionComplete(goal.id, action.id)}
                  className="w-5 h-5 rounded border-2 border-warm-300 flex items-center justify-center hover:border-sage-400 transition-colors flex-shrink-0"
                />
                <span className="flex-1 text-sm text-warm-700">{action.text}</span>
                {action.status !== 'scheduled' && (
                  <button
                    onClick={() => setAsFocus(action.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-warm-100 rounded transition-all"
                    title="Set as focus"
                  >
                    <Star className="w-3.5 h-3.5 text-warm-400" />
                  </button>
                )}
              </div>
            ))}

            {completedActions.length > 0 && (
              <div className="pt-2 mt-2 border-t border-warm-100">
                {completedActions.slice(0, 2).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 p-2 opacity-50"
                  >
                    <div className="w-5 h-5 rounded bg-sage-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-sage-500" />
                    </div>
                    <span className="flex-1 text-sm text-warm-500 line-through">{action.text}</span>
                  </div>
                ))}
                {completedActions.length > 2 && (
                  <p className="text-xs text-warm-400 pl-8">+{completedActions.length - 2} more completed</p>
                )}
              </div>
            )}

            {goal.actions.length === 0 && !showAddAction && (
              <p className="text-sm text-warm-400 italic text-center py-2">
                No actions yet
              </p>
            )}
          </div>

          {/* Add Action Form */}
          {showAddAction && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add an action..."
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                className="flex-1 px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
                autoFocus
              />
              <button
                onClick={handleAddAction}
                className="px-3 py-2 bg-accent-500 text-white text-sm rounded-lg hover:bg-accent-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddAction(false);
                  setNewActionText('');
                }}
                className="px-2 py-2 text-warm-500 text-sm hover:bg-warm-100 rounded-lg"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar at Bottom */}
        <div className="px-6 py-4 bg-warm-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-warm-600">Overall Progress</span>
            <span className={cn(
              "text-sm font-bold",
              progressPercent >= 75 ? "text-sage-600" :
              progressPercent >= 40 ? "text-warm-600" :
              "text-accent-600"
            )}>
              {progressPercent}%
            </span>
          </div>
          <div className="h-3 bg-warm-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                progressPercent >= 75 ? "bg-sage-500" :
                progressPercent >= 40 ? "bg-warm-500" :
                "bg-accent-500"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      {totalGoals > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalGoals }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                i === currentIndex
                  ? "bg-accent-500 scale-110"
                  : "bg-warm-300 hover:bg-warm-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
