'use client';

import { cn, getKPIStatus } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  current,
  target,
  label,
  showValues = true,
  size = 'md',
}: ProgressBarProps) {
  const progress = Math.min((current / target) * 100, 100);
  const status = getKPIStatus(current, target);

  const statusColors = {
    on_track: 'bg-sage-400',
    behind: 'bg-status-warning',
    blocked: 'bg-status-danger',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(label || showValues) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-warm-700">{label}</span>
          )}
          {showValues && (
            <span className="text-sm text-warm-500">
              {current} / {target}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-warm-200 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full animate-progress',
            statusColors[status]
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
