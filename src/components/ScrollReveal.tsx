'use client';

import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 30,
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
    none: { y: 0, x: 0 },
  };

  const offset = directions[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax effect on scroll
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Scale up effect on scroll
export function ScrollScale({
  children,
  className,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Blur reveal effect
export function BlurReveal({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ filter: 'blur(10px)', opacity: 0 }}
      animate={
        isInView
          ? { filter: 'blur(0px)', opacity: 1 }
          : { filter: 'blur(10px)', opacity: 0 }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Counter animation on scroll
interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  end,
  duration = 2,
  className,
  prefix = '',
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now();
      const durationMs = duration * 1000;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / durationMs, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {prefix}{count}{suffix}
    </motion.span>
  );
}

// Staggered reveal for lists
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  containerClassName?: string;
  staggerDelay?: number;
}

export function StaggerReveal({
  children,
  className,
  containerClassName,
  staggerDelay = 0.1,
}: StaggerRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={containerClassName}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className={className}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Rotate and reveal
export function RotateReveal({
  children,
  className,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ rotateX: 45, opacity: 0, y: 20 }}
      animate={
        isInView
          ? { rotateX: 0, opacity: 1, y: 0 }
          : { rotateX: 45, opacity: 0, y: 20 }
      }
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      style={{ perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Progress bar that fills on scroll
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={className || 'fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-lavender-400 to-sage-400 origin-left z-[9999]'}
      style={{ scaleX: scrollYProgress }}
    />
  );
}
