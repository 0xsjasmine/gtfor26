'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { GoalProfileCard } from './GoalProfileCard';
import { AntiGoalCard } from './AntiGoalCard';
import { getCurrentQuarter, formatDate, getCategoryIcon, generateId } from '@/lib/utils';
import type { GoalsView, Goal, AntiGoal } from '@/types';
import { Plus, X } from 'lucide-react';

const goalsViews: { id: GoalsView; label: string }[] = [
  { id: 'quarter', label: 'Quarter' },
  { id: 'month', label: 'Month' },
  { id: 'backlog', label: 'Backlog' },
];

export function GoalsContent() {
  const {
    goalsView,
    setGoalsView,
    goals,
    antiGoals,
    currentQuarter,
    addGoal,
    addAntiGoal,
    currentGoalIndex,
    nextGoal,
    prevGoal,
    updateGoal,
  } = useAppStore();

  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showAddAntiGoal, setShowAddAntiGoal] = useState(false);
  const [newAntiGoal, setNewAntiGoal] = useState('');

  const quarter = currentQuarter || getCurrentQuarter();
  const activeGoals = goals.filter((g) => g.status === 'active');
  const backloggedGoals = goals.filter((g) => g.status === 'backlogged');
  const currentGoal = activeGoals[currentGoalIndex];

  const handleSaveGoal = (goal: Goal) => {
    addGoal({ ...goal, quarter });
    setShowNewGoal(false);
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-warm-900">Goals</h1>
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
            {/* Show new goal bento card OR existing goals */}
            {showNewGoal ? (
              <GoalProfileCard
                isNew
                onCancel={() => setShowNewGoal(false)}
                onSave={handleSaveGoal}
              />
            ) : activeGoals.length > 0 ? (
              <>
                <GoalProfileCard
                  goal={currentGoal}
                  onNext={nextGoal}
                  onPrev={prevGoal}
                  currentIndex={currentGoalIndex}
                  totalGoals={activeGoals.length}
                />

                {/* Add another goal button */}
                <button
                  onClick={() => setShowNewGoal(true)}
                  className="w-full mt-6 p-4 border-2 border-dashed border-warm-300 rounded-xl text-warm-500 hover:border-accent-400 hover:text-accent-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Goal
                </button>
              </>
            ) : (
              /* No goals - show empty bento card ready to fill */
              <GoalProfileCard
                isNew
                onSave={handleSaveGoal}
              />
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
