'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ViewToggleProps<T extends string> {
  views: { id: T; label: string }[];
  activeView: T;
  onChange: (view: T) => void;
}

export function ViewToggle<T extends string>({ views, activeView, onChange }: ViewToggleProps<T>) {
  return (
    <div className="inline-flex bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/80 shadow-glass">
      {views.map((view) => (
        <motion.button
          key={view.id}
          onClick={() => onChange(view.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            activeView === view.id
              ? 'text-neutral-800'
              : 'text-neutral-500 hover:text-neutral-700'
          )}
        >
          {activeView === view.id && (
            <motion.div
              layoutId="viewToggleActive"
              className="absolute inset-0 bg-white rounded-lg shadow-soft"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{view.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
