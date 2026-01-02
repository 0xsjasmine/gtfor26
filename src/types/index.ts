// User type
export interface User {
  id: string;
  email: string;
  created_at: string;
  current_quarter: string;
}

// Goal categories
export type GoalCategory = 'work' | 'personal' | 'creative' | 'relationships' | 'health' | 'learning';

// Goal status
export type GoalStatus = 'active' | 'backlogged' | 'completed' | 'dropped';

// KPI status based on progress
export type KPIStatus = 'on_track' | 'behind' | 'blocked';

// Success measure for goals
export interface SuccessMeasure {
  id: string;
  metric: string;
  target: number;
  current: number;
  unit?: string;
}

// Action status
export type ActionStatus = 'pending' | 'scheduled' | 'done' | 'skipped';

// Action priority
export type ActionPriority = 'high' | 'medium' | 'low';

// Goal action
export interface GoalAction {
  id: string;
  text: string;
  status: ActionStatus;
  priority: ActionPriority;
  scheduled_date?: string;
  completed_date?: string;
  estimated_minutes?: number;
  goal_id: string;
}

// Restructured Goal type
export interface Goal {
  id: string;
  user_id: string;
  quarter: string;
  category: GoalCategory;
  objective: string;           // What you're achieving
  why: string;                 // Flight story / personal motivation
  status: GoalStatus;
  success_measures: SuccessMeasure[];
  actions: GoalAction[];
  created_at: string;
  updated_at: string;
}

// Anti-goal type
export interface AntiGoal {
  id: string;
  user_id: string;
  quarter: string;
  description: string;
  created_at: string;
}

// Vibe types
export type VibeType = 'Deep Build' | 'Community' | 'Integration' | 'Rest';

// Vibe code type
export interface VibeCode {
  id: string;
  user_id: string;
  week_start_date: string;
  vibe_type: VibeType;
  focus_goals: string[];
  backlogged_goals: string[];
  created_at: string;
  is_user_override: boolean;
}

// Energy level scale
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

// Cycle phase for adaptive intelligence
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'not_tracking';

// User context for adaptive AI
export interface UserContext {
  id: string;
  user_id: string;
  date: string;
  energy_level: EnergyLevel;
  cycle_phase?: CyclePhase;
  sleep_hours?: number;
  mood_notes?: string;
  external_stressors?: string[];
  created_at: string;
}

// Daily check-in type (enhanced)
export interface DailyCheckIn {
  id: string;
  user_id: string;
  date: string;
  energy_level: EnergyLevel;
  accomplishments: string;
  doubts: string;
  opportunities: string;
  mood_context?: string;
  created_at: string;
}

// Journal entry type (5-minute journal style)
export type JournalType = 'morning' | 'evening' | 'weekly_planning' | 'weekly_review';

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  type: JournalType;
  prompts: string[];
  responses: string[];
  ai_reflection?: string;
  created_at: string;
}

// Envy log categories
export type EnvyCategory = 'travel' | 'career' | 'relationships' | 'creative' | 'recognition' | 'freedom' | 'lifestyle' | 'other';

// Envy log type
export interface EnvyLog {
  id: string;
  user_id: string;
  date: string;
  trigger: string;
  category_tag: EnvyCategory;
  notes: string;
  created_at: string;
}

// Backlog item status
export type BacklogStatus = 'backlogged' | 'promoted' | 'dropped';

// Backlog item type
export interface BacklogItem {
  id: string;
  user_id: string;
  description: string;
  backlogged_from_date: string;
  target_quarter: string;
  reason: string;
  times_mentioned: number;
  status: BacklogStatus;
  created_at: string;
  updated_at: string;
}

// Reflection type
export type ReflectionType = 'monthly' | 'quarterly';

// Reflection type
export interface Reflection {
  id: string;
  user_id: string;
  type: ReflectionType;
  period: string;
  llm_questions: string[];
  user_responses: string[];
  llm_insights: string;
  retrospective_validation?: Record<string, unknown>;
  created_at: string;
}

// Chat message role
export type ChatRole = 'user' | 'assistant' | 'system';

// Chat message type
export interface ChatMessage {
  id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  context?: string;
  is_accountability_redirect?: boolean;
  created_at: string;
}

// Scheduled action for calendar
export interface ScheduledAction {
  id: string;
  action: GoalAction;
  goal: Goal;
  date: string;
  time_slot?: string;
  is_completed: boolean;
  is_ai_suggested: boolean;
}

// Navigation tabs
export type NavTab = 'focus' | 'goals' | 'signals';

// Focus view types - now calendar-based
export type FocusView = 'day' | 'week' | 'month';

// Goals view types
export type GoalsView = 'quarter' | 'month' | 'backlog';

// Signals view types
export type SignalsView = 'envy' | 'reflections';

// AI suggestion type
export interface AISuggestion {
  id: string;
  type: 'action' | 'reschedule' | 'reflection' | 'break';
  content: string;
  related_goal_id?: string;
  suggested_date?: string;
  reasoning?: string;
  is_accepted?: boolean;
  created_at: string;
}

// App state for navigation
export interface AppState {
  activeTab: NavTab;
  focusView: FocusView;
  goalsView: GoalsView;
  signalsView: SignalsView;
  isChatMinimized: boolean;
}

// Onboarding state
export interface OnboardingState {
  step: number;
  quarter: string;
  goals: Partial<Goal>[];
  antiGoals: string[];
  isComplete: boolean;
}
