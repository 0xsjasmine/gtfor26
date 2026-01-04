'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // 0-1, how strong the tilt effect is
  magneticPull?: number; // 0-1, how strong elements pull toward cursor
  glare?: boolean; // Show glare effect on hover
}

export function MagneticCard({
  children,
  className = '',
  intensity = 0.5,
  magneticPull = 0.3,
  glare = true,
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth, natural movement
  const springConfig = { damping: 25, stiffness: 300 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10 * intensity, -10 * intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10 * intensity, 10 * intensity]), springConfig);

  // Magnetic pull effect
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10 * magneticPull, 10 * magneticPull]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10 * magneticPull, 10 * magneticPull]), springConfig);

  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {/* Card content */}
      <div style={{ transform: 'translateZ(0)' }}>
        {children}
      </div>

      {/* Glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          style={{
            opacity: isHovered ? 0.15 : 0,
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Depth shadow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl"
        style={{
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(183, 148, 246, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
            : '0 4px 30px rgba(0, 0, 0, 0.05)',
          transform: 'translateZ(-20px)',
        }}
        animate={{
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(183, 148, 246, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.1)'
            : '0 4px 30px rgba(0, 0, 0, 0.05)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Simpler version for buttons and small elements
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 400 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{
        x: springX,
        y: springY,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
