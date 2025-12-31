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

// Goal type
export interface Goal {
  id: string;
  user_id: string;
  quarter: string;
  category: GoalCategory;
  description: string;
  kpi_metric: string;
  kpi_target: number;
  kpi_current: number;
  status: GoalStatus;
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

// Daily check-in type
export interface DailyCheckIn {
  id: string;
  user_id: string;
  date: string;
  energy_level: number;
  accomplishments: string;
  doubts: string;
  opportunities: string;
  mood_context?: string;
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
  retrospective_validation?: Record<string, any>;
  created_at: string;
}

// Chat message role
export type ChatRole = 'user' | 'assistant';

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

// Navigation tabs
export type NavTab = 'focus' | 'goals' | 'signals';

// Focus view types
export type FocusView = 'week' | 'day' | 'quarter';

// Goals view types
export type GoalsView = 'quarter' | 'month' | 'backlog';

// Signals view types
export type SignalsView = 'envy' | 'reflections';

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
