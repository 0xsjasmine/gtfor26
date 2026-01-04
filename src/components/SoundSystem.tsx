'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

// Sound types available
type SoundType =
  | 'click'
  | 'hover'
  | 'success'
  | 'complete'
  | 'transition'
  | 'toggle'
  | 'celebration';

interface SoundContextType {
  isEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType>({
  isEnabled: false,
  toggleSound: () => {},
  playSound: () => {},
});

export function useSounds() {
  return useContext(SoundContext);
}

// Sound frequencies for Web Audio API
const soundConfigs: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType; gain: number }> = {
  click: {
    frequencies: [800, 600],
    durations: [0.05, 0.03],
    type: 'sine',
    gain: 0.1,
  },
  hover: {
    frequencies: [400, 450],
    durations: [0.04, 0.04],
    type: 'sine',
    gain: 0.05,
  },
  success: {
    frequencies: [523, 659, 784], // C5, E5, G5 - happy chord
    durations: [0.15, 0.15, 0.2],
    type: 'sine',
    gain: 0.12,
  },
  complete: {
    frequencies: [440, 554, 659], // A4, C#5, E5
    durations: [0.1, 0.1, 0.15],
    type: 'sine',
    gain: 0.1,
  },
  transition: {
    frequencies: [300, 350, 400],
    durations: [0.08, 0.08, 0.1],
    type: 'sine',
    gain: 0.06,
  },
  toggle: {
    frequencies: [500, 700],
    durations: [0.05, 0.05],
    type: 'sine',
    gain: 0.08,
  },
  celebration: {
    frequencies: [523, 659, 784, 1047], // C5, E5, G5, C6
    durations: [0.12, 0.12, 0.12, 0.2],
    type: 'sine',
    gain: 0.15,
  },
};

interface SoundProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
}

export function SoundProvider({ children, defaultEnabled = false }: SoundProviderProps) {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize AudioContext on user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        setAudioContext(ctx);
      }
    };

    // Load saved preference
    const saved = localStorage.getItem('sound-enabled');
    if (saved !== null) {
      setIsEnabled(saved === 'true');
    }

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, [audioContext]);

  const toggleSound = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('sound-enabled', String(next));
      return next;
    });
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!isEnabled || !audioContext) return;

      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const config = soundConfigs[type];
      const now = audioContext.currentTime;

      config.frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, now);

        // Calculate start time for this note
        const startTime = now + config.durations.slice(0, i).reduce((a, b) => a + b, 0);
        const duration = config.durations[i];

        // Envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(config.gain, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.01);
      });
    },
    [isEnabled, audioContext]
  );

  return (
    <SoundContext.Provider value={{ isEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

// Sound toggle button component
export function SoundToggle({ className }: { className?: string }) {
  const { isEnabled, toggleSound, playSound } = useSounds();

  const handleToggle = () => {
    toggleSound();
    // Play a sound when enabling
    if (!isEnabled) {
      setTimeout(() => playSound('toggle'), 100);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={className || 'p-2 rounded-xl hover:bg-white/50 transition-colors'}
      title={isEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      <AnimatePresence mode="wait">
        {isEnabled ? (
          <motion.div
            key="on"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
          >
            <Volume2 className="w-5 h-5 text-lavender-500" />
          </motion.div>
        ) : (
          <motion.div
            key="off"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
          >
            <VolumeX className="w-5 h-5 text-neutral-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Hook for adding sound to buttons
export function useSoundButton(type: SoundType = 'click') {
  const { playSound } = useSounds();

  return {
    onClick: (callback?: () => void) => () => {
      playSound(type);
      callback?.();
    },
    onHover: () => {
      // Optionally play hover sound (disabled by default for less noise)
    },
  };
}

// Higher-order component for adding sounds
export function withSound<P extends object>(
  Component: React.ComponentType<P>,
  soundType: SoundType = 'click'
) {
  return function WithSoundComponent(props: P) {
    const { playSound } = useSounds();

    return (
      <div onClick={() => playSound(soundType)}>
        <Component {...props} />
      </div>
    );
  };
}
