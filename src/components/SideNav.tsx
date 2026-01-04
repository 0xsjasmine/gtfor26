'use client';

import { Compass, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { NavTab } from '@/types';
import { motion } from 'framer-motion';

const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'focus', label: 'Focus', icon: <Compass className="w-5 h-5" /> },
  { id: 'goals', label: 'Intentions', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'signals', label: 'Signals', icon: <Sparkles className="w-5 h-5" /> },
];

export function SideNav() {
  const { activeTab, setActiveTab, currentQuarter } = useAppStore();

  return (
    <nav className="w-56 bg-white/60 backdrop-blur-xl border-r border-white/80 flex flex-col h-screen shadow-glass">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-neutral-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl text-neutral-800">All In</h1>
            {currentQuarter && (
              <p className="text-xs text-neutral-500">{currentQuarter}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full flex items-center gap-3 px-6 py-3.5 text-left transition-all relative',
              activeTab === item.id
                ? 'text-lavender-600'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            {/* Active indicator */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-lavender-50/80 border-r-2 border-lavender-400"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">{item.icon}</span>
            <span className="relative z-10 font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200/50">
        <p className="text-xs text-neutral-400 text-center font-serif italic">
          Your journey, your way.
        </p>
      </div>
    </nav>
  );
}
