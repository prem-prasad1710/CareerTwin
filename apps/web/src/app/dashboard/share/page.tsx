'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QueryState } from '@/components/ui/query-state';
import { useDashboard, useShareCard } from '@/hooks/use-career-api';
import { useCareerUser } from '@/hooks/use-career-user';
import { Share2, Download, ExternalLink, Dna, Clock, DollarSign, Target } from 'lucide-react';

const SHARE_TYPES = [
  { type: 'career_dna', title: 'My Career DNA', icon: Dna, color: 'from-indigo-500 to-purple-600' },
  { type: 'timeline', title: 'My Future Timeline', icon: Clock, color: 'from-purple-500 to-pink-600' },
  { type: 'market_value', title: 'My Market Value', icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
  { type: 'career_score', title: 'My Career Twin Score', icon: Target, color: 'from-amber-500 to-orange-600' },
];

export default function SharePage() {
  const { data, isLoading, isError, error } = useDashboard();
  const { name } = useCareerUser();
  const shareCard = useShareCard();

  const handleShare = (type: string, title: string) => {
    if (!data) return;
    shareCard.mutate({ type, title, data: { careerScore: data.careerScore, careerDna: data.careerDna, marketValue: data.marketValue } });
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {data ? (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3"><Share2 className="w-8 h-8 text-primary" /> Share Cards</h1>
            <p className="text-muted mt-1">Generate shareable career reports for LinkedIn</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {SHARE_TYPES.map((card) => (
              <Card key={card.type} className="overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${card.color} p-6 flex items-end`}>
                  <div><card.icon className="w-8 h-8 text-white/80 mb-2" /><h3 className="text-xl font-bold text-white">{card.title}</h3></div>
                </div>
                <div className="p-6">
                  {card.type === 'career_score' && (
                    <div className="text-center mb-4">
                      <span className="text-5xl font-bold text-primary">{data.careerScore.overall}</span>
                      <p className="text-xs text-muted">Top {100 - data.careerScore.peerPercentile}% of peers</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleShare(card.type, card.title)} disabled={shareCard.isPending}>
                      <Download className="w-3 h-3" /> {shareCard.isSuccess ? 'Created!' : 'Generate'}
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1"><ExternalLink className="w-3 h-3" /> Share</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Preview</CardTitle><CardDescription>LinkedIn share card preview</CardDescription></CardHeader>
            <div className="mx-auto max-w-md p-8 rounded-2xl bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3e] border border-white/10 text-center">
              <Badge variant="accent" className="mb-4">CareerTwin AI</Badge>
              <h2 className="text-2xl font-bold mb-1">{name}&apos;s Career Twin</h2>
              <p className="text-3xl font-bold text-primary mt-4">{data.careerScore.overall}/100</p>
              <p className="text-sm text-muted">Career Score · {formatCurrency(data.marketValue.current.median)} market value</p>
            </div>
          </Card>
        </div>
      ) : null}
    </QueryState>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
