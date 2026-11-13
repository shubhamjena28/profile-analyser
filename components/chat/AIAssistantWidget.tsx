import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Loader2, Send } from "lucide-react";

export const AIAssistantWidget = ({ profileContext }: { profileContext: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !profileContext) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, profileContext: {
          score: profileContext.score,
          insights: profileContext.insights,
          learningRoadmap: profileContext.learningRoadmap,
          skillGap: profileContext.skillGap
        }})
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't process that right now." }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Network error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profileContext) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-[#0B0F17] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh] animate-in slide-in-from-bottom-5">
          <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-bold">AI Profile Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#05070A]">
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-500 my-8">
                Ask me anything about your profile analysis, skill gaps, or how to improve your resume!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-500 text-white rounded-br-none' 
                  : 'bg-[#0B0F17] text-zinc-200 border border-white/[0.08] rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#0B0F17] border border-white/[0.08] rounded-2xl rounded-bl-none p-3">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#0B0F17] border-t border-white/[0.08] flex gap-2">
            <Input 
              value={input}
              onChange={(e: any) => setInput(e.target.value)}
              onKeyDown={(e: any) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="bg-[#05070A] border-white/[0.08] text-white focus-visible:ring-cyan-500/50"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon" className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] text-white p-4 rounded-full transition-transform hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
