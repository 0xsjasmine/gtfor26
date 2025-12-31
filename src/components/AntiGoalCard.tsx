'use client';

import type { AntiGoal } from '@/types';
import { XCircle, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

interface AntiGoalCardProps {
  antiGoal: AntiGoal;
}

export function AntiGoalCard({ antiGoal }: AntiGoalCardProps) {
  const { deleteAntiGoal } = useAppStore();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-gray-800 text-sm">{antiGoal.description}</p>
      </div>
      <button
        onClick={() => deleteAntiGoal(antiGoal.id)}
        className="p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
