'use client';

import { useAppStore } from '@/store/app-store';
import { FocusContent } from './FocusContent';
import { GoalsContent } from './GoalsContent';
import { SignalsContent } from './SignalsContent';
import { PageTransition } from './PageTransition';

export function MainContent() {
  const { activeTab } = useAppStore();

  return (
    <main className="flex-1 bg-transparent overflow-hidden">
      <PageTransition pageKey={activeTab} direction="horizontal">
        {activeTab === 'focus' && <FocusContent />}
        {activeTab === 'goals' && <GoalsContent />}
        {activeTab === 'signals' && <SignalsContent />}
      </PageTransition>
    </main>
  );
}
