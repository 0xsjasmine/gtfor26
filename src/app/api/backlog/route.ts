import { NextRequest, NextResponse } from 'next/server';

// Note: In production, these would connect to Supabase
// For now, we're using client-side state management (Zustand with persistence)

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Backlog API - use client-side state for now' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, item: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create backlog item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, updates: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update backlog item' }, { status: 500 });
  }
}
