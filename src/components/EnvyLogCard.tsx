'use client';

import { formatDate } from '@/lib/utils';
import type { EnvyLog, EnvyCategory } from '@/types';

interface EnvyLogCardProps {
  log: EnvyLog;
}

const categoryColors: Record<EnvyCategory, string> = {
  travel: 'bg-sky-100 text-sky-700',
  career: 'bg-purple-100 text-purple-700',
  relationships: 'bg-pink-100 text-pink-700',
  creative: 'bg-orange-100 text-orange-700',
  recognition: 'bg-yellow-100 text-yellow-700',
  freedom: 'bg-teal-100 text-teal-700',
  lifestyle: 'bg-indigo-100 text-indigo-700',
  other: 'bg-gray-100 text-gray-700',
};

const categoryIcons: Record<EnvyCategory, string> = {
  travel: '✈️',
  career: '💼',
  relationships: '💝',
  creative: '🎨',
  recognition: '🏆',
  freedom: '🦋',
  lifestyle: '🌴',
  other: '💭',
};

export function EnvyLogCard({ log }: EnvyLogCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[log.category_tag]}`}>
          {categoryIcons[log.category_tag]} {log.category_tag}
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(log.date, 'MMM d')}
        </span>
      </div>
      <p className="text-gray-800 text-sm">{log.trigger}</p>
      {log.notes && (
        <p className="mt-2 text-xs text-gray-500 italic">{log.notes}</p>
      )}
    </div>
  );
}
