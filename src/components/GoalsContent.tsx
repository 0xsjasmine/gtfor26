'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { GoalProfileCard } from './GoalProfileCard';
import { getCurrentQuarter, generateId } from '@/lib/utils';
import type { Goal, AntiGoal } from '@/types';
import { Plus, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="h-full overflow-auto p-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl text-neutral-800">Intentions</h1>
            <p className="text-neutral-500">{quarter}</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/80 shadow-glass">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('intentions')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === 'intentions'
                  ? "bg-white text-neutral-800 shadow-soft"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              Intentions
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('anti-goals')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === 'anti-goals'
                  ? "bg-white text-neutral-800 shadow-soft"
                  : "text-neutral-500 hover:text-neutral-700"
              )}
            >
              Anti-Goals
            </motion.button>
          </div>
        </motion.div>

        {/* Intentions Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'intentions' && (
            <motion.div
              key="intentions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
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
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowNewGoal(true)}
                    className="w-full mt-6 p-4 border-2 border-dashed border-lavender-200 rounded-2xl text-lavender-500 hover:border-lavender-400 hover:text-lavender-600 hover:bg-lavender-50/50 flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Intention
                  </motion.button>
                </>
              ) : (
                <GoalProfileCard
                  isNew
                  onSave={handleSaveGoal}
                />
              )}
            </motion.div>
          )}

          {/* Anti-Goals Tab */}
          {activeTab === 'anti-goals' && (
            <motion.div
              key="anti-goals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <p className="text-neutral-500 font-serif italic mb-6">
                Who you're choosing NOT to become this quarter.
              </p>

              {/* Anti-Goals List */}
              {antiGoals.length > 0 && (
                <div className="space-y-3">
                  {antiGoals.map((antiGoal, index) => (
                    <motion.div
                      key={antiGoal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/80 group shadow-glass"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-lavender-400 to-rose-400 flex-shrink-0" />
                      <span className="flex-1 text-neutral-700">{antiGoal.description}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteAntiGoal(antiGoal.id)}
                        className="p-2 text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add Anti-Goal */}
              <AnimatePresence mode="wait">
                {!showAddAntiGoal ? (
                  <motion.button
                    key="add-button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAddAntiGoal(true)}
                    className="w-full p-4 border-2 border-dashed border-lavender-200 rounded-2xl text-lavender-500 hover:border-lavender-400 hover:text-lavender-600 hover:bg-lavender-50/50 flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add Anti-Goal
                  </motion.button>
                ) : (
                  <motion.div
                    key="add-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-glass"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-neutral-800">New Anti-Goal</h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAddAntiGoal(false)}
                      >
                        <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                      </motion.button>
                    </div>
                    <input
                      type="text"
                      placeholder='e.g., "Not the person who says yes to everything"'
                      value={newAntiGoal}
                      onChange={(e) => setNewAntiGoal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAntiGoal()}
                      className="w-full px-4 py-3 bg-white/80 border border-neutral-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-lavender-400/50 focus:border-lavender-400 mb-3 transition-all"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleAddAntiGoal}
                      disabled={!newAntiGoal.trim()}
                      className="w-full py-3 bg-gradient-to-r from-lavender-400 to-lavender-500 text-white rounded-xl hover:from-lavender-500 hover:to-lavender-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-soft transition-all"
                    >
                      Add Anti-Goal
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
