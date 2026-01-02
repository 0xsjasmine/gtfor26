'use client';

import { SideNav, MainContent, AIChat } from '@/components';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { getCurrentQuarter } from '@/lib/utils';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { currentQuarter, setCurrentQuarter } = useAppStore();

  // Prevent hydration mismatch and set default quarter
  useEffect(() => {
    setMounted(true);
    if (!currentQuarter) {
      setCurrentQuarter(getCurrentQuarter());
    }
  }, [currentQuarter, setCurrentQuarter]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="animate-pulse text-warm-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <MainContent />
      <AIChat />
    </div>
  );
}
