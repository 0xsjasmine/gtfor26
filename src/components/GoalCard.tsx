'use client';

import { cn, getCategoryIcon, getKPIStatus } from '@/lib/utils';
import { ProgressBar } from './ProgressBar';
import type { Goal } from '@/types';
import { useAppStore } from '@/store/app-store';
import { MoreVertical, Archive, CheckCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  isBacklogged?: boolean;
  onUpdate?: (id: string, updates: Partial<Goal>) => void;
}

export function GoalCard({ goal, isBacklogged = false, onUpdate }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { updateGoal, deleteGoal } = useAppStore();
  const status = getKPIStatus(goal.kpi_current, goal.kpi_target);

  const statusColors = {
    on_track: 'border-l-sage-400',
    behind: 'border-l-status-warning',
    blocked: 'border-l-status-danger',
  };

  const handleUpdateKPI = (increment: number) => {
    const newValue = Math.max(0, Math.min(goal.kpi_target, goal.kpi_current + increment));
    updateGoal(goal.id, { kpi_current: newValue });
    if (onUpdate) onUpdate(goal.id, { kpi_current: newValue });
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
              {goal.description}
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

      <ProgressBar
        current={goal.kpi_current}
        target={goal.kpi_target}
        label={goal.kpi_metric}
      />

      {!isBacklogged && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => handleUpdateKPI(-1)}
            className="px-3 py-1 text-sm bg-warm-100 hover:bg-warm-200 text-warm-700 rounded"
          >
            -1
          </button>
          <button
            onClick={() => handleUpdateKPI(1)}
            className="px-3 py-1 text-sm bg-accent-100 hover:bg-accent-200 text-accent-700 rounded"
          >
            +1
          </button>
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
