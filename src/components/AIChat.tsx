'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/app-store';
import { Send, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { cn, generateId } from '@/lib/utils';
import type { ChatMessage } from '@/types';

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
  } = useAppStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Get current context for the AI
  const getCurrentContext = () => {
    let context = `User is on the ${activeTab} tab`;
    if (activeTab === 'focus') context += ` (${focusView} view)`;
    if (activeTab === 'goals') context += ` (${goalsView} view)`;
    if (activeTab === 'signals') context += ` (${signalsView} view)`;
    return context;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      user_id: '',
      role: 'user',
      content: input.trim(),
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
          goals: goals.map(g => ({
            description: g.description,
            category: g.category,
            status: g.status,
            progress: `${g.kpi_current}/${g.kpi_target}`,
          })),
          antiGoals: antiGoals.map(a => a.description),
          currentVibe: currentVibeCode?.vibe_type,
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

  if (isChatMinimized) {
    return (
      <div className="w-16 bg-white border-l border-warm-200 flex flex-col items-center py-4">
        <button
          onClick={toggleChat}
          className="p-3 bg-accent-100 text-accent-700 rounded-full hover:bg-accent-200"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <span className="mt-2 text-xs text-warm-500 writing-mode-vertical">Chat</span>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-warm-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-warm-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-warm-900">Your Guide</h2>
          <p className="text-xs text-warm-500 italic">Here to help you stay on track</p>
        </div>
        <button
          onClick={toggleChat}
          className="p-2 hover:bg-warm-100 rounded-lg"
        >
          <Minimize2 className="w-4 h-4 text-warm-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-50">
        {chatMessages.length === 0 && (
          <div className="text-center text-warm-600 py-8">
            <p className="mb-2 font-medium">Hey! How's your energy today?</p>
            <p className="text-sm text-warm-500">I'm here to help you stay focused and track your progress.</p>
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
                  ? 'bg-accent-500 text-white'
                  : 'bg-white text-warm-800 border border-warm-200'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-warm-200 rounded-2xl px-4 py-2.5">
              <Loader2 className="w-5 h-5 text-accent-500 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-warm-100 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your progress, doubts, or feelings..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-warm-50 border border-warm-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent text-sm max-h-32"
            style={{ minHeight: '44px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'p-2.5 rounded-full transition-colors',
              input.trim() && !isLoading
                ? 'bg-accent-500 text-white hover:bg-accent-600'
                : 'bg-warm-200 text-warm-400'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
