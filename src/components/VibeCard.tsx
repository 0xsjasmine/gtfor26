'use client';

import { cn, getVibeDescription, formatWeekRange } from '@/lib/utils';
import type { VibeType } from '@/types';
import { Zap, Users, Layers, Moon, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/app-store';

interface VibeCardProps {
  vibeType: VibeType;
  weekRange?: string;
  isUserOverride?: boolean;
  onChangeVibe?: (vibe: VibeType) => void;
}

const vibeIcons: Record<VibeType, React.ReactNode> = {
  'Deep Build': <Zap className="w-6 h-6" />,
  'Community': <Users className="w-6 h-6" />,
  'Integration': <Layers className="w-6 h-6" />,
  'Rest': <Moon className="w-6 h-6" />,
};

const vibeColors: Record<VibeType, string> = {
  'Deep Build': 'bg-purple-100 text-purple-700 border-purple-300',
  'Community': 'bg-blue-100 text-blue-700 border-blue-300',
  'Integration': 'bg-green-100 text-green-700 border-green-300',
  'Rest': 'bg-amber-100 text-amber-700 border-amber-300',
};

const allVibes: VibeType[] = ['Deep Build', 'Community', 'Integration', 'Rest'];

export function VibeCard({ vibeType, weekRange, isUserOverride, onChangeVibe }: VibeCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={cn(
      'rounded-xl border-2 p-6',
      vibeColors[vibeType]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {vibeIcons[vibeType]}
          <div>
            <h2 className="text-xl font-semibold">{vibeType} Mode</h2>
            <p className="text-sm opacity-80">
              {weekRange || formatWeekRange()}
            </p>
          </div>
        </div>

        {onChangeVibe && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/50 hover:bg-white/70 rounded-lg text-sm font-medium"
            >
              Override
              <ChevronDown className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                {allVibes.map((vibe) => (
                  <button
                    key={vibe}
                    onClick={() => {
                      onChangeVibe(vibe);
                      setShowDropdown(false);
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2',
                      vibe === vibeType && 'bg-gray-50 font-medium'
                    )}
                  >
                    {vibeIcons[vibe]}
                    {vibe}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm">
        {getVibeDescription(vibeType)}
      </p>

      {isUserOverride && (
        <p className="mt-2 text-xs opacity-60">
          (You overrode the AI suggestion)
        </p>
      )}
    </div>
  );
}
