'use client';

import { Target, ListTodo, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { NavTab } from '@/types';

const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  { id: 'focus', label: 'Focus', icon: <Target className="w-5 h-5" /> },
  { id: 'goals', label: 'Goals', icon: <ListTodo className="w-5 h-5" /> },
  { id: 'signals', label: 'Signals', icon: <Sparkles className="w-5 h-5" /> },
];

export function SideNav() {
  const { activeTab, setActiveTab, currentQuarter } = useAppStore();

  return (
    <nav className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900">GTFOR26</h1>
        {currentQuarter && (
          <p className="text-sm text-gray-500 mt-1">{currentQuarter}</p>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-6 py-3 text-left transition-colors',
              activeTab === item.id
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          AI-Powered Goal Management
        </p>
      </div>
    </nav>
  );
}
