'use client';

import { useAppStore } from '@/store/app-store';
import { SideNav, MainContent, AIChat, Onboarding } from '@/components';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isOnboarded } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <MainContent />
      <AIChat />
    </div>
  );
}
