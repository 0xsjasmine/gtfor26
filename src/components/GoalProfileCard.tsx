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
  Target,
  Sparkles,
  TrendingUp,
  Zap,
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

const categories: { id: GoalCategory; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'personal', label: 'Personal' },
  { id: 'creative', label: 'Creative' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'health', label: 'Health' },
  { id: 'learning', label: 'Learning' },
];

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

  // Editable state
  const [objective, setObjective] = useState(goal?.objective || '');
  const [why, setWhy] = useState(goal?.why || '');
  const [category, setCategory] = useState<GoalCategory>(goal?.category || 'work');
  const [measures, setMeasures] = useState<SuccessMeasure[]>(goal?.success_measures || []);
  const [newMeasureName, setNewMeasureName] = useState('');
  const [showAddMeasure, setShowAddMeasure] = useState(false);
  const [showAddAction, setShowAddAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const actions = goal?.actions || [];
  const displayMeasures = isNew ? measures : (goal?.success_measures || []);
  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'scheduled');
  const completedActions = actions.filter(a => a.status === 'done');

  const handleAddMeasure = () => {
    if (!newMeasureName.trim()) return;
    const newMeasure: SuccessMeasure = {
      id: generateId(),
      metric: newMeasureName.trim(),
      target: 1,
      current: 0,
    };
    if (isNew) {
      setMeasures(prev => [...prev, newMeasure]);
    } else if (goal) {
      addSuccessMeasure(goal.id, newMeasure);
    }
    setNewMeasureName('');
    setShowAddMeasure(false);
  };

  const toggleMilestone = (measureId: string) => {
    if (isNew) {
      setMeasures(prev => prev.map(m =>
        m.id === measureId
          ? { ...m, current: m.current === 0 ? 1 : 0 }
          : m
      ));
    } else if (goal) {
      const measure = goal.success_measures.find(m => m.id === measureId);
      if (measure) {
        updateSuccessMeasure(goal.id, measureId, { current: measure.current === 0 ? 1 : 0 });
      }
    }
  };

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

  const setAsFocus = (actionId: string) => {
    if (!goal) return;
    const today = new Date().toISOString().split('T')[0];
    scheduleAction(goal.id, actionId, today);
  };

  return (
    <div className="relative">
      {/* Side Navigation */}
      {!isNew && totalGoals > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-white border border-neutral-200 shadow-md hover:bg-neutral-50 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-white border border-neutral-200 shadow-md hover:bg-neutral-50 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </>
      )}

      {/* HSR-Style Layout: Hero Left + Cards Right on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Hero Section - Left Column */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl p-6 relative">
          {/* Menu */}
          <div className="absolute top-4 right-4">
            {isNew ? (
              onCancel && (
                <button onClick={onCancel} className="text-neutral-500 hover:text-neutral-700">
                  ✕
                </button>
              )
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-white/50 rounded-lg"
                >
                  <MoreHorizontal className="w-5 h-5 text-neutral-600" />
                </button>
                {showMenu && goal && (
                  <div className="absolute right-0 top-8 w-36 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20">
                    <button
                      onClick={() => { updateGoal(goal.id, { status: 'backlogged' }); setShowMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" /> Backlog
                    </button>
                    <button
                      onClick={() => { deleteGoal(goal.id); setShowMenu(false); }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 text-primary-500"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Icon */}
          <div className="text-6xl mb-4">{getCategoryIcon(category)}</div>

          {/* Objective */}
          {isNew ? (
            <input
              type="text"
              placeholder="What's your goal?"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full text-2xl font-bold text-neutral-900 bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
            />
          ) : (
            <h1 className="text-2xl font-bold text-neutral-900">{goal?.objective}</h1>
          )}

          {/* Counter */}
          {!isNew && totalGoals > 1 && (
            <p className="text-sm text-neutral-500 mt-4">{currentIndex + 1} / {totalGoals}</p>
          )}
        </div>

        {/* Cards Grid - Right Column */}
        <div className="lg:col-span-3 space-y-4">

          {/* TYPE Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Type</span>
            </div>
            {isNew ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                      category === cat.id
                        ? "bg-primary-400 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    {getCategoryIcon(cat.id)} {cat.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-neutral-700">{getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}</p>
            )}
          </div>

          {/* WHY THIS MATTERS Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Why This Matters</span>
            </div>
            {isNew ? (
              <textarea
                placeholder="Your personal motivation..."
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="w-full text-neutral-700 bg-transparent border-none focus:outline-none resize-none placeholder:text-neutral-400"
                rows={2}
              />
            ) : (
              <p className="text-neutral-700">{goal?.why || 'No motivation set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* MILESTONES Section */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary-400" />
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Milestones</span>
        </div>

        <div className="space-y-3">
          {displayMeasures.map((measure) => {
            const isComplete = measure.current >= measure.target;
            return (
              <div
                key={measure.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isComplete ? "bg-primary-50" : "bg-neutral-50"
                )}
              >
                <button
                  onClick={() => toggleMilestone(measure.id)}
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    isComplete
                      ? "bg-primary-400 border-primary-400"
                      : "border-neutral-300 hover:border-primary-400"
                  )}
                >
                  {isComplete && <Check className="w-3 h-3 text-white" />}
                </button>
                <span className={cn(
                  "flex-1 text-sm",
                  isComplete ? "text-neutral-500 line-through" : "text-neutral-700"
                )}>
                  {measure.metric}
                </span>
                {isNew && (
                  <button
                    onClick={() => removeMeasure(measure.id)}
                    className="text-neutral-400 hover:text-neutral-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Milestone Input */}
          {(isNew || showAddMeasure) ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-neutral-200">
              <div className="w-5 h-5 rounded-full border-2 border-neutral-200 flex-shrink-0" />
              <input
                type="text"
                placeholder="Add a milestone..."
                value={newMeasureName}
                onChange={(e) => setNewMeasureName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMeasure()}
                className="flex-1 text-sm bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
                autoFocus={showAddMeasure}
              />
              {newMeasureName.trim() && (
                <button
                  onClick={handleAddMeasure}
                  className="text-primary-400 hover:text-primary-500 text-sm font-medium"
                >
                  Add
                </button>
              )}
              {!isNew && (
                <button
                  onClick={() => { setShowAddMeasure(false); setNewMeasureName(''); }}
                  className="text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAddMeasure(true)}
              className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-primary-300 hover:text-primary-400 transition-colors w-full"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add milestone</span>
            </button>
          )}
        </div>
      </div>

      {/* ACTIONS Card - Full Width */}
      {!isNew && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">
                Actions ({completedActions.length}/{actions.length})
              </span>
            </div>
            <button
              onClick={() => setShowAddAction(true)}
              className="p-1.5 hover:bg-neutral-100 rounded-lg"
            >
              <Plus className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  action.status === 'scheduled'
                    ? "bg-primary-50 border-primary-200"
                    : "bg-neutral-50 border-neutral-200 hover:border-primary-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => goal && toggleActionComplete(goal.id, action.id)}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-neutral-300 flex items-center justify-center hover:border-primary-400 transition-colors flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-700">{action.text}</p>
                    {action.status !== 'scheduled' && (
                      <button
                        onClick={() => setAsFocus(action.id)}
                        className="text-xs text-primary-400 hover:text-primary-500 mt-2"
                      >
                        Set as focus →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add Action Inline */}
            {showAddAction ? (
              <div className="p-4 rounded-xl border-2 border-dashed border-neutral-300">
                <input
                  type="text"
                  placeholder="New action..."
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAction}
                    className="flex-1 py-1.5 bg-primary-400 text-white text-sm rounded-lg hover:bg-primary-500"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => { setShowAddAction(false); setNewActionText(''); }}
                    className="px-3 py-1.5 text-neutral-500 text-sm hover:bg-neutral-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddAction(true)}
                className="p-4 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-primary-400 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Action
              </button>
            )}
          </div>

          {/* Completed Actions */}
          {completedActions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 mb-2">Completed</p>
              <div className="space-y-2">
                {completedActions.slice(0, 3).map((action) => (
                  <div key={action.id} className="flex items-center gap-2 text-sm text-neutral-400">
                    <Check className="w-4 h-4" />
                    <span className="line-through">{action.text}</span>
                  </div>
                ))}
                {completedActions.length > 3 && (
                  <p className="text-xs text-neutral-400">+{completedActions.length - 3} more</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BONUS WINS Card - Full Width */}
      {!isNew && (
        <div className="bg-white rounded-xl border border-neutral-200 p-5 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Bonus Wins</span>
          </div>
          <p className="text-neutral-400 text-sm">Track unexpected positive outcomes and ripple effects...</p>
        </div>
      )}

      {/* Save Button for New Goals */}
      {isNew && (
        <button
          onClick={handleSave}
          disabled={!objective.trim()}
          className="w-full mt-6 py-4 bg-primary-400 text-white rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          Create Goal
        </button>
      )}

      {/* Pagination Dots */}
      {!isNew && totalGoals > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalGoals }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentIndex ? "bg-primary-400 w-6" : "bg-neutral-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
