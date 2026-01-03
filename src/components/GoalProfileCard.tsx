'use client';

import { useState } from 'react';
import { cn, generateId } from '@/lib/utils';
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

  const emptySlots = Math.max(0, 3 - displayMeasures.length);

  return (
    <div className="relative">
      {/* Side Navigation - only show when multiple goals */}
      {!isNew && totalGoals > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 p-3 rounded-full bg-cream-50 border border-cream-300 shadow-sm hover:bg-cream-100 transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-500" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 p-3 rounded-full bg-cream-50 border border-cream-300 shadow-sm hover:bg-cream-100 transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-neutral-500" />
          </button>
        </>
      )}

      {/* Main Card Container */}
      <div className="space-y-6">

        {/* OBJECTIVE Card - Full width, clean */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-8 relative">
          {/* Menu */}
          <div className="absolute top-6 right-6">
            {isNew ? (
              onCancel && (
                <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              )
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-cream-200 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                </button>
                {showMenu && goal && (
                  <div className="absolute right-0 top-10 w-36 bg-white border border-cream-200 rounded-xl shadow-lg py-1 z-20">
                    <button
                      onClick={() => { updateGoal(goal.id, { status: 'backlogged' }); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-cream-50 flex items-center gap-2 text-neutral-600"
                    >
                      <Archive className="w-4 h-4" /> Backlog
                    </button>
                    <button
                      onClick={() => { deleteGoal(goal.id); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-cream-50 flex items-center gap-2 text-primary-500"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Objective Input - Clean, no icon */}
          <div className="max-w-2xl">
            {isNew ? (
              <input
                type="text"
                placeholder="What's your intention?"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full text-2xl font-serif text-neutral-800 bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
              />
            ) : (
              <h1 className="text-2xl font-serif text-neutral-800">{goal?.objective}</h1>
            )}
          </div>

          {/* Counter */}
          {!isNew && totalGoals > 1 && (
            <p className="text-sm text-neutral-400 mt-6">{currentIndex + 1} of {totalGoals}</p>
          )}
        </div>

        {/* TYPE Card */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-4">Type</p>
          {isNew ? (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    category === cat.id
                      ? "border-primary-400 text-primary-600 bg-primary-50"
                      : "border-cream-300 text-neutral-500 hover:border-cream-400 hover:text-neutral-600"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-neutral-700 font-medium">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
          )}
        </div>

        {/* MILESTONES Section */}
        <div>
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-4">Milestones</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing Milestones */}
            {displayMeasures.map((measure) => {
              const isComplete = measure.current >= measure.target;
              return (
                <div
                  key={measure.id}
                  className={cn(
                    "bg-cream-50 rounded-2xl border p-5 relative group cursor-pointer transition-all min-h-[120px]",
                    isComplete
                      ? "border-primary-300 bg-primary-50"
                      : "border-cream-200 hover:border-primary-200"
                  )}
                  onClick={() => toggleMilestone(measure.id)}
                >
                  {/* Checkbox */}
                  <div className={cn(
                    "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isComplete
                      ? "bg-primary-400 border-primary-400"
                      : "border-cream-400"
                  )}>
                    {isComplete && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Milestone Text */}
                  <p className={cn(
                    "text-sm font-medium pr-8 leading-relaxed",
                    isComplete ? "text-neutral-500 line-through" : "text-neutral-700"
                  )}>
                    {measure.metric}
                  </p>

                  {/* Remove button */}
                  {isNew && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMeasure(measure.id); }}
                      className="absolute bottom-4 right-4 text-neutral-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add Milestone Cards */}
            {Array.from({ length: Math.min(emptySlots, isNew ? 3 - displayMeasures.length : 1) }).map((_, i) => (
              editingMilestone === `new-${i}` ? (
                <div
                  key={`add-${i}`}
                  className="bg-cream-50 rounded-2xl border-2 border-dashed border-primary-300 p-5 min-h-[120px]"
                >
                  <input
                    type="text"
                    placeholder="What will you achieve?"
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
                  className="bg-cream-50 rounded-2xl border-2 border-dashed border-cream-300 p-5 min-h-[120px] flex items-center justify-center text-neutral-400 hover:border-primary-300 hover:text-primary-400 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )
            ))}

            {/* Extra "+" for existing goals */}
            {!isNew && displayMeasures.length >= 3 && (
              editingMilestone === 'extra' ? (
                <div className="bg-cream-50 rounded-2xl border-2 border-dashed border-primary-300 p-5 min-h-[120px]">
                  <input
                    type="text"
                    placeholder="What will you achieve?"
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
                  className="bg-cream-50 rounded-2xl border-2 border-dashed border-cream-300 p-5 min-h-[120px] flex items-center justify-center text-neutral-400 hover:border-primary-300 hover:text-primary-400 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              )
            )}
          </div>
        </div>

        {/* BONUS WINS Card */}
        <div className="bg-cream-50 rounded-2xl border border-cream-200 p-6">
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-4">Bonus Wins</p>
          {isNew ? (
            <textarea
              placeholder="Track unexpected positive outcomes..."
              value={bonusWins}
              onChange={(e) => setBonusWins(e.target.value)}
              className="w-full text-sm text-neutral-700 bg-transparent border-none focus:outline-none resize-none placeholder:text-neutral-400 leading-relaxed"
              rows={2}
            />
          ) : (
            <p className="text-neutral-400 text-sm">Track unexpected positive outcomes...</p>
          )}
        </div>

        {/* Save Button */}
        {isNew && (
          <button
            onClick={handleSave}
            disabled={!objective.trim()}
            className="w-full py-4 bg-primary-400 text-white rounded-2xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-colors"
          >
            Create Intention
          </button>
        )}

        {/* Pagination Dots */}
        {!isNew && totalGoals > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalGoals }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentIndex ? "bg-primary-400 w-8" : "bg-cream-300 w-2"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
