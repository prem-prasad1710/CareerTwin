'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoDashboard } from '@/lib/demo-data';
import { Share2, Download, ExternalLink, Dna, Clock, DollarSign, Target } from 'lucide-react';

const SHARE_TYPES = [
  { type: 'career_dna', title: 'My Career DNA', icon: Dna, desc: 'Radar chart of your 10 career dimensions', color: 'from-indigo-500 to-purple-600' },
  { type: 'timeline', title: 'My Future Timeline', icon: Clock, desc: 'Predicted career trajectory with confidence scores', color: 'from-purple-500 to-pink-600' },
  { type: 'market_value', title: 'My Market Value', icon: DollarSign, desc: 'Current and projected salary analysis', color: 'from-emerald-500 to-teal-600' },
  { type: 'career_score', title: 'My Career Twin Score', icon: Target, desc: 'Overall career score with peer benchmarking', color: 'from-amber-500 to-orange-600' },
];

export default function SharePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Share2 className="w-8 h-8 text-primary" /> Share Cards
        </h1>
        <p className="text-muted mt-1">Generate beautiful, shareable career reports for LinkedIn and social media</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {SHARE_TYPES.map((card) => (
          <Card key={card.type} className="overflow-hidden">
            <div className={`h-32 bg-gradient-to-br ${card.color} p-6 flex items-end`}>
              <div>
                <card.icon className="w-8 h-8 text-white/80 mb-2" />
                <h3 className="text-xl font-bold text-white">{card.title}</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted mb-4">{card.desc}</p>
              {card.type === 'career_score' && (
                <div className="text-center mb-4">
                  <span className="text-5xl font-bold text-primary">{demoDashboard.careerScore.overall}</span>
                  <p className="text-xs text-muted">Top {100 - demoDashboard.careerScore.peerPercentile}% of peers</p>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1"><Download className="w-3 h-3" /> Download</Button>
                <Button variant="secondary" size="sm" className="flex-1"><ExternalLink className="w-3 h-3" /> Share</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview: Career DNA Card</CardTitle>
          <CardDescription>How your share card will look on LinkedIn</CardDescription>
        </CardHeader>
        <div className="mx-auto max-w-md p-8 rounded-2xl bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3e] border border-white/10 text-center">
          <Badge variant="accent" className="mb-4">CareerTwin AI</Badge>
          <h2 className="text-2xl font-bold mb-1">Alex Chen&apos;s Career DNA</h2>
          <p className="text-sm text-muted mb-6">Software Engineer · Tech Corp</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {Object.entries(demoDashboard.careerDna)
              .filter(([k]) => !['strengths', 'weaknesses'].includes(k))
              .slice(0, 6)
              .map(([key, val]) => (
                <div key={key} className="p-2 rounded-lg bg-white/5">
                  <p className="text-[10px] text-muted capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-lg font-bold">{val as number}</p>
                </div>
              ))}
          </div>
          <p className="text-xs text-muted mt-6">careertwin.ai · Predict your future career</p>
        </div>
      </Card>
    </div>
  );
}
