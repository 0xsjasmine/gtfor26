'use client';

import { motion } from 'framer-motion';
import { FlowingBackground } from './FlowingBackground';
import { ArrowRight, Sparkles, Heart, Target } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <FlowingBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center shadow-dreamy">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl text-neutral-700">All In</span>
          </div>
        </motion.div>

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="font-display text-5xl md:text-7xl text-neutral-800 leading-tight mb-6">
            Flow through
            <br />
            <span className="bg-gradient-to-r from-lavender-500 via-sage-500 to-rose-400 bg-clip-text text-transparent">
              your intentions
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 leading-relaxed">
            A dreamy space for setting intentions, tracking progress,
            <br className="hidden md:block" />
            and becoming who you're meant to be.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[
            { icon: Target, label: 'Set Intentions' },
            { icon: Heart, label: 'Track Energy' },
            { icon: Sparkles, label: 'Weekly Wrapped' },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/80 shadow-soft"
            >
              <feature.icon className="w-4 h-4 text-lavender-500" />
              <span className="text-sm text-neutral-600">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="group relative px-10 py-5 bg-gradient-to-r from-lavender-400 to-lavender-500 text-white rounded-2xl font-medium text-lg shadow-dreamy hover:shadow-lg transition-shadow"
        >
          <span className="relative z-10 flex items-center gap-3">
            Begin your journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-lavender-400 to-lavender-500 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
        </motion.button>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 text-sm text-neutral-400 font-serif italic"
        >
          Your journey, your way.
        </motion.p>
      </div>
    </div>
  );
}
