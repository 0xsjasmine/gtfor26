'use client';

import { cn } from '@/lib/utils';

interface ViewToggleProps<T extends string> {
  views: { id: T; label: string }[];
  activeView: T;
  onChange: (view: T) => void;
}

export function ViewToggle<T extends string>({ views, activeView, onChange }: ViewToggleProps<T>) {
  return (
    <div className="inline-flex bg-cream-200 rounded-xl p-1">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onChange(view.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-all',
            activeView === view.id
              ? 'bg-cream-50 text-neutral-800 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
