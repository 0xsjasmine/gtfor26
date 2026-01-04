'use client';

import { useState } from 'react';
import { cn, generateId } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { Goal, GoalCategory, SuccessMeasure } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Side Navigation - only show when multiple goals */}
      {!isNew && totalGoals > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 p-3 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 shadow-glass hover:bg-white transition-all z-10"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 p-3 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 shadow-glass hover:bg-white transition-all z-10"
          >
            <ChevronRight className="w-5 h-5 text-neutral-500" />
          </motion.button>
        </>
      )}

      {/* Main Card Container */}
      <div className="space-y-6">

        {/* OBJECTIVE Card - Full width, clean */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-8 relative shadow-glass"
        >
          {/* Menu */}
          <div className="absolute top-6 right-6">
            {isNew ? (
              onCancel && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onCancel}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </motion.button>
              )
            ) : (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-lavender-50 rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                </motion.button>
                <AnimatePresence>
                  {showMenu && goal && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-10 w-36 bg-white/90 backdrop-blur-sm border border-white/80 rounded-xl shadow-glass-lg py-1 z-20"
                    >
                      <button
                        onClick={() => { updateGoal(goal.id, { status: 'backlogged' }); setShowMenu(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-lavender-50 flex items-center gap-2 text-neutral-600 transition-colors"
                      >
                        <Archive className="w-4 h-4" /> Backlog
                      </button>
                      <button
                        onClick={() => { deleteGoal(goal.id); setShowMenu(false); }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-rose-50 flex items-center gap-2 text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                className="w-full text-2xl font-display text-neutral-800 bg-transparent border-none focus:outline-none placeholder:text-neutral-400"
              />
            ) : (
              <h1 className="text-2xl font-display text-neutral-800">{goal?.objective}</h1>
            )}
          </div>

          {/* Counter */}
          {!isNew && totalGoals > 1 && (
            <p className="text-sm text-neutral-400 mt-6">{currentIndex + 1} of {totalGoals}</p>
          )}
        </motion.div>

        {/* TYPE Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-6 shadow-glass"
        >
          <p className="text-xs font-semibold text-lavender-500 uppercase tracking-wider mb-4">Type</p>
          {isNew ? (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    category === cat.id
                      ? "border-lavender-400 text-lavender-600 bg-lavender-50"
                      : "border-neutral-200/50 text-neutral-500 hover:border-lavender-200 hover:text-neutral-600"
                  )}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-neutral-700 font-medium">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
          )}
        </motion.div>

        {/* MILESTONES Section */}
        <div>
          <p className="text-xs font-semibold text-lavender-500 uppercase tracking-wider mb-4">Milestones</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Existing Milestones */}
            {displayMeasures.map((measure, index) => {
              const isComplete = measure.current >= measure.target;
              return (
                <motion.div
                  key={measure.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={cn(
                    "bg-white/70 backdrop-blur-sm rounded-2xl border p-5 relative group cursor-pointer transition-all min-h-[120px] shadow-glass",
                    isComplete
                      ? "border-sage-300 bg-sage-50/70"
                      : "border-white/80 hover:border-lavender-200"
                  )}
                  onClick={() => toggleMilestone(measure.id)}
                >
                  {/* Checkbox */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isComplete
                        ? "bg-sage-400 border-sage-400"
                        : "border-neutral-300"
                    )}
                  >
                    {isComplete && <Check className="w-4 h-4 text-white" />}
                  </motion.div>

                  {/* Milestone Text */}
                  <p className={cn(
                    "text-sm font-medium pr-8 leading-relaxed",
                    isComplete ? "text-neutral-500 line-through" : "text-neutral-700"
                  )}>
                    {measure.metric}
                  </p>

                  {/* Remove button */}
                  {isNew && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); removeMeasure(measure.id); }}
                      className="absolute bottom-4 right-4 text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              );
            })}

            {/* Add Milestone Cards */}
            {Array.from({ length: Math.min(emptySlots, isNew ? 3 - displayMeasures.length : 1) }).map((_, i) => (
              editingMilestone === `new-${i}` ? (
                <motion.div
                  key={`add-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-lavender-300 p-5 min-h-[120px] shadow-glass"
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
                </motion.div>
              ) : (
                <motion.button
                  key={`add-${i}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingMilestone(`new-${i}`)}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-lavender-200 p-5 min-h-[120px] flex items-center justify-center text-lavender-400 hover:border-lavender-400 hover:text-lavender-500 hover:bg-lavender-50/50 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              )
            ))}

            {/* Extra "+" for existing goals */}
            {!isNew && displayMeasures.length >= 3 && (
              editingMilestone === 'extra' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-lavender-300 p-5 min-h-[120px] shadow-glass"
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
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingMilestone('extra')}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-lavender-200 p-5 min-h-[120px] flex items-center justify-center text-lavender-400 hover:border-lavender-400 hover:text-lavender-500 hover:bg-lavender-50/50 transition-all"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* BONUS WINS Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 p-6 shadow-glass"
        >
          <p className="text-xs font-semibold text-lavender-500 uppercase tracking-wider mb-4">Bonus Wins</p>
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
        </motion.div>

        {/* Save Button */}
        {isNew && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSave}
            disabled={!objective.trim()}
            className="w-full py-4 bg-gradient-to-r from-lavender-400 to-lavender-500 text-white rounded-2xl hover:from-lavender-500 hover:to-lavender-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-all shadow-dreamy"
          >
            Create Intention
          </motion.button>
        )}

        {/* Pagination Dots */}
        {!isNew && totalGoals > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalGoals }).map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  width: i === currentIndex ? 32 : 8,
                  backgroundColor: i === currentIndex ? '#B794F6' : '#E8E6E3',
                }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
