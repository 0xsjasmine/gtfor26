'use client';

import { useState } from 'react';
import { cn, generateId } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import type { JournalType, JournalEntry } from '@/types';
import { Sun, Moon, CalendarDays, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface JournalPromptProps {
  type: JournalType;
  className?: string;
}

const journalConfig: Record<JournalType, {
  title: string;
  icon: typeof Sun;
  gradient: string;
  border: string;
  prompts: string[];
}> = {
  morning: {
    title: 'Morning Intention',
    icon: Sun,
    gradient: 'from-warm-50 to-accent-50',
    border: 'border-accent-200',
    prompts: [
      "What's the one thing that would make today great?",
      "What am I grateful for right now?",
      "How am I feeling, and what does that tell me?",
    ],
  },
  evening: {
    title: 'Evening Reflection',
    icon: Moon,
    gradient: 'from-sage-50 to-warm-50',
    border: 'border-sage-200',
    prompts: [
      "What did I accomplish today?",
      "What challenged me, and what did I learn?",
      "What's one thing I could have done better?",
    ],
  },
  weekly_planning: {
    title: 'Weekly Planning',
    icon: CalendarDays,
    gradient: 'from-accent-50 to-sage-50',
    border: 'border-accent-200',
    prompts: [
      "What are my top 3 priorities this week?",
      "What's one goal I'll make progress on?",
      "What might get in my way, and how will I handle it?",
    ],
  },
  weekly_review: {
    title: 'Weekly Review',
    icon: Sparkles,
    gradient: 'from-sage-50 to-accent-50',
    border: 'border-sage-200',
    prompts: [
      "What wins did I have this week?",
      "What didn't go as planned, and why?",
      "What do I want to do differently next week?",
    ],
  },
};

export function JournalPrompt({ type, className }: JournalPromptProps) {
  const { getTodayJournal, addJournalEntry, updateJournalEntry } = useAppStore();
  const config = journalConfig[type];
  const Icon = config.icon;

  const existingEntry = getTodayJournal(type);
  const [isExpanded, setIsExpanded] = useState(!existingEntry);
  const [responses, setResponses] = useState<string[]>(
    existingEntry?.responses || config.prompts.map(() => '')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(!!existingEntry?.responses?.every(r => r.length > 0));

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSave = () => {
    setIsSaving(true);
    const today = new Date().toISOString().split('T')[0];

    if (existingEntry) {
      updateJournalEntry(existingEntry.id, { responses });
    } else {
      const entry: JournalEntry = {
        id: generateId(),
        user_id: 'local',
        date: today,
        type,
        prompts: config.prompts,
        responses,
        created_at: new Date().toISOString(),
      };
      addJournalEntry(entry);
    }

    setIsComplete(responses.every(r => r.length > 0));
    setIsSaving(false);
    setIsExpanded(false);
  };

  const allFilled = responses.every(r => r.trim().length > 0);

  return (
    <div className={cn(
      `bg-gradient-to-br ${config.gradient} rounded-2xl border ${config.border} overflow-hidden shadow-sm`,
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/80">
            <Icon className="w-5 h-5 text-warm-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-warm-800">{config.title}</h3>
            {isComplete && !isExpanded && (
              <p className="text-xs text-sage-600 flex items-center gap-1">
                <Check className="w-3 h-3" /> Completed
              </p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-warm-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-warm-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {config.prompts.map((prompt, index) => (
            <div key={index}>
              <label className="block text-sm text-warm-700 mb-2">
                {prompt}
              </label>
              <textarea
                value={responses[index]}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder="Take a moment to reflect..."
                className="w-full px-4 py-3 bg-white/80 border border-warm-200 rounded-xl text-sm text-warm-800 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-accent-300 resize-none"
                rows={2}
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={!allFilled || isSaving}
            className={cn(
              "w-full py-3 rounded-xl font-medium text-sm transition-colors",
              allFilled
                ? "bg-accent-500 text-white hover:bg-accent-600"
                : "bg-warm-200 text-warm-400 cursor-not-allowed"
            )}
          >
            {isSaving ? 'Saving...' : isComplete ? 'Update' : 'Complete Reflection'}
          </button>
        </div>
      )}
    </div>
  );
}
