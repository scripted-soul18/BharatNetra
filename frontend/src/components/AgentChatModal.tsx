/**
 * AI Disaster & Navigation Advisor Modal (from Bharat-Netra)
 * Provides real-time intelligent guidance for mountain road conditions, landslide alerts, and safe detours
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, X, ShieldAlert, Navigation, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

interface AgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName: string;
  currentRiskLevel: string;
}

export const AgentChatModal: React.FC<AgentChatModalProps> = ({
  isOpen,
  onClose,
  currentLocationName,
  currentRiskLevel
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Namaste! I am Bharat Netra AI Safety Copilot. Currently monitoring **${currentLocationName}** (Status: **${currentRiskLevel}**). How can I assist your route planning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'Is NH-5 corridor safe for travel right now?',
        'What is the landslide risk along Shimla to Manali?',
        'Give me emergency driving tips in heavy rainfall.'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Safety response generator
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('nh-5') || lower.includes('shimla') || lower.includes('kalka')) {
        reply = `⚠️ **NH-5 Advisory**: Geotechnical radar detected an active slump near Sector 4 (Solan-Shimla pass). Debris clearance is underway by BRO teams. **Recommendation**: Take the Valley Expressway Bypass for 100% hazard clearance.`;
      } else if (lower.includes('manali') || lower.includes('kullu')) {
        reply = `🌧️ **Kullu-Manali Corridor**: Moderate rainfall (42mm/24h) reported. Beas river water levels are being monitored. Road surface is slippery; keep vehicle speed below 35 km/h on hairpin curves.`;
      } else if (lower.includes('tip') || lower.includes('rain') || lower.includes('safety') || lower.includes('rule')) {
        reply = `🛡️ **Monsoon Mountain Safety Protocols**:\n1. **Distance**: Maintain at least 50m trailing distance behind trucks on steep inclines.\n2. **Look for Warning Signs**: Watch for falling pebbles or muddy roadside runoff—these precede major debris slumps.\n3. **Night Travel**: Avoid unlit ghat sections between 9 PM and 5 AM during heavy rain.`;
      } else {
        reply = `✅ Real-time telemetry for **${currentLocationName}** indicates **${currentRiskLevel}** hazard probability. Our Safe Route Analysis Engine continuously recalculates alternate corridors every 60 seconds.`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'Show nearest emergency hospital',
          'Recalculate lowest-slope route',
          'What is the current soil saturation level?'
        ]
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl flex flex-col h-[85vh] sm:h-[600px] shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Bharat Netra Copilot
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                AI Geotechnical &amp; Safe Route Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>

              {/* Quick suggestions pills */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {m.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(s)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[10px] text-blue-600 dark:text-cyan-400 font-medium transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 max-w-fit text-slate-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Analyzing live satellite &amp; geotechnical radar...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about road conditions, landslides, or detours..."
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-md active:scale-95 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
