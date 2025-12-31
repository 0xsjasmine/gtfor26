import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  NavTab,
  FocusView,
  GoalsView,
  SignalsView,
  Goal,
  AntiGoal,
  VibeCode,
  BacklogItem,
  ChatMessage,
  EnvyLog,
  DailyCheckIn,
  Reflection
} from '@/types';

interface AppStore {
  // Navigation state
  activeTab: NavTab;
  focusView: FocusView;
  goalsView: GoalsView;
  signalsView: SignalsView;
  isChatMinimized: boolean;

  // User data
  currentQuarter: string;
  goals: Goal[];
  antiGoals: AntiGoal[];
  currentVibeCode: VibeCode | null;
  backlogItems: BacklogItem[];
  chatMessages: ChatMessage[];
  envyLogs: EnvyLog[];
  dailyCheckIns: DailyCheckIn[];
  reflections: Reflection[];

  // Onboarding
  isOnboarded: boolean;
  onboardingStep: number;

  // Navigation actions
  setActiveTab: (tab: NavTab) => void;
  setFocusView: (view: FocusView) => void;
  setGoalsView: (view: GoalsView) => void;
  setSignalsView: (view: SignalsView) => void;
  toggleChat: () => void;

  // Data actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  setAntiGoals: (antiGoals: AntiGoal[]) => void;
  addAntiGoal: (antiGoal: AntiGoal) => void;
  deleteAntiGoal: (id: string) => void;

  setVibeCode: (vibeCode: VibeCode | null) => void;

  setBacklogItems: (items: BacklogItem[]) => void;
  addBacklogItem: (item: BacklogItem) => void;
  updateBacklogItem: (id: string, updates: Partial<BacklogItem>) => void;

  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;

  addEnvyLog: (log: EnvyLog) => void;
  setEnvyLogs: (logs: EnvyLog[]) => void;

  addDailyCheckIn: (checkIn: DailyCheckIn) => void;
  setDailyCheckIns: (checkIns: DailyCheckIn[]) => void;

  setReflections: (reflections: Reflection[]) => void;

  // Onboarding actions
  setOnboarded: (value: boolean) => void;
  setOnboardingStep: (step: number) => void;
  setCurrentQuarter: (quarter: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  activeTab: 'focus' as NavTab,
  focusView: 'week' as FocusView,
  goalsView: 'quarter' as GoalsView,
  signalsView: 'envy' as SignalsView,
  isChatMinimized: false,
  currentQuarter: '',
  goals: [],
  antiGoals: [],
  currentVibeCode: null,
  backlogItems: [],
  chatMessages: [],
  envyLogs: [],
  dailyCheckIns: [],
  reflections: [],
  isOnboarded: false,
  onboardingStep: 0,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Navigation actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setFocusView: (view) => set({ focusView: view }),
      setGoalsView: (view) => set({ goalsView: view }),
      setSignalsView: (view) => set({ signalsView: view }),
      toggleChat: () => set((state) => ({ isChatMinimized: !state.isChatMinimized })),

      // Goals actions
      setGoals: (goals) => set({ goals }),
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      // Anti-goals actions
      setAntiGoals: (antiGoals) => set({ antiGoals }),
      addAntiGoal: (antiGoal) => set((state) => ({ antiGoals: [...state.antiGoals, antiGoal] })),
      deleteAntiGoal: (id) => set((state) => ({
        antiGoals: state.antiGoals.filter((a) => a.id !== id)
      })),

      // Vibe code actions
      setVibeCode: (vibeCode) => set({ currentVibeCode: vibeCode }),

      // Backlog actions
      setBacklogItems: (items) => set({ backlogItems: items }),
      addBacklogItem: (item) => set((state) => ({ backlogItems: [...state.backlogItems, item] })),
      updateBacklogItem: (id, updates) => set((state) => ({
        backlogItems: state.backlogItems.map((b) => b.id === id ? { ...b, ...updates } : b)
      })),

      // Chat actions
      addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      setChatMessages: (messages) => set({ chatMessages: messages }),

      // Envy actions
      addEnvyLog: (log) => set((state) => ({ envyLogs: [...state.envyLogs, log] })),
      setEnvyLogs: (logs) => set({ envyLogs: logs }),

      // Check-in actions
      addDailyCheckIn: (checkIn) => set((state) => ({ dailyCheckIns: [...state.dailyCheckIns, checkIn] })),
      setDailyCheckIns: (checkIns) => set({ dailyCheckIns: checkIns }),

      // Reflection actions
      setReflections: (reflections) => set({ reflections }),

      // Onboarding actions
      setOnboarded: (value) => set({ isOnboarded: value }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setCurrentQuarter: (quarter) => set({ currentQuarter: quarter }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'gtfor26-storage',
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        currentQuarter: state.currentQuarter,
        goals: state.goals,
        antiGoals: state.antiGoals,
        currentVibeCode: state.currentVibeCode,
        backlogItems: state.backlogItems,
        envyLogs: state.envyLogs,
        dailyCheckIns: state.dailyCheckIns,
      }),
    }
  )
);
