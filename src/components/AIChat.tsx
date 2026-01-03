'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Send, Minimize2, Maximize2, Loader2, Sparkles } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import type { ChatMessage } from '@/types';

const quickPrompts = [
  { label: "How's today?", text: "How am I doing today?" },
  { label: "Plan actions", text: "Help me plan my next actions for my current goal" },
  { label: "Feeling stuck", text: "I'm feeling stuck and not sure what to focus on" },
  { label: "Weekly review", text: "Let's do a quick weekly review" },
];

export function AIChat() {
  const {
    chatMessages,
    addChatMessage,
    isChatMinimized,
    toggleChat,
    activeTab,
    focusView,
    goalsView,
    signalsView,
    goals,
    currentVibeCode,
    antiGoals,
    getTodayContext,
    journalEntries,
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const todayContext = getTodayContext();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getCurrentContext = () => {
    let context = `User is on the ${activeTab} tab`;
    if (activeTab === 'focus') context += ` (${focusView} view)`;
    if (activeTab === 'goals') context += ` (${goalsView} view)`;
    if (activeTab === 'signals') context += ` (${signalsView} view)`;
    return context;
  };

  const handleSubmit = async (e: React.FormEvent, customMessage?: string) => {
    e.preventDefault();
    const messageToSend = customMessage || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      user_id: '',
      role: 'user',
      content: messageToSend,
      context: getCurrentContext(),
      created_at: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          context: getCurrentContext(),
          goals: goals
            .filter(g => g.status === 'active')
            .map(g => ({
              objective: g.objective,
              why: g.why,
              category: g.category,
              progress: g.success_measures.length > 0
                ? `${Math.round(g.success_measures.reduce((acc, m) => acc + (m.current / m.target), 0) / g.success_measures.length * 100)}%`
                : 'No measures',
              pendingActions: g.actions.filter(a => a.status === 'pending' || a.status === 'scheduled').length,
            })),
          antiGoals: antiGoals.map(a => a.description),
          currentVibe: currentVibeCode?.vibe_type,
          energyLevel: todayContext?.energy_level,
          journalEntries: journalEntries.slice(-5),
          chatHistory: chatMessages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateId(),
        user_id: '',
        role: 'assistant',
        content: data.message || 'I apologize, but I encountered an issue. Please try again.',
        context: getCurrentContext(),
        is_accountability_redirect: data.is_accountability_redirect,
        created_at: new Date().toISOString(),
      };

      addChatMessage(assistantMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        user_id: '',
        role: 'assistant',
        content: 'I apologize, but I encountered a connection issue. Please try again.',
        created_at: new Date().toISOString(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleQuickPrompt = (text: string) => {
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(syntheticEvent, text);
  };

  if (isChatMinimized) {
    return (
      <div className="w-16 bg-white border-l border-neutral-200 flex flex-col items-center py-4">
        <button
          onClick={toggleChat}
          className="p-3 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <span className="mt-2 text-xs text-neutral-500 [writing-mode:vertical-lr]">Chat</span>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-neutral-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-primary-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold text-neutral-900">Your Guide</h2>
            <p className="text-xs text-neutral-500">Reflection & Planning</p>
          </div>
        </div>
        <button
          onClick={toggleChat}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Minimize2 className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
        {chatMessages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-neutral-800 font-medium mb-2">{greeting}!</p>
            <p className="text-sm text-neutral-500 mb-4">
              I'm here to help you reflect, plan, and stay on track.
            </p>
            <div className="space-y-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.label}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="block w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'animate-fade-in',
              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-2.5',
                message.role === 'user'
                  ? 'bg-primary-400 text-white'
                  : 'bg-white text-neutral-800 border border-neutral-200 shadow-sm'
              )}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {chatMessages.length > 0 && chatMessages.length < 6 && (
        <div className="px-4 py-2 border-t border-neutral-100 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.slice(0, 3).map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => handleQuickPrompt(prompt.text)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full text-xs text-neutral-600 hover:bg-primary-50 hover:border-primary-200 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-100 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-sm max-h-32"
            style={{ minHeight: '44px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'p-2.5 rounded-full transition-colors',
              input.trim() && !isLoading
                ? 'bg-primary-400 text-white hover:bg-primary-500'
                : 'bg-neutral-200 text-neutral-400'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
