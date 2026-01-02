'use client';

import { cn, getCategoryIcon } from '@/lib/utils';
import type { Goal } from '@/types';
import { useAppStore } from '@/store/app-store';
import { MoreVertical, Archive, CheckCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  isBacklogged?: boolean;
}

export function GoalCard({ goal, isBacklogged = false }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { updateGoal, deleteGoal } = useAppStore();

  // Calculate progress from success measures
  const totalProgress = goal.success_measures.reduce((acc, m) => {
    return acc + (m.current / m.target);
  }, 0);
  const avgProgress = goal.success_measures.length > 0
    ? Math.round((totalProgress / goal.success_measures.length) * 100)
    : 0;

  const getProgressStatus = () => {
    if (avgProgress >= 75) return 'on_track';
    if (avgProgress >= 40) return 'behind';
    return 'blocked';
  };

  const status = getProgressStatus();

  const statusColors = {
    on_track: 'border-l-sage-400',
    behind: 'border-l-status-warning',
    blocked: 'border-l-status-danger',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-warm-200 p-4 border-l-4',
        statusColors[status],
        isBacklogged && 'opacity-50'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(goal.category)}</span>
          <div>
            <h3 className={cn(
              'font-medium text-warm-900',
              isBacklogged && 'text-warm-500'
            )}>
              {goal.objective}
            </h3>
            <span className="text-xs text-warm-500 capitalize">{goal.category}</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-warm-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-warm-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-white border border-warm-200 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  updateGoal(goal.id, { status: 'completed' });
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-warm-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-sage-500" />
                Mark Complete
              </button>
              <button
                onClick={() => {
                  updateGoal(goal.id, { status: goal.status === 'backlogged' ? 'active' : 'backlogged' });
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-warm-50 flex items-center gap-2"
              >
                <Archive className="w-4 h-4 text-warm-500" />
                {goal.status === 'backlogged' ? 'Activate' : 'Backlog'}
              </button>
              <button
                onClick={() => {
                  deleteGoal(goal.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-warm-50 flex items-center gap-2 text-accent-600"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-warm-700">Progress</span>
          <span className="text-sm text-warm-500">{avgProgress}%</span>
        </div>
        <div className="w-full bg-warm-200 rounded-full overflow-hidden h-2.5">
          <div
            className={cn(
              'h-full rounded-full',
              status === 'on_track' ? 'bg-sage-400' :
              status === 'behind' ? 'bg-status-warning' :
              'bg-status-danger'
            )}
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      {/* Action count */}
      {goal.actions.length > 0 && (
        <div className="mt-3 text-xs text-warm-500">
          {goal.actions.filter(a => a.status === 'done').length}/{goal.actions.length} actions completed
        </div>
      )}

      {isBacklogged && (
        <p className="mt-3 text-xs text-warm-400 italic">
          Backlogged to {goal.quarter}
        </p>
      )}
    </div>
  );
}
