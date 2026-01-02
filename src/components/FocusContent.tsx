'use client';

import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { VibeCard } from './VibeCard';
import { GoalCard } from './GoalCard';
import { formatWeekRange, formatDate, getCurrentQuarter } from '@/lib/utils';
import type { FocusView, VibeType } from '@/types';

const focusViews: { id: FocusView; label: string }[] = [
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
  { id: 'quarter', label: 'Quarter' },
];

export function FocusContent() {
  const {
    focusView,
    setFocusView,
    goals,
    currentVibeCode,
    setVibeCode,
    currentQuarter,
  } = useAppStore();

  const activeGoals = goals.filter((g) => g.status === 'active');
  const backloggedGoals = goals.filter((g) => g.status === 'backlogged');
  const focusGoalIds = currentVibeCode?.focus_goals || [];
  const focusGoals = activeGoals.filter((g) => focusGoalIds.includes(g.id));
  const otherActiveGoals = activeGoals.filter((g) => !focusGoalIds.includes(g.id));

  const handleVibeChange = (vibe: VibeType) => {
    if (currentVibeCode) {
      setVibeCode({
        ...currentVibeCode,
        vibe_type: vibe,
        is_user_override: true,
      });
    } else {
      setVibeCode({
        id: Date.now().toString(),
        user_id: '',
        week_start_date: new Date().toISOString(),
        vibe_type: vibe,
        focus_goals: [],
        backlogged_goals: [],
        created_at: new Date().toISOString(),
        is_user_override: true,
      });
    }
  };

  return (
    <div className="h-full overflow-auto p-6 bg-warm-50">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-warm-900">Focus</h1>
            <p className="text-warm-500">
              {focusView === 'week' && formatWeekRange()}
              {focusView === 'day' && formatDate(new Date(), 'EEEE, MMMM d')}
              {focusView === 'quarter' && (currentQuarter || getCurrentQuarter())}
            </p>
          </div>
          <ViewToggle
            views={focusViews}
            activeView={focusView}
            onChange={setFocusView}
          />
        </div>

        {/* Vibe Mode */}
        {(focusView === 'week' || focusView === 'day') && currentVibeCode && (
          <div className="mb-6">
            <VibeCard
              vibeType={currentVibeCode.vibe_type}
              isUserOverride={currentVibeCode.is_user_override}
              onChangeVibe={handleVibeChange}
            />
          </div>
        )}

        {/* No vibe set message */}
        {(focusView === 'week' || focusView === 'day') && !currentVibeCode && (
          <div className="mb-6 p-6 bg-warm-100 rounded-xl text-center border border-warm-200">
            <p className="text-warm-700">No vibe mode set for this week yet.</p>
            <p className="text-sm text-warm-500 mt-1">Chat with the AI to generate one!</p>
          </div>
        )}

        {/* Focus Goals */}
        {focusGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-warm-800 mb-3">This Week's Focus</h2>
            <div className="space-y-3">
              {focusGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {/* Other Active Goals */}
        {otherActiveGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-warm-800 mb-3">Active Goals</h2>
            <div className="space-y-3">
              {otherActiveGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {/* No goals message */}
        {activeGoals.length === 0 && (
          <div className="p-8 bg-white rounded-xl text-center border border-warm-200">
            <p className="text-warm-700 mb-1">No goals yet.</p>
            <p className="text-sm text-warm-500">Head to the Goals tab to add your first one!</p>
          </div>
        )}

        {/* Backlogged Goals (shown as dimmed) */}
        {backloggedGoals.length > 0 && focusView !== 'day' && (
          <div>
            <h2 className="text-lg font-semibold text-warm-500 mb-3">Backlogged</h2>
            <div className="space-y-3">
              {backloggedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} isBacklogged />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
