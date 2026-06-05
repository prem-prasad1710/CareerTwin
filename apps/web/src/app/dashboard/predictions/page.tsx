'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { useInterviewPredictions } from '@/hooks/use-career-api';
import { TrendingUp, Building2 } from 'lucide-react';

export default function PredictionsPage() {
  const { data: predictions, isLoading, isError, error } = useInterviewPredictions();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><TrendingUp className="w-8 h-8 text-primary" /> Interview Success Predictor</h1>
          <p className="text-muted mt-1">AI-powered probability based on your profile, skills, and GitHub data</p>
        </div>
        <div className="space-y-4">
          {(predictions as Array<{ company: string; probability: number; reasoning: string; missingSkills: string[]; strengths: string[] }>)?.map((pred, i) => (
            <Card key={pred.company} className={i === 0 ? 'glow' : ''}>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div><h3 className="text-lg font-semibold">{pred.company}</h3><p className="text-sm text-muted">{pred.reasoning}</p></div>
                    <div className="text-right">
                      <p className="text-3xl font-bold" style={{ color: pred.probability >= 70 ? '#10b981' : pred.probability >= 50 ? '#6366f1' : '#f59e0b' }}>{pred.probability}%</p>
                    </div>
                  </div>
                  <Progress value={pred.probability} color={pred.probability >= 70 ? 'bg-emerald-500' : pred.probability >= 50 ? 'bg-indigo-500' : 'bg-amber-500'} />
                  <div className="flex gap-4 mt-3">
                    {pred.strengths?.length > 0 && <div><p className="text-xs text-emerald-400 mb-1">Strengths</p>{pred.strengths.map((s) => <Badge key={s} variant="success" className="mr-1">{s}</Badge>)}</div>}
                    {pred.missingSkills?.length > 0 && <div><p className="text-xs text-amber-400 mb-1">Gaps</p>{pred.missingSkills.map((s) => <Badge key={s} variant="warning" className="mr-1">{s}</Badge>)}</div>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </QueryState>
  );
}
