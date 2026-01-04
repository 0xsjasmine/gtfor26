'use client';

import { SideNav, MainContent, AIChat, LandingPage } from '@/components';
import { FlowingBackground } from '@/components/FlowingBackground';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { getCurrentQuarter } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { currentQuarter, setCurrentQuarter, isOnboarded, setOnboarded } = useAppStore();

  useEffect(() => {
    setMounted(true);
    if (!currentQuarter) {
      setCurrentQuarter(getCurrentQuarter());
    }
  }, [currentQuarter, setCurrentQuarter]);

  const handleEnterApp = () => {
    setOnboarded(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream-50 to-sage-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-neutral-400"
        >
          <div className="w-8 h-8 rounded-full border-2 border-lavender-300 border-t-lavender-500 animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isOnboarded ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          <LandingPage onEnter={handleEnterApp} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Dreamy background for main app */}
          <FlowingBackground />

          {/* Main app content */}
          <div className="relative z-10 flex h-screen overflow-hidden">
            <SideNav />
            <MainContent />
            <AIChat />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
