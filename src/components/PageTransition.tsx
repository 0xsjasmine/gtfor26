'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
  direction?: 'horizontal' | 'vertical' | 'fade' | 'scale';
}

const variants = {
  horizontal: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  vertical: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.02, opacity: 0 },
  },
};

export function PageTransition({
  children,
  pageKey,
  direction = 'horizontal',
}: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants[direction]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 30,
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered list animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.05,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Modal transition wrapper
interface ModalTransitionProps {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
}

export function ModalTransition({ isOpen, children, onClose }: ModalTransitionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999]"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Slide in from edge
interface SlideInProps {
  children: ReactNode;
  from?: 'left' | 'right' | 'top' | 'bottom';
  isVisible?: boolean;
  className?: string;
}

export function SlideIn({
  children,
  from = 'right',
  isVisible = true,
  className,
}: SlideInProps) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    top: { x: 0, y: -100 },
    bottom: { x: 0, y: 100 },
  };

  const offset = directions[from];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ ...offset, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={{ ...offset, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Pop effect for notifications/toasts
export function PopIn({
  children,
  isVisible = true,
  className,
}: {
  children: ReactNode;
  isVisible?: boolean;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
