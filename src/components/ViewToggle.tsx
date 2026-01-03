'use client';

import { cn } from '@/lib/utils';

interface ViewToggleProps<T extends string> {
  views: { id: T; label: string }[];
  activeView: T;
  onChange: (view: T) => void;
}

export function ViewToggle<T extends string>({ views, activeView, onChange }: ViewToggleProps<T>) {
  return (
    <div className="inline-flex bg-neutral-100 rounded-lg p-1">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onChange(view.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all',
            activeView === view.id
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-800'
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
