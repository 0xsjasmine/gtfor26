'use client';

import { formatDate } from '@/lib/utils';
import type { EnvyLog, EnvyCategory } from '@/types';

interface EnvyLogCardProps {
  log: EnvyLog;
}

const categoryColors: Record<EnvyCategory, string> = {
  travel: 'bg-sage-100 text-sage-700',
  career: 'bg-accent-100 text-accent-700',
  relationships: 'bg-accent-50 text-accent-600',
  creative: 'bg-warm-200 text-warm-700',
  recognition: 'bg-warm-100 text-warm-600',
  freedom: 'bg-sage-50 text-sage-600',
  lifestyle: 'bg-warm-100 text-warm-700',
  other: 'bg-warm-100 text-warm-600',
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
    <div className="bg-white rounded-lg border border-warm-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColors[log.category_tag]}`}>
          {categoryIcons[log.category_tag]} {log.category_tag}
        </span>
        <span className="text-xs text-warm-400">
          {formatDate(log.date, 'MMM d')}
        </span>
      </div>
      <p className="text-warm-800 text-sm">{log.trigger}</p>
      {log.notes && (
        <p className="mt-2 text-xs text-warm-500 italic">{log.notes}</p>
      )}
    </div>
  );
}
