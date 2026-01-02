'use client';

import { useState } from 'react';
import { cn, getCategoryIcon, generateId } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { Goal, GoalAction, SuccessMeasure, ActionPriority } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Target,
  Heart,
  Sparkles,
  ListTodo,
  MoreHorizontal,
  Archive,
  Trash2,
  Calendar,
} from 'lucide-react';

interface BentoGoalCardProps {
  goal: Goal;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex: number;
  totalGoals: number;
}

export function BentoGoalCard({
  goal,
  onNext,
  onPrev,
  currentIndex,
  totalGoals,
}: BentoGoalCardProps) {
  const {
    updateGoal,
    deleteGoal,
    addGoalAction,
    toggleActionComplete,
    updateSuccessMeasure,
    scheduleAction,
  } = useAppStore();

  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  const pendingActions = goal.actions.filter(a => a.status === 'pending' || a.status === 'scheduled');
  const completedActions = goal.actions.filter(a => a.status === 'done');
  const completedCount = completedActions.length;
  const totalActions = goal.actions.length;

  // Calculate overall progress from success measures
  const totalProgress = goal.success_measures.reduce((acc, m) => {
    return acc + (m.current / m.target);
  }, 0);
  const avgProgress = goal.success_measures.length > 0
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

  const handleScheduleAction = (actionId: string) => {
    const today = new Date().toISOString().split('T')[0];
    scheduleAction(goal.id, actionId, today);
    setSelectedActionId(null);
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {totalGoals > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white border border-warm-200 shadow-sm hover:bg-warm-50 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-warm-600" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white border border-warm-200 shadow-sm hover:bg-warm-50 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-warm-600" />
          </button>
        </>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Objective Box (spans full width) */}
        <div className="col-span-2 bg-white rounded-2xl border border-warm-200 p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warm-100">
                <Target className="w-5 h-5 text-warm-600" />
              </div>
              <div>
                <span className="text-xs font-medium text-warm-500 uppercase tracking-wide">Objective</span>
                <span className="text-xs text-warm-400 ml-2">{getCategoryIcon(goal.category)} {goal.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Progress Pill */}
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                avgProgress >= 75 ? "bg-sage-100 text-sage-700" :
                avgProgress >= 40 ? "bg-warm-100 text-warm-700" :
                "bg-accent-100 text-accent-700"
              )}>
                {avgProgress}%
              </div>
              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-warm-100 rounded-lg"
                >
                  <MoreHorizontal className="w-5 h-5 text-warm-400" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 w-40 bg-white border border-warm-200 rounded-xl shadow-lg py-1 z-20">
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
          <h2 className="text-xl font-serif font-semibold text-warm-900">
            {goal.objective}
          </h2>
        </div>

        {/* Why Box */}
        <div className="bg-gradient-to-br from-accent-50 to-warm-50 rounded-2xl border border-accent-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-accent-500" />
            <span className="text-xs font-medium text-accent-600 uppercase tracking-wide">Why This Matters</span>
          </div>
          <p className="text-warm-700 text-sm leading-relaxed">
            {goal.why || "Add your motivation..."}
          </p>
        </div>

        {/* Success Measures Box */}
        <div className="bg-white rounded-2xl border border-warm-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-sage-500" />
            <span className="text-xs font-medium text-sage-600 uppercase tracking-wide">Success Measures</span>
          </div>
          {goal.success_measures.length > 0 ? (
            <div className="space-y-3">
              {goal.success_measures.map((measure) => (
                <div key={measure.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-warm-700">{measure.metric}</span>
                    <span className="text-warm-500 font-medium">
                      {measure.current}/{measure.target} {measure.unit || ''}
                    </span>
                  </div>
                  <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((measure.current / measure.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-warm-400 text-sm italic">No measures defined yet</p>
          )}
        </div>

        {/* Actions Box (spans full width) */}
        <div className="col-span-2 bg-white rounded-2xl border border-warm-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-warm-500" />
              <span className="text-xs font-medium text-warm-500 uppercase tracking-wide">Actions</span>
              <span className="text-xs text-warm-400">
                {completedCount}/{totalActions} done
              </span>
            </div>
            <button
              onClick={() => setShowAddAction(true)}
              className="p-1 hover:bg-warm-100 rounded-lg"
            >
              <Plus className="w-4 h-4 text-warm-500" />
            </button>
          </div>

          {/* Action List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className="group flex items-center gap-3 p-2 rounded-lg hover:bg-warm-50 transition-colors"
              >
                <button
                  onClick={() => toggleActionComplete(goal.id, action.id)}
                  className="w-5 h-5 rounded border-2 border-warm-300 flex items-center justify-center hover:border-sage-400 transition-colors flex-shrink-0"
                >
                  {action.status === 'done' && <Check className="w-3 h-3 text-sage-500" />}
                </button>
                <span className="flex-1 text-sm text-warm-700">{action.text}</span>
                {action.scheduled_date && (
                  <span className="text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded">
                    Scheduled
                  </span>
                )}
                <button
                  onClick={() => handleScheduleAction(action.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-warm-100 rounded transition-opacity"
                  title="Schedule for today"
                >
                  <Calendar className="w-3.5 h-3.5 text-warm-400" />
                </button>
              </div>
            ))}

            {completedActions.length > 0 && (
              <div className="pt-2 border-t border-warm-100">
                <p className="text-xs text-warm-400 mb-2">Completed</p>
                {completedActions.slice(0, 3).map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 p-2 rounded-lg opacity-60"
                  >
                    <div className="w-5 h-5 rounded bg-sage-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-sage-500" />
                    </div>
                    <span className="flex-1 text-sm text-warm-500 line-through">{action.text}</span>
                  </div>
                ))}
              </div>
            )}

            {goal.actions.length === 0 && !showAddAction && (
              <p className="text-warm-400 text-sm italic text-center py-4">
                No actions yet. Add some to get started!
              </p>
            )}
          </div>

          {/* Add Action Form */}
          {showAddAction && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="What's the next action?"
                value={newActionText}
                onChange={(e) => setNewActionText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                className="flex-1 px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
                autoFocus
              />
              <button
                onClick={handleAddAction}
                className="px-4 py-2 bg-accent-500 text-white text-sm rounded-lg hover:bg-accent-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddAction(false);
                  setNewActionText('');
                }}
                className="px-3 py-2 text-warm-500 text-sm hover:bg-warm-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Dots */}
      {totalGoals > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalGoals }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i === currentIndex ? "bg-accent-500" : "bg-warm-200"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
