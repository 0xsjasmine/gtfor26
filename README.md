# GTFOR26 - AI-Powered Goal Management System

An LLM-powered quarterly goal management platform that removes decision fatigue by dynamically prioritizing goals, backlogging desires, and providing reflective insights.

## Philosophy

- AI is changing everything, making traditional career paths obsolete
- Work you'd do even if it was just a hobby is the work worth doing
- You can have everything, just not at the same time
- Saying yes to one thing means consciously saying no (for now) to others
- The system backlogs desires instead of killing them
- Envy and jealousy are directional signals, not character flaws

## Features

### MVP (Phase 1)

- **Three-Tab Navigation**: Focus, Goals, Signals
- **Focus Tab**: Week/Day/Quarter views with vibe mode display
- **Goals Tab**: Quarter/Month/Backlog views with KPI tracking
- **Signals Tab**: Envy patterns and monthly reflections
- **AI Chat**: Claude Sonnet 4.5 powered assistant with accountability
- **Weekly Vibe Coding**: Deep Build, Community, Integration, Rest modes
- **KPI Progress Tracking**: Visual progress bars with color coding
- **Anti-Goals**: Track who you're NOT becoming
- **Backlog System**: Later-not-never for deprioritized items
- **Onboarding Flow**: Guided setup for quarterly goals

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude Sonnet 4.5 (Anthropic API)
- **Auth**: Supabase Auth (ready for integration)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional for full features)
- Anthropic API key (optional, app works in demo mode without it)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd gtfor26
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic API (for AI features)
ANTHROPIC_API_KEY=your-anthropic-key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Setup (Optional)

If using Supabase for persistence:

1. Create a new Supabase project
2. Run the SQL schema from `supabase/schema.sql`
3. Update your `.env.local` with Supabase credentials

## Usage

### Onboarding

1. Select your current quarter
2. Add goals across categories (work, personal, creative, relationships, health, learning)
3. Define anti-goals (who you don't want to become)
4. Complete setup to access the dashboard

### Daily Usage

1. Open the app to see your weekly vibe mode
2. Check your active goals and KPI progress
3. Use the AI chat to:
   - Report daily progress and energy levels
   - Log envy/jealousy moments
   - Get accountability when you want to pivot
   - Ask questions about your goals

### Views

- **Focus > Week**: Current week's vibe and prioritized goals
- **Focus > Day**: Today's specific focus
- **Focus > Quarter**: Big picture overview
- **Goals > Quarter**: All KPIs by category
- **Goals > Month**: This month's progress
- **Goals > Backlog**: Deprioritized items
- **Signals > Envy**: Pattern visualization
- **Signals > Reflections**: Past monthly reviews

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── chat/      # AI chat endpoint
│   │   ├── goals/     # Goals CRUD
│   │   ├── backlog/   # Backlog management
│   │   ├── check-in/  # Daily check-ins
│   │   ├── envy/      # Envy logging
│   │   ├── vibe-code/ # Weekly vibe generation
│   │   └── reflections/ # Monthly/quarterly reviews
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AIChat.tsx
│   ├── FocusContent.tsx
│   ├── GoalsContent.tsx
│   ├── SignalsContent.tsx
│   ├── SideNav.tsx
│   ├── Onboarding.tsx
│   └── ...
├── lib/
│   ├── utils.ts
│   └── supabase/
├── store/
│   └── app-store.ts
└── types/
    └── index.ts
```

## Future Roadmap

### Phase 2
- Monthly reflection sessions with retrospective validation
- Enhanced envy pattern visualization
- Auto-suggest backlog promotions
- Mobile optimization
- Mood tracking integration

### Phase 3
- Quarterly reviews with AI roundtable (multi-LLM)
- Predictive vibe coding
- Decision audit trail
- Calendar integrations
- Export/sharing features

## License

MIT
