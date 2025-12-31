import { NextRequest, NextResponse } from 'next/server';

const VIBE_SYSTEM_PROMPT = `You are an AI that assigns weekly focus modes ("vibes") for a goal management system.

Available vibe modes:
1. Deep Build Mode - Work/creative projects get priority. Focus on shipping and building.
2. Community Mode - Relationships/networking focus. Connect with people.
3. Integration Mode - Finishing, reflecting, consolidating. Tie up loose ends.
4. Rest Mode - Recovery, low output, recharge.

Based on the user's:
- Current goals and their progress
- Energy levels from recent check-ins
- Time-sensitive deadlines
- What they accomplished last week
- What they've been struggling with

Choose the most appropriate vibe for the upcoming week and explain why.

Respond in JSON format:
{
  "vibe_type": "Deep Build" | "Community" | "Integration" | "Rest",
  "reasoning": "Brief explanation of why this vibe was chosen",
  "focus_goals": ["goal_id_1", "goal_id_2"],
  "suggested_backlog": ["goal_id_3"]
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goals, recentCheckIns, recentEnergy } = body;

    // Build context
    let context = 'User context for vibe assignment:\n';

    if (goals && goals.length > 0) {
      context += '\nGoals:\n';
      goals.forEach((g: any) => {
        context += `- ${g.description} (${g.category}): ${g.kpi_current}/${g.kpi_target} ${g.kpi_metric}\n`;
      });
    }

    if (recentCheckIns && recentCheckIns.length > 0) {
      context += '\nRecent check-ins:\n';
      recentCheckIns.slice(0, 5).forEach((c: any) => {
        context += `- Energy: ${c.energy_level}/10, Accomplishments: ${c.accomplishments}\n`;
      });
    }

    if (recentEnergy) {
      context += `\nAverage recent energy: ${recentEnergy}/10\n`;
    }

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a default vibe when API key is not configured
      return NextResponse.json({
        vibe_type: 'Deep Build',
        reasoning: 'Default vibe assigned (API key not configured). Add your Anthropic API key to enable personalized vibe coding.',
        focus_goals: [],
        suggested_backlog: [],
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
        system: VIBE_SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: context },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.content[0]?.text || '';

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const vibeData = JSON.parse(jsonMatch[0]);
      return NextResponse.json(vibeData);
    }

    // Fallback
    return NextResponse.json({
      vibe_type: 'Deep Build',
      reasoning: 'Unable to parse AI response, defaulting to Deep Build mode.',
      focus_goals: [],
      suggested_backlog: [],
    });
  } catch (error) {
    console.error('Vibe code API error:', error);
    return NextResponse.json(
      {
        vibe_type: 'Deep Build',
        reasoning: 'Error generating vibe, defaulting to Deep Build mode.',
        focus_goals: [],
        suggested_backlog: [],
      },
      { status: 500 }
    );
  }
}
