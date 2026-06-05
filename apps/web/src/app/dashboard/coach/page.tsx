'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoAgents } from '@/lib/demo-data';
import { MessageSquare, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'What should I learn next?',
  'Am I ready for SDE-2?',
  'How can I increase salary by 50%?',
  'What companies should I target?',
  'Review my career trajectory',
];

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Career Coach. I have full context of your Career Twin — skills, experience, goals, and market data. What would you like to explore?" },
  ]);
  const [input, setInput] = useState('');
  const [agent, setAgent] = useState('CAREER_COACH');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { api } = await import('@/lib/api');
      const res = await api.coachChat('demo', [...messages, userMsg], agent) as { response: string };
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: getFallbackResponse(text),
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" /> AI Career Coach
          </h1>
          <p className="text-muted mt-1">7 specialized AI agents with full Career Twin context</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {demoAgents.map((a) => (
          <button
            key={a.type}
            onClick={() => setAgent(a.type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              agent === a.type
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-white/5 text-muted hover:text-foreground border border-white/5'
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6 flex-1" style={{ height: 'calc(100% - 120px)' }}>
        <Card className="col-span-3 flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 320px)' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary/10 text-foreground'
                    : 'bg-white/[0.03] border border-white/5'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2 mb-3 flex-wrap">
              {QUICK_PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)} className="text-xs px-3 py-1 rounded-full bg-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-colors">
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask your career coach anything..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
              />
              <Button onClick={() => sendMessage(input)} disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Agent Info</CardTitle></CardHeader>
          {(() => {
            const current = demoAgents.find((a) => a.type === agent);
            return current ? (
              <div>
                <Badge variant="accent" className="mb-3">{current.name}</Badge>
                <p className="text-sm text-muted mb-4">Specialized agent with full access to your Career Twin data.</p>
                <p className="text-xs text-muted mb-2">Capabilities:</p>
                {current.capabilities.map((c) => (
                  <div key={c} className="text-xs py-1.5 px-2 rounded-lg bg-white/[0.02] mb-1">{c}</div>
                ))}
              </div>
            ) : null;
          })()}
        </Card>
      </div>
    </div>
  );
}

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('learn')) return 'Your highest ROI priorities: 1) System Design (+21% promotion probability, 8 weeks), 2) AI/ML fundamentals (+35% market demand, 12 weeks), 3) AWS certification (+15% salary, 6 weeks). Start with System Design — it unlocks senior roles at top companies.';
  if (q.includes('ready') || q.includes('sde')) return 'Your readiness for SDE-2 is 62%. You have strong technical skills but need: deeper system design knowledge (currently 54/100), more leadership visibility (30/100), and 1-2 more significant project impacts. Timeline: 6-8 months with focused effort.';
  if (q.includes('salary')) return 'To increase salary by 50%: 1) Target senior roles at high-growth companies (potential +35%), 2) Add System Design + Cloud skills (+15% premium), 3) Negotiate with competing offers (+10%). Realistic timeline: 12-18 months. Your current $155K could reach $230K+.';
  if (q.includes('compan')) return 'Best matches based on your profile: Vercel (88% match), Stripe (76%), Razorpay (68%). For FAANG: focus 3 months on Algorithms + System Design first. Paytm and Razorpay are achievable now with 65-72% success probability.';
  return 'Based on your Career Twin (Score: 78, Market Value: $155K), you\'re on a strong trajectory. Key focus: System Design is your biggest lever — it impacts salary (+21%), promotions (+25%), and interview success (+30%). Want me to create a detailed learning plan?';
}
