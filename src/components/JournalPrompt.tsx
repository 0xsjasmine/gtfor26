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
  prompts: string[];
}> = {
  morning: {
    title: 'Morning Intention',
    icon: Sun,
    prompts: [
      "What's the one thing that would make today great?",
      "What am I grateful for right now?",
      "How am I feeling, and what does that tell me?",
    ],
  },
  evening: {
    title: 'Evening Reflection',
    icon: Moon,
    prompts: [
      "What did I accomplish today?",
      "What challenged me, and what did I learn?",
      "What's one thing I could have done better?",
    ],
  },
  weekly_planning: {
    title: 'Weekly Planning',
    icon: CalendarDays,
    prompts: [
      "What are my top 3 priorities this week?",
      "What's one goal I'll make progress on?",
      "What might get in my way, and how will I handle it?",
    ],
  },
  weekly_review: {
    title: 'Weekly Review',
    icon: Sparkles,
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
      "bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm",
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-50">
            <Icon className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-neutral-800">{config.title}</h3>
            {isComplete && !isExpanded && (
              <p className="text-xs text-primary-500 flex items-center gap-1">
                <Check className="w-3 h-3" /> Completed
              </p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {config.prompts.map((prompt, index) => (
            <div key={index}>
              <label className="block text-sm text-neutral-700 mb-2">
                {prompt}
              </label>
              <textarea
                value={responses[index]}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder="Take a moment to reflect..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
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
                ? "bg-primary-400 text-white hover:bg-primary-500"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            {isSaving ? 'Saving...' : isComplete ? 'Update' : 'Complete Reflection'}
          </button>
        </div>
      )}
    </div>
  );
}
