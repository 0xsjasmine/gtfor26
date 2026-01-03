'use client';

import { Compass, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { NavTab } from '@/types';

const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'focus', label: 'Focus', icon: <Compass className="w-5 h-5" /> },
  { id: 'goals', label: 'Intentions', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'signals', label: 'Signals', icon: <Sparkles className="w-5 h-5" /> },
];

export function SideNav() {
  const { activeTab, setActiveTab, currentQuarter } = useAppStore();

  return (
    <nav className="w-56 bg-cream-50 border-r border-cream-200 flex flex-col h-screen">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-cream-200">
        <h1 className="font-serif text-2xl text-neutral-800">All In</h1>
        {currentQuarter && (
          <p className="text-sm text-neutral-500 mt-1">{currentQuarter}</p>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-6 py-3 text-left transition-all',
              activeTab === item.id
                ? 'bg-cream-100 text-primary-600 border-r-2 border-primary-400'
                : 'text-neutral-600 hover:bg-cream-100 hover:text-neutral-800'
            )}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-cream-200">
        <p className="text-xs text-neutral-400 text-center font-serif italic">
          Your journey, your way.
        </p>
      </div>
    </nav>
  );
}
