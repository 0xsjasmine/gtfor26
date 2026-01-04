'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { EnergyLevel } from '@/types';

interface FlowVisualizationProps {
  value: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
  labels?: { value: EnergyLevel; label: string }[];
}

const defaultLabels: { value: EnergyLevel; label: string }[] = [
  { value: 1, label: 'Recharging' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Rising' },
  { value: 4, label: 'Aligned' },
  { value: 5, label: 'Powerful' },
];

// Wave configuration per energy level
const waveConfigs = {
  1: { amplitude: 8, frequency: 0.5, speed: 0.5, color: 'from-lavender-200 to-sage-200' },
  2: { amplitude: 12, frequency: 0.7, speed: 0.7, color: 'from-lavender-300 to-sage-300' },
  3: { amplitude: 18, frequency: 1.0, speed: 1.0, color: 'from-lavender-400 to-sage-400' },
  4: { amplitude: 24, frequency: 1.3, speed: 1.3, color: 'from-lavender-500 to-sage-500' },
  5: { amplitude: 32, frequency: 1.6, speed: 1.8, color: 'from-lavender-600 to-sage-600' },
};

export function FlowVisualization({
  value,
  onChange,
  labels = defaultLabels,
}: FlowVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [hoveredLevel, setHoveredLevel] = useState<EnergyLevel | null>(null);

  const activeLevel = hoveredLevel || value;
  const config = waveConfigs[activeLevel];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw multiple wave layers
      const waves = [
        { offset: 0, alpha: 0.3 },
        { offset: Math.PI * 0.5, alpha: 0.5 },
        { offset: Math.PI, alpha: 0.7 },
      ];

      waves.forEach(({ offset, alpha }) => {
        ctx.beginPath();
        ctx.moveTo(0, rect.height / 2);

        for (let x = 0; x <= rect.width; x++) {
          const normalizedX = x / rect.width;
          const y =
            rect.height / 2 +
            Math.sin((normalizedX * Math.PI * 2 * config.frequency) + time * config.speed + offset) *
              config.amplitude +
            Math.sin((normalizedX * Math.PI * 4 * config.frequency) + time * config.speed * 1.5 + offset) *
              (config.amplitude * 0.3);

          ctx.lineTo(x, y);
        }

        ctx.lineTo(rect.width, rect.height);
        ctx.lineTo(0, rect.height);
        ctx.closePath();

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
        gradient.addColorStop(0, `rgba(183, 148, 246, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(168, 201, 168, ${alpha})`);
        gradient.addColorStop(1, `rgba(183, 148, 246, ${alpha})`);

        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw flowing particles
      const particleCount = Math.floor(config.amplitude / 4);
      for (let i = 0; i < particleCount; i++) {
        const px = ((time * 50 * config.speed + i * 80) % (rect.width + 40)) - 20;
        const py =
          rect.height / 2 +
          Math.sin((px / rect.width * Math.PI * 2 * config.frequency) + time * config.speed) *
            config.amplitude;

        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(time + i) * 0.3})`;
        ctx.fill();
      }

      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [config]);

  const currentLabel = labels.find((l) => l.value === value)?.label || '';

  return (
    <div className="space-y-4">
      {/* Wave visualization */}
      <div className="relative h-24 bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/60 shadow-glass">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Floating label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-lg font-display text-white drop-shadow-lg">
              {labels.find((l) => l.value === activeLevel)?.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Level selector dots */}
      <div className="flex items-center justify-between px-2">
        {labels.map((level) => (
          <motion.button
            key={level.value}
            onHoverStart={() => setHoveredLevel(level.value)}
            onHoverEnd={() => setHoveredLevel(null)}
            onClick={() => onChange(level.value)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="relative group"
          >
            <motion.div
              className={cn(
                "w-4 h-4 rounded-full transition-all",
                value === level.value
                  ? "bg-gradient-to-r from-lavender-500 to-sage-500 shadow-lg"
                  : "bg-neutral-200 group-hover:bg-neutral-300"
              )}
              animate={{
                scale: value === level.value ? 1.25 : 1,
              }}
            />

            {/* Ripple effect on selection */}
            {value === level.value && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-lavender-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              />
            )}

            {/* Tooltip */}
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-neutral-600 whitespace-nowrap bg-white/90 px-2 py-1 rounded-lg shadow-sm"
            >
              {level.label}
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Current level display */}
      <motion.p
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm text-neutral-500"
      >
        Your energy is <span className="font-medium text-neutral-700">{currentLabel.toLowerCase()}</span>
      </motion.p>
    </div>
  );
}

// Compact version for inline use
export function FlowDots({
  value,
  onChange,
}: {
  value: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
}) {
  return (
    <div className="flex gap-3">
      {[1, 2, 3, 4, 5].map((level) => (
        <motion.button
          key={level}
          onClick={() => onChange(level as EnergyLevel)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.8 }}
          className="relative"
        >
          <motion.div
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              level <= value
                ? "bg-gradient-to-r from-lavender-400 to-sage-400"
                : "bg-neutral-200"
            )}
            animate={{
              scale: level === value ? 1.4 : 1,
            }}
          />
          {level === value && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(183,148,246,0.4) 0%, transparent 70%)',
              }}
              initial={{ scale: 1 }}
              animate={{ scale: 2.5 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
