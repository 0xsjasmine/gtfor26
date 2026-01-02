'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { BentoGoalCard } from './BentoGoalCard';
import { AntiGoalCard } from './AntiGoalCard';
import { getCurrentQuarter, formatDate, getCategoryIcon, generateId } from '@/lib/utils';
import type { GoalsView, GoalCategory, Goal, AntiGoal, SuccessMeasure, GoalAction } from '@/types';
import { Plus, X, Target, Sparkles, ListTodo } from 'lucide-react';

const goalsViews: { id: GoalsView; label: string }[] = [
  { id: 'quarter', label: 'Quarter' },
  { id: 'month', label: 'Month' },
  { id: 'backlog', label: 'Backlog' },
];

const categories: GoalCategory[] = ['work', 'personal', 'creative', 'relationships', 'health', 'learning'];

export function GoalsContent() {
  const {
    goalsView,
    setGoalsView,
    goals,
    antiGoals,
    backlogItems,
    currentQuarter,
    addGoal,
    addAntiGoal,
    currentGoalIndex,
    setCurrentGoalIndex,
    nextGoal,
    prevGoal,
    updateGoal,
  } = useAppStore();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddAntiGoal, setShowAddAntiGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    objective: '',
    why: '',
    category: 'work' as GoalCategory,
    successMeasure: '',
    successTarget: 10,
    successUnit: '',
  });
  const [newAntiGoal, setNewAntiGoal] = useState('');

  const quarter = currentQuarter || getCurrentQuarter();
  const activeGoals = goals.filter((g) => g.status === 'active');
  const backloggedGoals = goals.filter((g) => g.status === 'backlogged');
  const currentGoal = activeGoals[currentGoalIndex];

  // Calculate overall progress
  const totalMeasures = activeGoals.reduce((sum, g) => sum + g.success_measures.length, 0);
  const completedMeasures = activeGoals.reduce((sum, g) => {
    return sum + g.success_measures.filter(m => m.current >= m.target).length;
  }, 0);
  const overallProgress = totalMeasures > 0 ? Math.round((completedMeasures / totalMeasures) * 100) : 0;

  const handleAddGoal = () => {
    if (!newGoal.objective.trim()) return;

    const successMeasure: SuccessMeasure = {
      id: generateId(),
      metric: newGoal.successMeasure || 'Progress',
      target: newGoal.successTarget,
      current: 0,
      unit: newGoal.successUnit,
    };

    const goal: Goal = {
      id: generateId(),
      user_id: '',
      quarter,
      category: newGoal.category,
      objective: newGoal.objective,
      why: newGoal.why,
      status: 'active',
      success_measures: [successMeasure],
      actions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addGoal(goal);
    setNewGoal({
      objective: '',
      why: '',
      category: 'work',
      successMeasure: '',
      successTarget: 10,
      successUnit: '',
    });
    setShowAddGoal(false);
  };

  const handleAddAntiGoal = () => {
    if (!newAntiGoal.trim()) return;

    const antiGoal: AntiGoal = {
      id: generateId(),
      user_id: '',
      quarter,
      description: newAntiGoal,
      created_at: new Date().toISOString(),
    };

    addAntiGoal(antiGoal);
    setNewAntiGoal('');
    setShowAddAntiGoal(false);
  };

  return (
    <div className="h-full overflow-auto p-6 bg-warm-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-warm-900">Goals</h1>
            <p className="text-warm-500">{quarter}</p>
          </div>
          <ViewToggle
            views={goalsViews}
            activeView={goalsView}
            onChange={setGoalsView}
          />
        </div>

        {goalsView === 'quarter' && (
          <>
            {/* Overview Stats */}
            {activeGoals.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-warm-200 p-4 text-center">
                  <p className="text-3xl font-bold text-warm-800">{activeGoals.length}</p>
                  <p className="text-xs text-warm-500 mt-1">Active Goals</p>
                </div>
                <div className="bg-white rounded-xl border border-warm-200 p-4 text-center">
                  <p className="text-3xl font-bold text-sage-600">{overallProgress}%</p>
                  <p className="text-xs text-warm-500 mt-1">Overall Progress</p>
                </div>
                <div className="bg-white rounded-xl border border-warm-200 p-4 text-center">
                  <p className="text-3xl font-bold text-accent-600">
                    {activeGoals.reduce((sum, g) => sum + g.actions.filter(a => a.status === 'done').length, 0)}
                  </p>
                  <p className="text-xs text-warm-500 mt-1">Actions Completed</p>
                </div>
              </div>
            )}

            {/* Goal Carousel */}
            {currentGoal && (
              <div className="mb-8 px-12">
                <BentoGoalCard
                  goal={currentGoal}
                  onNext={nextGoal}
                  onPrev={prevGoal}
                  currentIndex={currentGoalIndex}
                  totalGoals={activeGoals.length}
                />
              </div>
            )}

            {/* Goal Selector Pills */}
            {activeGoals.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {activeGoals.map((goal, index) => (
                  <button
                    key={goal.id}
                    onClick={() => setCurrentGoalIndex(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      index === currentGoalIndex
                        ? 'bg-accent-500 text-white'
                        : 'bg-white border border-warm-200 text-warm-600 hover:border-accent-300'
                    }`}
                  >
                    {getCategoryIcon(goal.category)} {goal.objective.slice(0, 30)}
                    {goal.objective.length > 30 ? '...' : ''}
                  </button>
                ))}
              </div>
            )}

            {/* Add Goal Button */}
            {!showAddGoal ? (
              <button
                onClick={() => setShowAddGoal(true)}
                className="w-full p-6 border-2 border-dashed border-warm-300 rounded-2xl text-warm-500 hover:border-accent-400 hover:text-accent-600 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Goal
              </button>
            ) : (
              <div className="bg-white rounded-2xl border border-warm-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-warm-800">Create New Goal</h3>
                  <button onClick={() => setShowAddGoal(false)}>
                    <X className="w-5 h-5 text-warm-400" />
                  </button>
                </div>
                <div className="space-y-5">
                  {/* Objective */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-700 mb-2">
                      <Target className="w-4 h-4" />
                      What's your objective?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Launch my podcast"
                      value={newGoal.objective}
                      onChange={(e) => setNewGoal({ ...newGoal, objective: e.target.value })}
                      className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-400"
                    />
                  </div>

                  {/* Why */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-700 mb-2">
                      <Sparkles className="w-4 h-4" />
                      Why does this matter to you?
                    </label>
                    <textarea
                      placeholder="Your personal motivation..."
                      value={newGoal.why}
                      onChange={(e) => setNewGoal({ ...newGoal, why: e.target.value })}
                      className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-400 resize-none"
                      rows={2}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm font-medium text-warm-700 mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setNewGoal({ ...newGoal, category: cat })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newGoal.category === cat
                              ? 'bg-accent-500 text-white'
                              : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                          }`}
                        >
                          {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Success Measure */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-700 mb-2">
                      <ListTodo className="w-4 h-4" />
                      How will you measure success?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Metric name"
                        value={newGoal.successMeasure}
                        onChange={(e) => setNewGoal({ ...newGoal, successMeasure: e.target.value })}
                        className="col-span-2 px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-400"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Target"
                          value={newGoal.successTarget}
                          onChange={(e) => setNewGoal({ ...newGoal, successTarget: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddGoal}
                    disabled={!newGoal.objective.trim()}
                    className="w-full py-3 bg-accent-500 text-white rounded-xl hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Create Goal
                  </button>
                </div>
              </div>
            )}

            {/* No goals message */}
            {activeGoals.length === 0 && !showAddGoal && (
              <div className="text-center py-12 bg-white rounded-xl border border-warm-200 mb-8">
                <Target className="w-12 h-12 text-warm-300 mx-auto mb-4" />
                <p className="text-warm-700 mb-2">No goals yet for this quarter.</p>
                <p className="text-sm text-warm-500">
                  Start by adding your first goal above!
                </p>
              </div>
            )}

            {/* Anti-Goals Section */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-warm-800 mb-2">Anti-Goals</h2>
              <p className="text-sm text-warm-500 mb-4">Who you're choosing NOT to become this quarter.</p>

              {antiGoals.length > 0 && (
                <div className="space-y-3 mb-4">
                  {antiGoals.map((antiGoal) => (
                    <AntiGoalCard key={antiGoal.id} antiGoal={antiGoal} />
                  ))}
                </div>
              )}

              {!showAddAntiGoal ? (
                <button
                  onClick={() => setShowAddAntiGoal(true)}
                  className="w-full p-4 border-2 border-dashed border-accent-200 rounded-xl text-accent-400 hover:border-accent-400 hover:text-accent-600 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Anti-Goal
                </button>
              ) : (
                <div className="p-4 bg-accent-50 rounded-xl border border-accent-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-accent-800">New Anti-Goal</h3>
                    <button onClick={() => setShowAddAntiGoal(false)}>
                      <X className="w-5 h-5 text-accent-400" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder='e.g., "Not the person who says yes to everything"'
                    value={newAntiGoal}
                    onChange={(e) => setNewAntiGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-accent-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-400 mb-3"
                  />
                  <button
                    onClick={handleAddAntiGoal}
                    className="w-full py-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600"
                  >
                    Add Anti-Goal
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {goalsView === 'month' && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-warm-800 mb-3">
                {formatDate(new Date(), 'MMMM yyyy')} Focus
              </h2>
              {activeGoals.length > 0 ? (
                <div className="space-y-4">
                  {activeGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="bg-white rounded-xl border border-warm-200 p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-xs text-warm-500">
                            {getCategoryIcon(goal.category)} {goal.category}
                          </span>
                          <h3 className="font-medium text-warm-800 mt-1">{goal.objective}</h3>
                        </div>
                        <span className="text-sm font-medium text-sage-600">
                          {goal.actions.filter(a => a.status === 'done').length}/{goal.actions.length} done
                        </span>
                      </div>
                      {goal.actions.length > 0 && (
                        <div className="space-y-2">
                          {goal.actions.slice(0, 3).map((action) => (
                            <div
                              key={action.id}
                              className="flex items-center gap-2 text-sm text-warm-600"
                            >
                              <span className={action.status === 'done' ? 'line-through opacity-50' : ''}>
                                • {action.text}
                              </span>
                            </div>
                          ))}
                          {goal.actions.length > 3 && (
                            <p className="text-xs text-warm-400">+{goal.actions.length - 3} more actions</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-warm-500 text-center py-8">No active goals this month.</p>
              )}
            </div>
          </>
        )}

        {goalsView === 'backlog' && (
          <>
            <p className="text-warm-600 mb-6 italic">
              Items you've consciously deprioritized. Later, not never.
            </p>

            {backloggedGoals.length > 0 ? (
              <div className="space-y-4">
                {backloggedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-white rounded-xl border border-warm-200 p-5 opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-warm-400">
                          {getCategoryIcon(goal.category)} {goal.category}
                        </span>
                        <h3 className="font-medium text-warm-700 mt-1">{goal.objective}</h3>
                        {goal.why && (
                          <p className="text-sm text-warm-500 mt-1 italic">{goal.why}</p>
                        )}
                      </div>
                      <button
                        onClick={() => updateGoal(goal.id, { status: 'active' })}
                        className="px-3 py-1 text-sm bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200"
                      >
                        Reactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-warm-500 bg-white rounded-xl border border-warm-200">
                <p>No backlogged items yet.</p>
                <p className="text-sm mt-1">Items you deprioritize will appear here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
