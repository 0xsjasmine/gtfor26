'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface Trail {
  x: number;
  y: number;
  id: number;
}

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const trailIdRef = useRef(0);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 400 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setIsVisible(true);

    // Add trail particle
    trailIdRef.current += 1;
    setTrails(prev => [
      ...prev.slice(-8),
      { x: e.clientX, y: e.clientY, id: trailIdRef.current }
    ]);
  }, [cursorX, cursorY]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  // Check for hoverable elements
  const checkHover = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, input, textarea, [role="button"], .cursor-pointer');
    setIsHovering(!!isInteractive);
  }, []);

  useEffect(() => {
    // Check if we're on a device that supports hover
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', checkHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', checkHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [handleMouseMove, checkHover, handleMouseEnter, handleMouseLeave, handleMouseDown, handleMouseUp]);

  // Clean up old trails
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTrails(prev => prev.slice(-6));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail particles */}
      {trails.map((trail, index) => (
        <motion.div
          key={trail.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: trail.x,
            top: trail.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="rounded-full"
            style={{
              width: 8 - index * 0.5,
              height: 8 - index * 0.5,
              background: `linear-gradient(135deg, rgba(183, 148, 246, ${0.4 - index * 0.05}), rgba(168, 201, 168, ${0.4 - index * 0.05}))`,
            }}
          />
        </motion.div>
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: smoothX,
          top: smoothY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          className="rounded-full border-2"
          style={{
            borderColor: isHovering ? 'rgba(183, 148, 246, 0.8)' : 'rgba(255, 255, 255, 0.5)',
          }}
          animate={{
            width: isHovering ? 48 : isClicking ? 28 : 36,
            height: isHovering ? 48 : isClicking ? 28 : 36,
            borderWidth: isClicking ? 3 : 2,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed pointer-events-none z-[10000]"
        style={{
          left: cursorX,
          top: cursorY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            background: 'linear-gradient(135deg, #B794F6, #A8C9A8)',
          }}
          animate={{
            width: isClicking ? 12 : isHovering ? 8 : 6,
            height: isClicking ? 12 : isHovering ? 8 : 6,
            opacity: isHovering ? 1 : 0.8,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          left: smoothX,
          top: smoothY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(183, 148, 246, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            width: isHovering ? 80 : 50,
            height: isHovering ? 80 : 50,
            opacity: isHovering ? 0.6 : 0.3,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </motion.div>
    </>
  );
}
