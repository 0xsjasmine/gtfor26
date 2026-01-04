'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  type: 'confetti' | 'sparkle' | 'circle';
}

interface CelebrationEffectProps {
  trigger: boolean;
  origin?: { x: number; y: number };
  type?: 'confetti' | 'sparkle' | 'burst';
  colors?: string[];
  particleCount?: number;
  onComplete?: () => void;
}

const defaultColors = ['#B794F6', '#A8C9A8', '#FFB0C4', '#F3EFFE', '#E8F0E8'];

export function CelebrationEffect({
  trigger,
  origin,
  type = 'confetti',
  colors = defaultColors,
  particleCount = 50,
  onComplete,
}: CelebrationEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const createParticles = useCallback(() => {
    const centerX = origin?.x ?? window.innerWidth / 2;
    const centerY = origin?.y ?? window.innerHeight / 2;

    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 5 + Math.random() * 10;
      const types: Array<'confetti' | 'sparkle' | 'circle'> = ['confetti', 'sparkle', 'circle'];

      return {
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity * (0.5 + Math.random()),
        vy: Math.sin(angle) * velocity * (0.5 + Math.random()) - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
        type: types[Math.floor(Math.random() * types.length)],
      };
    });

    setParticles(newParticles);
    setIsActive(true);

    // Clean up after animation
    setTimeout(() => {
      setIsActive(false);
      setParticles([]);
      onComplete?.();
    }, 2000);
  }, [origin, particleCount, colors, onComplete]);

  useEffect(() => {
    if (trigger) {
      createParticles();
    }
  }, [trigger, createParticles]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10001] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 1,
              rotate: particle.rotation,
            }}
            animate={{
              x: particle.x + particle.vx * 30,
              y: particle.y + particle.vy * 30 + 200, // gravity
              scale: 0,
              opacity: 0,
              rotate: particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          >
            {particle.type === 'confetti' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: particle.color,
                  borderRadius: '2px',
                }}
              />
            )}
            {particle.type === 'sparkle' && (
              <svg viewBox="0 0 24 24" className="w-full h-full" style={{ color: particle.color }}>
                <path
                  fill="currentColor"
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                />
              </svg>
            )}
            {particle.type === 'circle' && (
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: particle.color }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Sparkle effect for checkmarks and completions
interface SparkleProps {
  trigger: boolean;
  x: number;
  y: number;
}

export function Sparkle({ trigger, x, y }: SparkleProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  useEffect(() => {
    if (trigger) {
      setSparkles(
        Array.from({ length: 8 }, (_, i) => ({
          id: i,
          angle: (i * 45) + Math.random() * 20 - 10,
          distance: 20 + Math.random() * 15,
        }))
      );

      setTimeout(() => setSparkles([]), 600);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            x: Math.cos((sparkle.angle * Math.PI) / 180) * sparkle.distance,
            y: Math.sin((sparkle.angle * Math.PI) / 180) * sparkle.distance,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #B794F6, #A8C9A8)',
            }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// Success checkmark animation
interface SuccessCheckProps {
  show: boolean;
}

export function SuccessCheck({ show }: SuccessCheckProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="relative"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.path
              d="M5 12l5 5L20 7"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
