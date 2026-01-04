'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FlowLine {
  id: number;
  x: number;
  delay: number;
  duration: number;
  opacity: number;
  width: number;
}

export function FlowingBackground() {
  const [flowLines, setFlowLines] = useState<FlowLine[]>([]);

  useEffect(() => {
    // Generate random flow lines
    const lines: FlowLine[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2,
      width: 1 + Math.random() * 2,
    }));
    setFlowLines(lines);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-lavender-50 via-cream-50 to-sage-50" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(183, 148, 246, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 201, 168, 0.12) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 176, 196, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -80, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Flowing lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(183, 148, 246, 0)" />
            <stop offset="50%" stopColor="rgba(183, 148, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(183, 148, 246, 0)" />
          </linearGradient>
          <linearGradient id="flowGradientSage" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 201, 168, 0)" />
            <stop offset="50%" stopColor="rgba(168, 201, 168, 0.25)" />
            <stop offset="100%" stopColor="rgba(168, 201, 168, 0)" />
          </linearGradient>
        </defs>

        {flowLines.map((line) => (
          <motion.path
            key={line.id}
            d={`M -100 ${line.x * 10} Q ${50 + line.x} ${line.x * 8}, 100 ${line.x * 10} T 300 ${line.x * 10}`}
            fill="none"
            stroke={line.id % 2 === 0 ? 'url(#flowGradient)' : 'url(#flowGradientSage)'}
            strokeWidth={line.width}
            opacity={line.opacity}
            initial={{ pathLength: 0, pathOffset: 1 }}
            animate={{ pathLength: 1, pathOffset: 0 }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: line.delay,
            }}
            style={{
              transform: `translateY(${line.x * 3}vh)`,
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: i % 3 === 0
                ? 'rgba(183, 148, 246, 0.4)'
                : i % 3 === 1
                ? 'rgba(168, 201, 168, 0.4)'
                : 'rgba(255, 176, 196, 0.3)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
