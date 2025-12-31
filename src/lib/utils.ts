import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get current quarter string (e.g., "Q1 2025")
export function getCurrentQuarter(): string {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `Q${quarter} ${now.getFullYear()}`;
}

// Get week date range
export function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

// Get month date range
export function getMonthRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

// Get quarter date range
export function getQuarterRange(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: startOfQuarter(date),
    end: endOfQuarter(date),
  };
}

// Format date for display
export function formatDate(date: Date | string, formatStr: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

// Format week range for display
export function formatWeekRange(date: Date = new Date()): string {
  const { start, end } = getWeekRange(date);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

// Calculate KPI status based on progress
export function getKPIStatus(current: number, target: number): 'on_track' | 'behind' | 'blocked' {
  const progress = current / target;
  if (progress >= 0.7) return 'on_track';
  if (progress >= 0.4) return 'behind';
  return 'blocked';
}

// Get status color class
export function getStatusColorClass(status: 'on_track' | 'behind' | 'blocked'): string {
  switch (status) {
    case 'on_track':
      return 'bg-status-success';
    case 'behind':
      return 'bg-status-warning';
    case 'blocked':
      return 'bg-status-danger';
    default:
      return 'bg-gray-400';
  }
}

// Get vibe mode description
export function getVibeDescription(vibe: string): string {
  switch (vibe) {
    case 'Deep Build':
      return 'Work/creative projects get priority. Focus on shipping and building.';
    case 'Community':
      return 'Relationships and networking take center stage. Connect with people.';
    case 'Integration':
      return 'Finishing, reflecting, and consolidating. Tie up loose ends.';
    case 'Rest':
      return 'Recovery and recharge. Low output is okay this week.';
    default:
      return '';
  }
}

// Get category icon (using emoji for simplicity)
export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'work':
      return '💼';
    case 'personal':
      return '🌟';
    case 'creative':
      return '🎨';
    case 'relationships':
      return '💝';
    case 'health':
      return '💪';
    case 'learning':
      return '📚';
    default:
      return '📌';
  }
}

// Generate a simple ID (for client-side temporary use)
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
