import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  NavTab,
  FocusView,
  GoalsView,
  SignalsView,
  Goal,
  GoalAction,
  SuccessMeasure,
  AntiGoal,
  VibeCode,
  BacklogItem,
  ChatMessage,
  EnvyLog,
  DailyCheckIn,
  Reflection,
  JournalEntry,
  UserContext,
  AISuggestion,
  EnergyLevel,
} from '@/types';

interface AppStore {
  // Navigation state
  activeTab: NavTab;
  focusView: FocusView;
  goalsView: GoalsView;
  signalsView: SignalsView;
  isChatMinimized: boolean;
  selectedDate: string; // For calendar navigation

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

  // New data for enhanced features
  journalEntries: JournalEntry[];
  userContexts: UserContext[];
  aiSuggestions: AISuggestion[];
  currentGoalIndex: number; // For carousel navigation

  // Onboarding
  isOnboarded: boolean;
  onboardingStep: number;

  // Navigation actions
  setActiveTab: (tab: NavTab) => void;
  setFocusView: (view: FocusView) => void;
  setGoalsView: (view: GoalsView) => void;
  setSignalsView: (view: SignalsView) => void;
  toggleChat: () => void;
  setSelectedDate: (date: string) => void;
  setCurrentGoalIndex: (index: number) => void;
  nextGoal: () => void;
  prevGoal: () => void;

  // Data actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Goal actions (within goals)
  addGoalAction: (goalId: string, action: GoalAction) => void;
  updateGoalAction: (goalId: string, actionId: string, updates: Partial<GoalAction>) => void;
  deleteGoalAction: (goalId: string, actionId: string) => void;
  toggleActionComplete: (goalId: string, actionId: string) => void;
  scheduleAction: (goalId: string, actionId: string, date: string) => void;

  // Success measures
  addSuccessMeasure: (goalId: string, measure: SuccessMeasure) => void;
  updateSuccessMeasure: (goalId: string, measureId: string, updates: Partial<SuccessMeasure>) => void;
  deleteSuccessMeasure: (goalId: string, measureId: string) => void;

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

  // Journal entries
  addJournalEntry: (entry: JournalEntry) => void;
  setJournalEntries: (entries: JournalEntry[]) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;

  // User context (for adaptive AI)
  addUserContext: (context: UserContext) => void;
  setUserContexts: (contexts: UserContext[]) => void;
  getTodayContext: () => UserContext | undefined;
  updateTodayEnergy: (energy: EnergyLevel) => void;

  // AI suggestions
  addAISuggestion: (suggestion: AISuggestion) => void;
  setAISuggestions: (suggestions: AISuggestion[]) => void;
  acceptSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;

  // Onboarding actions
  setOnboarded: (value: boolean) => void;
  setOnboardingStep: (step: number) => void;
  setCurrentQuarter: (quarter: string) => void;

  // Helpers
  getScheduledActionsForDate: (date: string) => { action: GoalAction; goal: Goal }[];
  getActiveGoals: () => Goal[];
  getTodayJournal: (type: JournalEntry['type']) => JournalEntry | undefined;

  // Reset
  reset: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

const initialState = {
  activeTab: 'focus' as NavTab,
  focusView: 'day' as FocusView,
  goalsView: 'quarter' as GoalsView,
  signalsView: 'envy' as SignalsView,
  isChatMinimized: false,
  selectedDate: getToday(),
  currentQuarter: '',
  goals: [],
  antiGoals: [],
  currentVibeCode: null,
  backlogItems: [],
  chatMessages: [],
  envyLogs: [],
  dailyCheckIns: [],
  reflections: [],
  journalEntries: [],
  userContexts: [],
  aiSuggestions: [],
  currentGoalIndex: 0,
  isOnboarded: false,
  onboardingStep: 0,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setFocusView: (view) => set({ focusView: view }),
      setGoalsView: (view) => set({ goalsView: view }),
      setSignalsView: (view) => set({ signalsView: view }),
      toggleChat: () => set((state) => ({ isChatMinimized: !state.isChatMinimized })),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setCurrentGoalIndex: (index) => set({ currentGoalIndex: index }),
      nextGoal: () => set((state) => {
        const activeGoals = state.goals.filter(g => g.status === 'active');
        const nextIndex = (state.currentGoalIndex + 1) % activeGoals.length;
        return { currentGoalIndex: nextIndex };
      }),
      prevGoal: () => set((state) => {
        const activeGoals = state.goals.filter(g => g.status === 'active');
        const prevIndex = state.currentGoalIndex === 0 ? activeGoals.length - 1 : state.currentGoalIndex - 1;
        return { currentGoalIndex: prevIndex };
      }),

      // Goals actions
      setGoals: (goals) => set({ goals }),
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, ...updates, updated_at: new Date().toISOString() } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      // Goal actions management
      addGoalAction: (goalId, action) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? { ...g, actions: [...g.actions, action], updated_at: new Date().toISOString() }
            : g
        )
      })),
      updateGoalAction: (goalId, actionId, updates) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                actions: g.actions.map((a) => a.id === actionId ? { ...a, ...updates } : a),
                updated_at: new Date().toISOString()
              }
            : g
        )
      })),
      deleteGoalAction: (goalId, actionId) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? { ...g, actions: g.actions.filter((a) => a.id !== actionId), updated_at: new Date().toISOString() }
            : g
        )
      })),
      toggleActionComplete: (goalId, actionId) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                actions: g.actions.map((a) =>
                  a.id === actionId
                    ? {
                        ...a,
                        status: a.status === 'done' ? 'pending' : 'done',
                        completed_date: a.status === 'done' ? undefined : new Date().toISOString()
                      }
                    : a
                ),
                updated_at: new Date().toISOString()
              }
            : g
        )
      })),
      scheduleAction: (goalId, actionId, date) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                actions: g.actions.map((a) =>
                  a.id === actionId
                    ? { ...a, scheduled_date: date, status: 'scheduled' as const }
                    : a
                ),
                updated_at: new Date().toISOString()
              }
            : g
        )
      })),

      // Success measures
      addSuccessMeasure: (goalId, measure) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? { ...g, success_measures: [...g.success_measures, measure], updated_at: new Date().toISOString() }
            : g
        )
      })),
      updateSuccessMeasure: (goalId, measureId, updates) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                success_measures: g.success_measures.map((m) => m.id === measureId ? { ...m, ...updates } : m),
                updated_at: new Date().toISOString()
              }
            : g
        )
      })),
      deleteSuccessMeasure: (goalId, measureId) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId
            ? { ...g, success_measures: g.success_measures.filter((m) => m.id !== measureId), updated_at: new Date().toISOString() }
            : g
        )
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

      // Journal entry actions
      addJournalEntry: (entry) => set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
      setJournalEntries: (entries) => set({ journalEntries: entries }),
      updateJournalEntry: (id, updates) => set((state) => ({
        journalEntries: state.journalEntries.map((e) => e.id === id ? { ...e, ...updates } : e)
      })),

      // User context actions
      addUserContext: (context) => set((state) => ({ userContexts: [...state.userContexts, context] })),
      setUserContexts: (contexts) => set({ userContexts: contexts }),
      getTodayContext: () => {
        const today = getToday();
        return get().userContexts.find(c => c.date === today);
      },
      updateTodayEnergy: (energy) => {
        const today = getToday();
        const existing = get().userContexts.find(c => c.date === today);
        if (existing) {
          set((state) => ({
            userContexts: state.userContexts.map(c =>
              c.date === today ? { ...c, energy_level: energy } : c
            )
          }));
        } else {
          set((state) => ({
            userContexts: [...state.userContexts, {
              id: crypto.randomUUID(),
              user_id: 'local',
              date: today,
              energy_level: energy,
              created_at: new Date().toISOString()
            }]
          }));
        }
      },

      // AI suggestion actions
      addAISuggestion: (suggestion) => set((state) => ({ aiSuggestions: [...state.aiSuggestions, suggestion] })),
      setAISuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
      acceptSuggestion: (id) => set((state) => ({
        aiSuggestions: state.aiSuggestions.map(s => s.id === id ? { ...s, is_accepted: true } : s)
      })),
      dismissSuggestion: (id) => set((state) => ({
        aiSuggestions: state.aiSuggestions.filter(s => s.id !== id)
      })),

      // Onboarding actions
      setOnboarded: (value) => set({ isOnboarded: value }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setCurrentQuarter: (quarter) => set({ currentQuarter: quarter }),

      // Helper methods
      getScheduledActionsForDate: (date) => {
        const goals = get().goals;
        const scheduled: { action: GoalAction; goal: Goal }[] = [];

        goals.forEach(goal => {
          goal.actions.forEach(action => {
            if (action.scheduled_date === date && action.status !== 'done') {
              scheduled.push({ action, goal });
            }
          });
        });

        return scheduled;
      },

      getActiveGoals: () => {
        return get().goals.filter(g => g.status === 'active');
      },

      getTodayJournal: (type) => {
        const today = getToday();
        return get().journalEntries.find(e => e.date === today && e.type === type);
      },

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'whatever-it-takes-storage',
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        currentQuarter: state.currentQuarter,
        goals: state.goals,
        antiGoals: state.antiGoals,
        currentVibeCode: state.currentVibeCode,
        backlogItems: state.backlogItems,
        envyLogs: state.envyLogs,
        dailyCheckIns: state.dailyCheckIns,
        journalEntries: state.journalEntries,
        userContexts: state.userContexts,
        selectedDate: state.selectedDate,
      }),
    }
  )
);
