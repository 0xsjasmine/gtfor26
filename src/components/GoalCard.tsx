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
    on_track: 'border-l-status-success',
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
        'bg-white rounded-lg border border-gray-200 p-4 border-l-4',
        statusColors[status],
        isBacklogged && 'opacity-50'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getCategoryIcon(goal.category)}</span>
          <div>
            <h3 className={cn(
              'font-medium text-gray-900',
              isBacklogged && 'text-gray-500'
            )}>
              {goal.description}
            </h3>
            <span className="text-xs text-gray-500 capitalize">{goal.category}</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  updateGoal(goal.id, { status: 'completed' });
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                Mark Complete
              </button>
              <button
                onClick={() => {
                  updateGoal(goal.id, { status: goal.status === 'backlogged' ? 'active' : 'backlogged' });
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Archive className="w-4 h-4 text-yellow-500" />
                {goal.status === 'backlogged' ? 'Activate' : 'Backlog'}
              </button>
              <button
                onClick={() => {
                  deleteGoal(goal.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
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
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            -1
          </button>
          <button
            onClick={() => handleUpdateKPI(1)}
            className="px-3 py-1 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded"
          >
            +1
          </button>
        </div>
      )}

      {isBacklogged && (
        <p className="mt-3 text-xs text-gray-400">
          Backlogged to {goal.quarter}
        </p>
      )}
    </div>
  );
}
