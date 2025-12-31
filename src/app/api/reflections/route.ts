import { NextRequest, NextResponse } from 'next/server';

const REFLECTION_SYSTEM_PROMPT = `You are an AI facilitating monthly reflection sessions for a goal management system.

Your role is to:
1. Review the user's month - what they achieved, what they didn't, what they said no to
2. Ask thoughtful reflection questions about their choices
3. Surface patterns in their envy/jealousy signals
4. Help them decide which backlogged items to promote, keep, or drop
5. Validate past decisions with emotional context

Be warm, insightful, and help them see patterns they might have missed.

Generate a reflection summary that includes:
- Key accomplishments
- Things that didn't happen (without judgment)
- Patterns noticed
- Envy signal insights
- Backlog item recommendations
- Retrospective validation of "stay focused" moments`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, goals, antiGoals, envyLogs, checkIns, backlogItems } = body;

    // Build reflection context
    let context = `Reflection type: ${type}\n\n`;

    if (goals && goals.length > 0) {
      context += 'Goals this period:\n';
      goals.forEach((g: any) => {
        const progress = Math.round((g.kpi_current / g.kpi_target) * 100);
        context += `- ${g.description}: ${progress}% complete (${g.kpi_current}/${g.kpi_target})\n`;
      });
    }

    if (antiGoals && antiGoals.length > 0) {
      context += '\nAnti-goals to review adherence:\n';
      antiGoals.forEach((a: string) => {
        context += `- ${a}\n`;
      });
    }

    if (envyLogs && envyLogs.length > 0) {
      context += '\nEnvy signals logged:\n';
      envyLogs.forEach((e: any) => {
        context += `- ${e.category_tag}: ${e.trigger}\n`;
      });
    }

    if (checkIns && checkIns.length > 0) {
      const avgEnergy = checkIns.reduce((sum: number, c: any) => sum + c.energy_level, 0) / checkIns.length;
      context += `\nAverage energy level: ${avgEnergy.toFixed(1)}/10\n`;
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        insights: 'Reflection API running in demo mode. Add your Anthropic API key to `.env.local` for personalized monthly reflections.',
        questions: [
          'What accomplishment are you most proud of this month?',
          'What would you do differently next month?',
          'Is there anything in your backlog that no longer excites you?',
        ],
        recommendations: [],
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
        max_tokens: 2048,
        system: REFLECTION_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: `Please facilitate a ${type} reflection based on this context:\n\n${context}` },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reflectionText = data.content[0]?.text || '';

    return NextResponse.json({
      insights: reflectionText,
      questions: [],
      recommendations: [],
    });
  } catch (error) {
    console.error('Reflection API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reflection' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Reflections API - use client-side state for now' });
}
