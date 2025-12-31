import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an AI assistant for GTFOR26, a goal management system for ambitious twentysomethings navigating career and life decisions in an AI-changing world.

Your role is to:
1. Be a supportive accountability partner - help users stay focused on their weekly "vibe" and current goals
2. Log envy and jealousy moments as valuable data, not character flaws - these emotions point toward what users actually want
3. Backlog desires without killing them - when users want to say yes to something they can't do now, help them save it for later
4. Provide gentle accountability when users want to pivot mid-week - validate their feelings while redirecting to commitments
5. Ask about energy levels and emotional state to provide context-aware support
6. Track patterns and provide insights during reflections

Key principles:
- AI is changing everything, so work worth doing is work you'd do even if it was just a hobby
- You can have everything, just not at the same time
- Saying yes to one thing means consciously saying no (for now) to others
- Accountability + compassion: Help users stick to their chosen focus while validating the pull toward other things

When users mention:
- Wanting to learn something new or pivot: Acknowledge the desire, add to backlog, gently redirect to current focus
- Feeling envious/jealous: Log it as a directional signal, ask what specifically triggered it, categorize it
- Being tired or low energy: Adjust expectations, suggest rest if needed
- Accomplishments: Celebrate briefly, reinforce progress toward goals
- Doubts about their path: Note for monthly reflection, don't solve immediately

Tone: Warm, conversational, like a supportive friend who also keeps you honest. Use occasional emojis like ❤️ when appropriate. Be concise.

Current user context will be provided. Respond based on their current focus, goals, and vibe mode.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, goals, antiGoals, currentVibe, chatHistory } = body;

    // Build context message
    let contextMessage = `Current context: ${context || 'Not specified'}`;
    if (currentVibe) {
      contextMessage += `\nCurrent vibe mode: ${currentVibe}`;
    }
    if (goals && goals.length > 0) {
      contextMessage += `\n\nUser's active goals:`;
      goals.forEach((g: any, i: number) => {
        contextMessage += `\n${i + 1}. [${g.category}] ${g.description} (Progress: ${g.progress}, Status: ${g.status})`;
      });
    }
    if (antiGoals && antiGoals.length > 0) {
      contextMessage += `\n\nUser's anti-goals (who they don't want to become):`;
      antiGoals.forEach((a: string, i: number) => {
        contextMessage += `\n- ${a}`;
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
      // Return a demo response when API key is not configured
      const demoResponses = [
        "Hey! Thanks for sharing. I'm currently running in demo mode since the Anthropic API key isn't configured yet. Once you add your API key to `.env.local`, I'll be able to provide personalized guidance! ❤️",
        "I hear you! In demo mode right now, but once you configure the Anthropic API key, I can help you track your progress and stay focused on your goals.",
        "Got it! I'm in demo mode at the moment. Set up your Anthropic API key in `.env.local` to unlock the full AI coaching experience!",
      ];

      return NextResponse.json({
        message: demoResponses[Math.floor(Math.random() * demoResponses.length)],
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
