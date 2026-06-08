'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueryState } from '@/components/ui/query-state';
import { useCoachAgents } from '@/hooks/use-career-api';
import { useCareerUser } from '@/hooks/use-career-user';
import { api } from '@/lib/api';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; }

const QUICK_PROMPTS = ['What should I learn next?', 'Am I ready for SDE-2?', 'How can I increase salary by 50%?', 'What companies should I target?'];

export default function CoachPage() {
  const { userId } = useCareerUser();
  const { data: agents, isLoading, isError, error } = useCoachAgents();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Career Coach with full access to your Career Twin. What would you like to explore?" },
  ]);
  const [input, setInput] = useState('');
  const [agent, setAgent] = useState('CAREER_COACH');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !userId) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);
    try {
      const res = await api.coachChat(userId, [...messages, userMsg], agent) as { response: string };
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'I had trouble reaching the AI service. Please ensure the API is running.' }]);
    }
    setChatLoading(false);
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-6 h-[calc(100vh-8rem)]">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><MessageSquare className="w-8 h-8 text-primary" /> AI Career Coach</h1>
          <p className="text-muted mt-1">7 specialized AI agents with full Career Twin context</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(agents as Array<{ name: string; type: string }>)?.map((a) => (
            <button key={a.type} onClick={() => setAgent(a.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${agent === a.type ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-muted border border-white/5'}`}>
              {a.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-6" style={{ height: 'calc(100% - 120px)' }}>
          <Card className="col-span-3 flex flex-col">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary" /></div>}
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary/10' : 'bg-white/[0.03] border border-white/5'}`}>{msg.content}</div>
                  {msg.role === 'user' && <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"><User className="w-4 h-4" /></div>}
                </div>
              ))}
              {chatLoading && <div className="flex gap-3"><div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center"><Bot className="w-4 h-4 text-primary animate-pulse" /></div><div className="p-4 rounded-2xl bg-white/[0.03]"><div className="flex gap-1"><span className="w-2 h-2 bg-primary rounded-full animate-bounce" /><span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div></div>}
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2 mb-3 flex-wrap">{QUICK_PROMPTS.map((p) => <button key={p} onClick={() => sendMessage(p)} className="text-xs px-3 py-1 rounded-full bg-white/5 text-muted hover:text-foreground">{p}</button>)}</div>
              <div className="flex gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)} placeholder="Ask your career coach..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50" />
                <Button onClick={() => sendMessage(input)} disabled={chatLoading}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Agent Info</CardTitle></CardHeader>
            <p className="text-sm text-muted">Uses your live Career Twin data — skills, GitHub, goals, and market value.</p>
          </Card>
        </div>
      </div>
    </QueryState>
  );
}
