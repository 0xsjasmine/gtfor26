'use client';

import { useAppStore } from '@/store/app-store';
import { FocusContent } from './FocusContent';
import { GoalsContent } from './GoalsContent';
import { SignalsContent } from './SignalsContent';

export function MainContent() {
  const { activeTab } = useAppStore();

  return (
    <main className="flex-1 bg-gray-50 overflow-hidden">
      {activeTab === 'focus' && <FocusContent />}
      {activeTab === 'goals' && <GoalsContent />}
      {activeTab === 'signals' && <SignalsContent />}
    </main>
  );
}
