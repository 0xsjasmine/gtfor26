'use client';

import { useState } from 'react';
import { cn, getCategoryIcon, generateId } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { Goal, GoalCategory, SuccessMeasure } from '@/types';
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
    updateSuccessMeasure,
    addSuccessMeasure,
  } = useAppStore();

  // Editable state
  const [objective, setObjective] = useState(goal?.objective || '');
  const [category, setCategory] = useState<GoalCategory>(goal?.category || 'work');
  const [measures, setMeasures] = useState<SuccessMeasure[]>(goal?.success_measures || []);
  const [newMeasureName, setNewMeasureName] = useState('');
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [bonusWins, setBonusWins] = useState('');

  const displayMeasures = isNew ? measures : (goal?.success_measures || []);

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
    setEditingMilestone(null);
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
      why: '',
      status: 'active',
      success_measures: measures,
      actions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onSave?.(newGoal);
  };

  // Calculate how many milestone slots to show (minimum 3, expand as needed)
  const milestoneSlots = Math.max(3, displayMeasures.length + 1);
  const emptySlots = milestoneSlots - displayMeasures.length;

  return (
    <div className="relative">
      {/* Side Navigation */}
      {!isNew && totalGoals > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-2 rounded-full bg-white border border-neutral-200 shadow-md hover:bg-neutral-50 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-2 rounded-full bg-white border border-neutral-200 shadow-md hover:bg-neutral-50 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </>
      )}

      {/* Top Row: Objective + Type */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* OBJECTIVE Card - Left (larger) */}
        <div className="lg:col-span-3 bg-cream-50 rounded-2xl border border-cream-200 p-6 relative min-h-[140px]">
          {/* Menu */}
          <div className="absolute top-4 right-4">
            {isNew ? (
              onCancel && (
                <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              )
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg"
                >
                  <MoreHorizontal className="w-5 h-5 text-neutral-400" />
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

          {/* Label */}
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Objective</span>
          </div>

          {/* Category Icon + Objective Input */}
          <div className="flex items-start gap-4">
            <div className="text-4xl">{getCategoryIcon(category)}</div>
            <div className="flex-1">
              {isNew ? (
                <input
                  type="text"
                  placeholder="What's your intention?"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full text-xl font-semibold text-neutral-900 bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
                />
              ) : (
                <h1 className="text-xl font-semibold text-neutral-900">{goal?.objective}</h1>
              )}
            </div>
          </div>

          {/* Counter */}
          {!isNew && totalGoals > 1 && (
            <p className="text-xs text-neutral-400 mt-4">{currentIndex + 1} / {totalGoals}</p>
          )}
        </div>

        {/* TYPE Card - Right (smaller) */}
        <div className="lg:col-span-2 bg-cream-50 rounded-2xl border border-cream-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Type</span>
          </div>
          {isNew ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                    category === cat.id
                      ? "border-primary-400 text-primary-500 bg-primary-50"
                      : "border-cream-300 text-neutral-600 hover:border-cream-400"
                  )}
                >
                  {getCategoryIcon(cat.id)} {cat.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-neutral-700 font-medium">
              {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
          )}
        </div>
      </div>

      {/* Middle Row: Milestones Grid */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary-400" />
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Milestones</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Existing Milestones */}
          {displayMeasures.map((measure) => {
            const isComplete = measure.current >= measure.target;
            return (
              <div
                key={measure.id}
                className={cn(
                  "bg-cream-50 rounded-xl border p-4 relative group cursor-pointer transition-all min-h-[100px]",
                  isComplete
                    ? "border-primary-300 bg-primary-50"
                    : "border-cream-200 hover:border-primary-300"
                )}
                onClick={() => toggleMilestone(measure.id)}
              >
                {/* Checkbox */}
                <div className={cn(
                  "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isComplete
                    ? "bg-primary-400 border-primary-400"
                    : "border-cream-400"
                )}>
                  {isComplete && <Check className="w-3 h-3 text-white" />}
                </div>

                {/* Milestone Text */}
                <p className={cn(
                  "text-sm font-medium pr-6",
                  isComplete ? "text-neutral-500 line-through" : "text-neutral-700"
                )}>
                  {measure.metric}
                </p>

                {/* Remove button (only for new goals) */}
                {isNew && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeMeasure(measure.id); }}
                    className="absolute bottom-3 right-3 text-neutral-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Milestone Card(s) - Show empty slots */}
          {Array.from({ length: Math.min(emptySlots, isNew ? 3 - displayMeasures.length : 1) }).map((_, i) => (
            editingMilestone === `new-${i}` ? (
              <div
                key={`add-${i}`}
                className="bg-cream-50 rounded-xl border-2 border-dashed border-primary-300 p-4 min-h-[100px]"
              >
                <input
                  type="text"
                  placeholder="Milestone..."
                  value={newMeasureName}
                  onChange={(e) => setNewMeasureName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMeasure();
                    if (e.key === 'Escape') { setEditingMilestone(null); setNewMeasureName(''); }
                  }}
                  onBlur={() => {
                    if (newMeasureName.trim()) handleAddMeasure();
                    else { setEditingMilestone(null); setNewMeasureName(''); }
                  }}
                  className="w-full text-sm text-neutral-700 bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
                  autoFocus
                />
              </div>
            ) : (
              <button
                key={`add-${i}`}
                onClick={() => setEditingMilestone(`new-${i}`)}
                className="bg-cream-50 rounded-xl border-2 border-dashed border-cream-300 p-4 min-h-[100px] flex items-center justify-center text-neutral-400 hover:border-primary-300 hover:text-primary-400 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            )
          ))}

          {/* Extra "+" button if all slots filled */}
          {displayMeasures.length >= 3 && !isNew && (
            editingMilestone === 'extra' ? (
              <div className="bg-cream-50 rounded-xl border-2 border-dashed border-primary-300 p-4 min-h-[100px]">
                <input
                  type="text"
                  placeholder="Milestone..."
                  value={newMeasureName}
                  onChange={(e) => setNewMeasureName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMeasure();
                    if (e.key === 'Escape') { setEditingMilestone(null); setNewMeasureName(''); }
                  }}
                  onBlur={() => {
                    if (newMeasureName.trim()) handleAddMeasure();
                    else { setEditingMilestone(null); setNewMeasureName(''); }
                  }}
                  className="w-full text-sm text-neutral-700 bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => setEditingMilestone('extra')}
                className="bg-cream-50 rounded-xl border-2 border-dashed border-cream-300 p-4 min-h-[100px] flex items-center justify-center text-neutral-400 hover:border-primary-300 hover:text-primary-400 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Bottom Row: Bonus Wins */}
      <div className="bg-cream-50 rounded-2xl border border-cream-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wide">Bonus Wins</span>
        </div>
        {isNew ? (
          <textarea
            placeholder="Track unexpected positive outcomes and ripple effects..."
            value={bonusWins}
            onChange={(e) => setBonusWins(e.target.value)}
            className="w-full text-sm text-neutral-700 bg-transparent border-none focus:outline-none resize-none placeholder:text-neutral-400"
            rows={2}
          />
        ) : (
          <p className="text-neutral-400 text-sm">Track unexpected positive outcomes and ripple effects...</p>
        )}
      </div>

      {/* Save Button for New Goals */}
      {isNew && (
        <button
          onClick={handleSave}
          disabled={!objective.trim()}
          className="w-full mt-6 py-4 bg-primary-400 text-white rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          Create Intention
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
