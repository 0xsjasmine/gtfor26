'use client';

import { useState } from 'react';
import { cn, getCategoryIcon, generateId } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { Goal, GoalAction, GoalCategory, SuccessMeasure } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  MoreHorizontal,
  Archive,
  Trash2,
  Star,
  X,
} from 'lucide-react';

interface GoalProfileCardProps {
  goal?: Goal;
  isNew?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalGoals?: number;
  onCancel?: () => void;
  onSave?: (goal: Goal) => void;
}

const categories: GoalCategory[] = ['work', 'personal', 'creative', 'relationships', 'health', 'learning'];

const categoryGradients: Record<string, string> = {
  work: 'from-amber-100 to-orange-50',
  personal: 'from-rose-100 to-pink-50',
  creative: 'from-violet-100 to-purple-50',
  relationships: 'from-red-100 to-rose-50',
  health: 'from-emerald-100 to-green-50',
  learning: 'from-blue-100 to-cyan-50',
};

export function GoalProfileCard({
  goal,
  isNew = false,
  onNext,
  onPrev,
  currentIndex = 0,
  totalGoals = 1,
  onCancel,
  onSave,
}: GoalProfileCardProps) {
  const {
    updateGoal,
    deleteGoal,
    addGoalAction,
    toggleActionComplete,
    scheduleAction,
    updateSuccessMeasure,
    addSuccessMeasure,
  } = useAppStore();

  // Editable state for new goals
  const [objective, setObjective] = useState(goal?.objective || '');
  const [why, setWhy] = useState(goal?.why || '');
  const [category, setCategory] = useState<GoalCategory>(goal?.category || 'work');
  const [measures, setMeasures] = useState<SuccessMeasure[]>(goal?.success_measures || []);
  const [newMeasureName, setNewMeasureName] = useState('');
  const [newMeasureTarget, setNewMeasureTarget] = useState(10);

  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showAddMeasure, setShowAddMeasure] = useState(isNew);

  const actions = goal?.actions || [];
  const focusedAction = actions.find(a => a.status === 'scheduled')
    || actions.find(a => a.status === 'pending');
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'scheduled');
  const completedActions = actions.filter(a => a.status === 'done');

  const displayMeasures = isNew ? measures : (goal?.success_measures || []);

  const totalProgress = displayMeasures.reduce((acc, m) => {
    return acc + (m.current / m.target);
  }, 0);
  const progressPercent = displayMeasures.length > 0
    ? Math.round((totalProgress / displayMeasures.length) * 100)
    : 0;

  const handleAddAction = () => {
    if (!newActionText.trim() || !goal) return;

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
    if (!goal) return;
    const today = new Date().toISOString().split('T')[0];
    scheduleAction(goal.id, actionId, today);
  };

  const incrementMeasure = (measureId: string, amount: number) => {
    if (isNew) {
      setMeasures(prev => prev.map(m =>
        m.id === measureId
          ? { ...m, current: Math.max(0, Math.min(m.target, m.current + amount)) }
          : m
      ));
    } else if (goal) {
      const measure = goal.success_measures.find(m => m.id === measureId);
      if (measure) {
        const newValue = Math.max(0, Math.min(measure.target, measure.current + amount));
        updateSuccessMeasure(goal.id, measureId, { current: newValue });
      }
    }
  };

  const handleAddMeasure = () => {
    if (!newMeasureName.trim()) return;

    const newMeasure: SuccessMeasure = {
      id: generateId(),
      metric: newMeasureName.trim(),
      target: newMeasureTarget,
      current: 0,
    };

    if (isNew) {
      setMeasures(prev => [...prev, newMeasure]);
    } else if (goal) {
      addSuccessMeasure(goal.id, newMeasure);
    }

    setNewMeasureName('');
    setNewMeasureTarget(10);
    setShowAddMeasure(false);
  };

  const removeMeasure = (measureId: string) => {
    setMeasures(prev => prev.filter(m => m.id !== measureId));
  };

  const handleSave = () => {
    if (!objective.trim()) return;

    const newGoal: Goal = {
      id: generateId(),
      user_id: '',
      quarter: '',
      category,
      objective: objective.trim(),
      why: why.trim(),
      status: 'active',
      success_measures: measures,
      actions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave?.(newGoal);
  };

  return (
    <div className="relative">
      {/* Side Navigation Arrows */}
      {!isNew && totalGoals > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-3 rounded-full bg-white border border-warm-200 shadow-lg hover:bg-warm-50 hover:scale-105 transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6 text-warm-600" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-3 rounded-full bg-white border border-warm-200 shadow-lg hover:bg-warm-50 hover:scale-105 transition-all z-10"
          >
            <ChevronRight className="w-6 h-6 text-warm-600" />
          </button>
        </>
      )}

      {/* Hero Section */}
      <div className={cn(
        "relative rounded-2xl overflow-hidden mb-4",
        "bg-gradient-to-br",
        categoryGradients[category] || categoryGradients.work
      )}>
        {/* Menu / Cancel */}
        <div className="absolute top-4 right-4 z-10">
          {isNew ? (
            onCancel && (
              <button
                onClick={onCancel}
                className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-warm-600" />
              </button>
            )
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-white/80 hover:bg-white rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-warm-600" />
              </button>
              {showMenu && goal && (
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
          )}
        </div>

        {/* Hero Content */}
        <div className="px-8 py-10 text-center">
          {isNew ? (
            <>
              {/* Category Selector */}
              <div className="flex justify-center gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "text-2xl p-2 rounded-xl transition-all",
                      category === cat
                        ? "bg-white/80 scale-110 shadow-md"
                        : "opacity-50 hover:opacity-80"
                    )}
                  >
                    {getCategoryIcon(cat)}
                  </button>
                ))}
              </div>
              <p className="text-xs font-medium text-warm-600 uppercase tracking-wider mb-3">
                {category}
              </p>
              {/* Editable Objective */}
              <input
                type="text"
                placeholder="What's your goal?"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full text-2xl font-bold text-warm-900 bg-transparent border-none text-center focus:outline-none placeholder:text-warm-400"
              />
            </>
          ) : (
            <>
              <span className="text-5xl mb-4 block">{getCategoryIcon(category)}</span>
              <p className="text-xs font-medium text-warm-600 uppercase tracking-wider mb-2">
                {category}
              </p>
              <h1 className="text-2xl font-bold text-warm-900 leading-tight">
                {goal?.objective}
              </h1>
              {!isNew && (
                <p className="text-sm text-warm-500 mt-2">
                  {currentIndex + 1} / {totalGoals}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Motivation Card */}
        <div className="col-span-2 bg-white rounded-xl border border-warm-200 p-5">
          <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-2">
            Why This Matters
          </p>
          {isNew ? (
            <textarea
              placeholder="Your personal motivation..."
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="w-full text-warm-700 bg-transparent border-none focus:outline-none resize-none placeholder:text-warm-300"
              rows={2}
            />
          ) : (
            <p className="text-warm-700 italic">
              {goal?.why ? `"${goal.why}"` : 'No motivation set'}
            </p>
          )}
        </div>

        {/* Success Measure Cards */}
        {displayMeasures.map((measure) => {
          const measureProgress = Math.round((measure.current / measure.target) * 100);
          return (
            <div key={measure.id} className="bg-white rounded-xl border border-warm-200 p-5 relative">
              {isNew && (
                <button
                  onClick={() => removeMeasure(measure.id)}
                  className="absolute top-2 right-2 p-1 text-warm-400 hover:text-warm-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-3">
                {measure.metric}
              </p>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <span className="text-3xl font-bold text-warm-800">{measure.current}</span>
                  <span className="text-warm-400 ml-1">/ {measure.target}</span>
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  measureProgress >= 75 ? "text-sage-600" :
                  measureProgress >= 40 ? "text-warm-600" : "text-accent-600"
                )}>
                  {measureProgress}%
                </span>
              </div>
              <div className="h-2 bg-warm-100 rounded-full overflow-hidden mb-3">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    measureProgress >= 75 ? "bg-sage-400" :
                    measureProgress >= 40 ? "bg-warm-400" : "bg-accent-400"
                  )}
                  style={{ width: `${Math.min(measureProgress, 100)}%` }}
                />
              </div>
              {!isNew && (
                <div className="flex gap-2">
                  <button
                    onClick={() => incrementMeasure(measure.id, -1)}
                    className="flex-1 py-2 rounded-lg bg-warm-100 text-warm-600 hover:bg-warm-200 font-medium"
                  >
                    −
                  </button>
                  <button
                    onClick={() => incrementMeasure(measure.id, 1)}
                    className="flex-1 py-2 rounded-lg bg-sage-100 text-sage-700 hover:bg-sage-200 font-medium"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Measure Card */}
        {(isNew || showAddMeasure) && (
          <div className="bg-warm-50 rounded-xl border-2 border-dashed border-warm-300 p-5">
            <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-3">
              Add Measure
            </p>
            <input
              type="text"
              placeholder="Metric name"
              value={newMeasureName}
              onChange={(e) => setNewMeasureName(e.target.value)}
              className="w-full px-3 py-2 mb-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white"
            />
            <div className="flex gap-2 mb-3">
              <span className="text-warm-500 text-sm self-center">Target:</span>
              <input
                type="number"
                value={newMeasureTarget}
                onChange={(e) => setNewMeasureTarget(parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white"
              />
            </div>
            <button
              onClick={handleAddMeasure}
              disabled={!newMeasureName.trim()}
              className="w-full py-2 bg-accent-500 text-white text-sm rounded-lg hover:bg-accent-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}

        {/* Add Measure Button (for existing goals) */}
        {!isNew && !showAddMeasure && (
          <button
            onClick={() => setShowAddMeasure(true)}
            className="bg-warm-50 rounded-xl border-2 border-dashed border-warm-300 p-5 text-warm-500 hover:border-accent-400 hover:text-accent-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Measure
          </button>
        )}

        {/* Focusing On Card (only for existing goals) */}
        {!isNew && focusedAction && (
          <div className="col-span-2 bg-accent-50 rounded-xl border border-accent-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-accent-500" />
              <p className="text-xs font-semibold text-accent-600 uppercase tracking-wide">
                Focusing On
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => goal && toggleActionComplete(goal.id, focusedAction.id)}
                className="w-7 h-7 rounded-full border-2 border-accent-400 flex items-center justify-center hover:bg-accent-100 transition-colors flex-shrink-0"
              >
                {focusedAction.status === 'done' && <Check className="w-4 h-4 text-accent-500" />}
              </button>
              <span className="text-warm-800 font-medium text-lg">{focusedAction.text}</span>
            </div>
          </div>
        )}

        {/* Actions Card (only for existing goals) */}
        {!isNew && (
          <div className="col-span-2 bg-white rounded-xl border border-warm-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide">
                Actions ({completedActions.length}/{actions.length})
              </p>
              <button
                onClick={() => setShowAddAction(true)}
                className="p-1.5 hover:bg-warm-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-warm-500" />
              </button>
            </div>

            <div className="space-y-2">
              {pendingActions.map((action) => (
                <div
                  key={action.id}
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-lg transition-colors",
                    action.status === 'scheduled' ? "bg-accent-50 border border-accent-100" : "bg-warm-50"
                  )}
                >
                  <button
                    onClick={() => goal && toggleActionComplete(goal.id, action.id)}
                    className="w-5 h-5 rounded border-2 border-warm-300 flex items-center justify-center hover:border-sage-400 transition-colors flex-shrink-0"
                  />
                  <span className="flex-1 text-sm text-warm-700">{action.text}</span>
                  {action.status !== 'scheduled' && (
                    <button
                      onClick={() => setAsFocus(action.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-warm-200 rounded transition-all"
                      title="Set as focus"
                    >
                      <Star className="w-4 h-4 text-warm-400" />
                    </button>
                  )}
                </div>
              ))}

              {completedActions.length > 0 && (
                <div className="pt-3 mt-2 border-t border-warm-100">
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
                    <p className="text-xs text-warm-400 pl-8">+{completedActions.length - 2} more</p>
                  )}
                </div>
              )}

              {actions.length === 0 && !showAddAction && (
                <p className="text-sm text-warm-400 text-center py-4">
                  No actions yet
                </p>
              )}
            </div>

            {showAddAction && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Add an action..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                  className="flex-1 px-4 py-2 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
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
        )}

        {/* Save Button (for new goals) */}
        {isNew && (
          <div className="col-span-2">
            <button
              onClick={handleSave}
              disabled={!objective.trim() || measures.length === 0}
              className="w-full py-4 bg-accent-500 text-white rounded-xl hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              Create Goal
            </button>
          </div>
        )}

        {/* Overall Progress Card (only for existing goals) */}
        {!isNew && displayMeasures.length > 0 && (
          <div className="col-span-2 bg-warm-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-warm-600 uppercase tracking-wide">
                Overall Progress
              </p>
              <span className={cn(
                "text-2xl font-bold",
                progressPercent >= 75 ? "text-sage-600" :
                progressPercent >= 40 ? "text-warm-700" :
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
        )}
      </div>

      {/* Pagination Dots */}
      {!isNew && totalGoals > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalGoals }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentIndex
                  ? "bg-accent-500 w-6"
                  : "bg-warm-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
