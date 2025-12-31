'use client';

import { useAppStore } from '@/store/app-store';
import { ViewToggle } from './ViewToggle';
import { EnvyLogCard } from './EnvyLogCard';
import { formatDate } from '@/lib/utils';
import type { SignalsView, EnvyCategory } from '@/types';

const signalsViews: { id: SignalsView; label: string }[] = [
  { id: 'envy', label: 'Envy Patterns' },
  { id: 'reflections', label: 'Reflections' },
];

const categoryColors: Record<EnvyCategory, string> = {
  travel: 'bg-sky-500',
  career: 'bg-purple-500',
  relationships: 'bg-pink-500',
  creative: 'bg-orange-500',
  recognition: 'bg-yellow-500',
  freedom: 'bg-teal-500',
  lifestyle: 'bg-indigo-500',
  other: 'bg-gray-500',
};

export function SignalsContent() {
  const { signalsView, setSignalsView, envyLogs, reflections } = useAppStore();

  // Calculate envy patterns
  const envyByCategory = envyLogs.reduce((acc, log) => {
    acc[log.category_tag] = (acc[log.category_tag] || 0) + 1;
    return acc;
  }, {} as Record<EnvyCategory, number>);

  const sortedCategories = Object.entries(envyByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const totalEnvyLogs = envyLogs.length;

  // Group envy logs by month
  const envyByMonth = envyLogs.reduce((acc, log) => {
    const month = formatDate(log.date, 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push(log);
    return acc;
  }, {} as Record<string, typeof envyLogs>);

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Signals</h1>
            <p className="text-gray-500">Patterns and reflections from your journey</p>
          </div>
          <ViewToggle
            views={signalsViews}
            activeView={signalsView}
            onChange={setSignalsView}
          />
        </div>

        {signalsView === 'envy' && (
          <>
            {/* Intro */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="font-medium text-purple-900 mb-2">Understanding Your Envy</h3>
              <p className="text-sm text-purple-700">
                Envy and jealousy are directional signals, not character flaws. They point you toward what you actually want. Track them here to discover patterns in your desires.
              </p>
            </div>

            {/* Pattern Summary */}
            {sortedCategories.length > 0 && (
              <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-4">Top Envy Categories</h3>
                <div className="space-y-3">
                  {sortedCategories.map(([category, count]) => (
                    <div key={category} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize">{category}</span>
                          <span className="text-sm text-gray-500">{count}x</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${categoryColors[category as EnvyCategory]}`}
                            style={{ width: `${(count / totalEnvyLogs) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Envy Logs by Month */}
            {Object.entries(envyByMonth).map(([month, logs]) => (
              <div key={month} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">{month}</h2>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <EnvyLogCard key={log.id} log={log} />
                  ))}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {envyLogs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-2">No envy signals logged yet.</p>
                <p className="text-sm text-gray-500">
                  When you notice envy or jealousy, share it in the chat. Those feelings are valuable data!
                </p>
              </div>
            )}
          </>
        )}

        {signalsView === 'reflections' && (
          <>
            {reflections.length > 0 ? (
              <div className="space-y-4">
                {reflections.map((reflection) => (
                  <div
                    key={reflection.id}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">{reflection.period}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                        {reflection.type}
                      </span>
                    </div>
                    {reflection.llm_insights && (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700">{reflection.llm_insights}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-4">
                      {formatDate(reflection.created_at, 'MMM d, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-2">No reflections yet.</p>
                <p className="text-sm text-gray-500">
                  Monthly and quarterly reflections will appear here after you complete them.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
