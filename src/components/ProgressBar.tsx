'use client';

import { cn, getKPIStatus, getStatusColorClass } from '@/lib/utils';

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
  const colorClass = getStatusColorClass(status);

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
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValues && (
            <span className="text-sm text-gray-500">
              {current} / {target}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full animate-progress',
            colorClass
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
