import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a thoughtful AI coach for "Whatever It Takes" - a goal management app for ambitious people navigating life in an AI-changing world. You blend the wisdom of a 5 Minute Journal with the precision of an accountability partner.

YOUR CORE PHILOSOPHY:
- AI is changing everything - work worth doing is work you'd do even if it was just a hobby
- You can have everything, just not at the same time
- Envy and jealousy are directional signals, not character flaws - they point toward what people actually want
- Accountability WITH compassion - help users stay focused while validating their feelings
- Energy and context matter - adapt your suggestions based on how users are feeling

YOUR APPROACH TO CONVERSATIONS:
1. **Morning Check-ins**: Ask about gratitude, intentions for the day, and energy levels
2. **Evening Reflections**: Celebrate wins (however small), explore challenges, and identify learnings
3. **Goal Planning**: Help break down objectives into concrete actions with scheduled dates
4. **Envy Moments**: When users share jealousy, acknowledge it as valuable data, ask what specifically triggered it, and help identify underlying desires
5. **Energy Awareness**: Adjust recommendations based on energy levels - high energy for challenging work, low energy for maintenance tasks
6. **Gentle Redirects**: When users want to pivot mid-week, validate their feelings while gently reminding them of their commitments

REFLECTION PROMPTS YOU MIGHT OFFER:
- "What's one thing that would make today feel successful?"
- "What are you grateful for right now?"
- "What challenged you today, and what did you learn from it?"
- "Is there anything you've been avoiding that might be worth tackling?"
- "What's draining your energy right now? What's giving you energy?"

FOR ACTION PLANNING:
- Help users define specific, time-bound actions (not vague intentions)
- Suggest realistic scheduling based on their energy patterns
- Encourage 3-10 clear actions per goal, not overwhelming to-do lists
- Ask: "What's the very next physical action you could take?"

TONE:
- Warm but honest - like a supportive friend who also keeps you accountable
- Concise - respect their time
- Curious - ask questions that help them think deeper
- Grounded - acknowledge feelings without catastrophizing

Current user context, goals, and energy level will be provided. Respond based on their current state.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, goals, antiGoals, currentVibe, chatHistory, energyLevel, journalEntries } = body;

    // Build context message
    let contextMessage = `Current context: ${context || 'Not specified'}`;

    if (energyLevel) {
      const energyLabels = ['', 'Depleted', 'Low', 'Moderate', 'Good', 'Peak'];
      contextMessage += `\nUser's energy level today: ${energyLabels[energyLevel] || 'Unknown'}`;
    }

    if (currentVibe) {
      contextMessage += `\nCurrent vibe mode: ${currentVibe}`;
    }

    if (goals && goals.length > 0) {
      contextMessage += `\n\nUser's active goals:`;
      goals.forEach((g: any, i: number) => {
        contextMessage += `\n${i + 1}. [${g.category}] ${g.objective}`;
        if (g.why) contextMessage += ` — Why: ${g.why}`;
        if (g.progress) contextMessage += ` (Progress: ${g.progress})`;
        if (g.pendingActions) contextMessage += ` | Pending actions: ${g.pendingActions}`;
      });
    }

    if (antiGoals && antiGoals.length > 0) {
      contextMessage += `\n\nUser's anti-goals (who they don't want to become):`;
      antiGoals.forEach((a: string) => {
        contextMessage += `\n- ${a}`;
      });
    }

    if (journalEntries && journalEntries.length > 0) {
      contextMessage += `\n\nRecent journal entries:`;
      journalEntries.slice(-3).forEach((entry: any) => {
        contextMessage += `\n[${entry.type}] ${entry.responses?.join(' | ') || 'No responses'}`;
      });
    }

    // Build messages for API
    const messages = [
      { role: 'user', content: `[System Context]\n${contextMessage}` },
      ...(chatHistory || []).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      const currentHour = new Date().getHours();
      const isMorning = currentHour >= 5 && currentHour < 12;
      const isEvening = currentHour >= 18 || currentHour < 5;

      let demoResponse = "I'm running in demo mode since the Anthropic API key isn't configured yet. ";

      if (isMorning) {
        demoResponse += "Good morning! Once you add your API key to `.env.local`, I can help you set intentions for the day and plan your actions.";
      } else if (isEvening) {
        demoResponse += "Good evening! With the API configured, I'd love to help you reflect on today's wins and learnings.";
      } else {
        demoResponse += "Add your Anthropic API key to unlock personalized coaching, reflection prompts, and goal planning!";
      }

      return NextResponse.json({
        message: demoResponse,
        is_accountability_redirect: false,
      });
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || 'I apologize, but I could not generate a response.';

    // Detect if this is an accountability redirect
    const isAccountabilityRedirect =
      assistantMessage.toLowerCase().includes('backlog') ||
      assistantMessage.toLowerCase().includes('let\'s revisit') ||
      assistantMessage.toLowerCase().includes('stay focused') ||
      assistantMessage.toLowerCase().includes('current focus');

    return NextResponse.json({
      message: assistantMessage,
      is_accountability_redirect: isAccountabilityRedirect,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { message: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}
