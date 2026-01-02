'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { GoalCard } from './GoalCard';
import { AntiGoalCard } from './AntiGoalCard';
import { ProgressBar } from './ProgressBar';
import { getCurrentQuarter, formatDate, getCategoryIcon, generateId } from '@/lib/utils';
import type { GoalsView, GoalCategory, Goal, AntiGoal } from '@/types';
import { Plus, X } from 'lucide-react';

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
  } = useAppStore();

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddAntiGoal, setShowAddAntiGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    description: '',
    category: 'work' as GoalCategory,
    kpi_metric: '',
    kpi_target: 10,
  });
  const [newAntiGoal, setNewAntiGoal] = useState('');

  const quarter = currentQuarter || getCurrentQuarter();
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');
  const backloggedGoals = goals.filter((g) => g.status === 'backlogged');

  // Group goals by category
  const goalsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = activeGoals.filter((g) => g.category === cat);
    return acc;
  }, {} as Record<GoalCategory, Goal[]>);

  // Calculate overall progress
  const totalTarget = activeGoals.reduce((sum, g) => sum + g.kpi_target, 0);
  const totalCurrent = activeGoals.reduce((sum, g) => sum + g.kpi_current, 0);

  const handleAddGoal = () => {
    if (!newGoal.description.trim()) return;

    const goal: Goal = {
      id: generateId(),
      user_id: '',
      quarter,
      category: newGoal.category,
      description: newGoal.description,
      kpi_metric: newGoal.kpi_metric || 'units completed',
      kpi_target: newGoal.kpi_target,
      kpi_current: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addGoal(goal);
    setNewGoal({ description: '', category: 'work', kpi_metric: '', kpi_target: 10 });
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
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
            {/* Overall Progress */}
            {totalTarget > 0 && (
              <div className="mb-6 p-4 bg-white rounded-xl border border-warm-200">
                <h3 className="font-medium text-warm-700 mb-2">Quarter Progress</h3>
                <ProgressBar current={totalCurrent} target={totalTarget} size="lg" />
              </div>
            )}

            {/* Goals by Category */}
            {categories.map((category) => {
              const categoryGoals = goalsByCategory[category];
              if (categoryGoals.length === 0) return null;

              return (
                <div key={category} className="mb-6">
                  <h2 className="text-lg font-semibold text-warm-800 mb-3 flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    <span className="capitalize">{category}</span>
                  </h2>
                  <div className="space-y-3">
                    {categoryGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add Goal Button */}
            {!showAddGoal ? (
              <button
                onClick={() => setShowAddGoal(true)}
                className="w-full p-4 border-2 border-dashed border-warm-300 rounded-xl text-warm-500 hover:border-accent-400 hover:text-accent-600 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Goal
              </button>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-warm-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-warm-800">New Goal</h3>
                  <button onClick={() => setShowAddGoal(false)}>
                    <X className="w-5 h-5 text-warm-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Goal description..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                  <div className="flex gap-3">
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as GoalCategory })}
                      className="flex-1 px-3 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Target"
                      value={newGoal.kpi_target}
                      onChange={(e) => setNewGoal({ ...newGoal, kpi_target: parseInt(e.target.value) || 0 })}
                      className="w-24 px-3 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="KPI metric (e.g., blog posts published)"
                    value={newGoal.kpi_metric}
                    onChange={(e) => setNewGoal({ ...newGoal, kpi_metric: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                  <button
                    onClick={handleAddGoal}
                    className="w-full py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            )}

            {/* Anti-Goals Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-warm-800 mb-3">Anti-Goals</h2>
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
                    className="w-full px-3 py-2 border border-accent-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-400 mb-3"
                  />
                  <button
                    onClick={handleAddAntiGoal}
                    className="w-full py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600"
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
                {formatDate(new Date(), 'MMMM yyyy')} Progress
              </h2>
              {activeGoals.length > 0 ? (
                <div className="space-y-3">
                  {activeGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              ) : (
                <p className="text-warm-500 text-center py-8">No active goals this month.</p>
              )}
            </div>

            {completedGoals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-warm-500 mb-3">Completed</h2>
                <div className="space-y-3 opacity-60">
                  {completedGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {goalsView === 'backlog' && (
          <>
            <p className="text-warm-600 mb-6 italic">
              Items you've consciously deprioritized. Later, not never.
            </p>

            {backloggedGoals.length > 0 ? (
              <div className="space-y-3">
                {backloggedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} isBacklogged />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-warm-500">
                <p>No backlogged items yet.</p>
                <p className="text-sm mt-1">Items you deprioritize will appear here.</p>
              </div>
            )}

            {backlogItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-warm-800 mb-3">Other Backlog Items</h2>
                <div className="space-y-3">
                  {backlogItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-warm-200 rounded-lg p-4"
                    >
                      <p className="text-warm-700">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-warm-500">
                        <span>Target: {item.target_quarter}</span>
                        <span>Mentioned {item.times_mentioned}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
