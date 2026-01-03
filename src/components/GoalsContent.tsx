'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { GoalProfileCard } from './GoalProfileCard';
import { getCurrentQuarter, generateId } from '@/lib/utils';
import type { Goal, AntiGoal } from '@/types';
import { Plus, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type GoalsTab = 'intentions' | 'anti-goals';

export function GoalsContent() {
  const {
    goals,
    antiGoals,
    currentQuarter,
    addGoal,
    addAntiGoal,
    deleteAntiGoal,
    currentGoalIndex,
    nextGoal,
    prevGoal,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<GoalsTab>('intentions');
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showAddAntiGoal, setShowAddAntiGoal] = useState(false);
  const [newAntiGoal, setNewAntiGoal] = useState('');

  const quarter = currentQuarter || getCurrentQuarter();
  const activeGoals = goals.filter((g) => g.status === 'active');
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
    <div className="h-full overflow-auto p-6 bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Goals</h1>
            <p className="text-neutral-500">{quarter}</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white rounded-xl border border-neutral-200 p-1">
            <button
              onClick={() => setActiveTab('intentions')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'intentions'
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Intentions
            </button>
            <button
              onClick={() => setActiveTab('anti-goals')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'anti-goals'
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Anti-Goals
            </button>
          </div>
        </div>

        {/* Intentions Tab */}
        {activeTab === 'intentions' && (
          <>
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
                  className="w-full mt-6 p-4 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-primary-400 hover:text-primary-500 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Intention
                </button>
              </>
            ) : (
              <GoalProfileCard
                isNew
                onSave={handleSaveGoal}
              />
            )}
          </>
        )}

        {/* Anti-Goals Tab */}
        {activeTab === 'anti-goals' && (
          <div className="space-y-4">
            <p className="text-neutral-600 italic mb-6">
              Who you're choosing NOT to become this quarter.
            </p>

            {/* Anti-Goals List */}
            {antiGoals.length > 0 && (
              <div className="space-y-3">
                {antiGoals.map((antiGoal) => (
                  <div
                    key={antiGoal.id}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 group"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />
                    <span className="flex-1 text-neutral-700">{antiGoal.description}</span>
                    <button
                      onClick={() => deleteAntiGoal(antiGoal.id)}
                      className="p-2 text-neutral-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Anti-Goal */}
            {!showAddAntiGoal ? (
              <button
                onClick={() => setShowAddAntiGoal(true)}
                className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-primary-400 hover:text-primary-500 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Anti-Goal
              </button>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-neutral-800">New Anti-Goal</h3>
                  <button onClick={() => setShowAddAntiGoal(false)}>
                    <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder='e.g., "Not the person who says yes to everything"'
                  value={newAntiGoal}
                  onChange={(e) => setNewAntiGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAntiGoal()}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 mb-3"
                  autoFocus
                />
                <button
                  onClick={handleAddAntiGoal}
                  disabled={!newAntiGoal.trim()}
                  className="w-full py-3 bg-primary-400 text-white rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Add Anti-Goal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
