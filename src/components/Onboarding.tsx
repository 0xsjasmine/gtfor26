'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { getCurrentQuarter, generateId, getCategoryIcon } from '@/lib/utils';
import type { GoalCategory, Goal, AntiGoal, VibeType } from '@/types';
import { ArrowRight, ArrowLeft, Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories: GoalCategory[] = ['work', 'personal', 'creative', 'relationships', 'health', 'learning'];

interface OnboardingGoal {
  description: string;
  category: GoalCategory;
  kpi_metric: string;
  kpi_target: number;
}

export function Onboarding() {
  const {
    setOnboarded,
    setCurrentQuarter,
    addGoal,
    addAntiGoal,
    setVibeCode,
  } = useAppStore();

  const [step, setStep] = useState(1);
  const [quarter, setQuarter] = useState(getCurrentQuarter());
  const [goals, setGoals] = useState<OnboardingGoal[]>([]);
  const [antiGoals, setAntiGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState<OnboardingGoal>({
    description: '',
    category: 'work',
    kpi_metric: '',
    kpi_target: 10,
  });
  const [newAntiGoal, setNewAntiGoal] = useState('');

  const handleAddGoal = () => {
    if (!newGoal.description.trim()) return;
    setGoals([...goals, { ...newGoal }]);
    setNewGoal({ description: '', category: 'work', kpi_metric: '', kpi_target: 10 });
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleAddAntiGoal = () => {
    if (!newAntiGoal.trim()) return;
    setAntiGoals([...antiGoals, newAntiGoal]);
    setNewAntiGoal('');
  };

  const handleRemoveAntiGoal = (index: number) => {
    setAntiGoals(antiGoals.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    // Save quarter
    setCurrentQuarter(quarter);

    // Save goals
    goals.forEach((g) => {
      const goal: Goal = {
        id: generateId(),
        user_id: '',
        quarter,
        category: g.category,
        description: g.description,
        kpi_metric: g.kpi_metric || 'units completed',
        kpi_target: g.kpi_target,
        kpi_current: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addGoal(goal);
    });

    // Save anti-goals
    antiGoals.forEach((description) => {
      const antiGoal: AntiGoal = {
        id: generateId(),
        user_id: '',
        quarter,
        description,
        created_at: new Date().toISOString(),
      };
      addAntiGoal(antiGoal);
    });

    // Set initial vibe code
    setVibeCode({
      id: generateId(),
      user_id: '',
      week_start_date: new Date().toISOString(),
      vibe_type: 'Deep Build' as VibeType,
      focus_goals: [],
      backlogged_goals: [],
      created_at: new Date().toISOString(),
      is_user_override: false,
    });

    // Mark as onboarded
    setOnboarded(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                s === step ? 'bg-primary-600' : s < step ? 'bg-primary-300' : 'bg-gray-200'
              )}
            />
          ))}
        </div>

        {/* Step 1: Welcome & Quarter */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to GTFOR26</h1>
            <p className="text-gray-600 mb-8">
              AI is changing everything. This system helps you navigate what to focus on,
              what to backlog, and what your emotions are telling you about what you actually want.
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What quarter is this?
              </label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                className="w-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-lg"
              >
                <option value="Q1 2025">Q1 2025</option>
                <option value="Q2 2025">Q2 2025</option>
                <option value="Q3 2025">Q3 2025</option>
                <option value="Q4 2025">Q4 2025</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Let's Go
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goals for {quarter}</h2>
            <p className="text-gray-600 mb-6">
              Add goals across different areas of your life. Each goal should have a measurable KPI.
            </p>

            {/* Added Goals */}
            {goals.length > 0 && (
              <div className="mb-6 space-y-2">
                {goals.map((goal, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{getCategoryIcon(goal.category)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{goal.description}</p>
                      <p className="text-xs text-gray-500">
                        {goal.kpi_metric} • Target: {goal.kpi_target}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveGoal(index)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Goal Form */}
            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg mb-6">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal description..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex gap-3">
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as GoalCategory })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="KPI metric (e.g., blog posts published)"
                  value={newGoal.kpi_metric}
                  onChange={(e) => setNewGoal({ ...newGoal, kpi_metric: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.description.trim()}
                  className="w-full py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Goal
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={goals.length === 0}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Anti-Goals */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Anti-Goals</h2>
            <p className="text-gray-600 mb-6">
              Who are you choosing NOT to become this quarter? These serve as guardrails for your decisions.
            </p>

            {/* Added Anti-Goals */}
            {antiGoals.length > 0 && (
              <div className="mb-6 space-y-2">
                {antiGoals.map((antiGoal, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
                  >
                    <span className="text-red-500">✕</span>
                    <p className="flex-1 text-gray-800">{antiGoal}</p>
                    <button
                      onClick={() => handleRemoveAntiGoal(index)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Anti-Goal Form */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder='e.g., "Not the person who says yes to everything"'
                value={newAntiGoal}
                onChange={(e) => setNewAntiGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAntiGoal()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleAddAntiGoal}
                disabled={!newAntiGoal.trim()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg text-sm text-amber-800 mb-6">
              <p className="font-medium mb-1">Examples:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-700">
                <li>"Not the person who says yes to everything and builds nothing"</li>
                <li>"Not the person who's so work-focused she loses friendships"</li>
                <li>"Not the person who's traveling while missing the chance to build"</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Complete */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
            <p className="text-gray-600 mb-6">
              Here's a summary of your {quarter} setup. Ready to get started?
            </p>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Goals ({goals.length})</h3>
                <div className="space-y-1">
                  {goals.map((goal, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {getCategoryIcon(goal.category)} {goal.description}
                    </p>
                  ))}
                </div>
              </div>

              {antiGoals.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-medium text-red-800 mb-2">Anti-Goals ({antiGoals.length})</h3>
                  <div className="space-y-1">
                    {antiGoals.map((antiGoal, index) => (
                      <p key={index} className="text-sm text-red-600">
                        ✕ {antiGoal}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                <Check className="w-5 h-5" />
                Complete Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
