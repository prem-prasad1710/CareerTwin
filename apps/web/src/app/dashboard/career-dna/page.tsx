'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CareerRadarChart } from '@/components/charts/radar-chart';
import { QueryState } from '@/components/ui/query-state';
import { useCareerDna, useShareCard } from '@/hooks/use-career-api';
import { Share2 } from 'lucide-react';

const DIMENSION_INFO: Record<string, { desc: string; tips: string[] }> = {
  frontend: { desc: 'UI frameworks, CSS, responsive design', tips: ['Build a design system project', 'Contribute to UI libraries'] },
  backend: { desc: 'APIs, databases, server architecture', tips: ['Design a REST/GraphQL API', 'Learn database optimization'] },
  ai: { desc: 'Machine learning, LLMs, data science', tips: ['Take Andrew Ng ML course', 'Build an AI side project'] },
  cloud: { desc: 'AWS, GCP, Azure infrastructure', tips: ['Get AWS Solutions Architect cert', 'Deploy a production app'] },
  devops: { desc: 'CI/CD, containers, infrastructure', tips: ['Set up GitHub Actions pipeline', 'Learn Kubernetes basics'] },
  leadership: { desc: 'Team management, mentoring, strategy', tips: ['Mentor a junior developer', 'Lead a cross-team initiative'] },
  communication: { desc: 'Technical writing, presentations', tips: ['Write technical blog posts', 'Present at team meetings'] },
  productThinking: { desc: 'User empathy, product strategy', tips: ['Shadow a PM for a sprint', 'Run user research sessions'] },
  architecture: { desc: 'System design, scalability patterns', tips: ['Study system design interviews', 'Design a distributed system'] },
  data: { desc: 'Data pipelines, analytics, SQL', tips: ['Build a data pipeline', 'Learn advanced SQL'] },
};

export default function CareerDnaPage() {
  const { data: rawDna, isLoading, isError, error } = useCareerDna();
  const dna = rawDna as Record<string, unknown> & { strengths?: string[]; weaknesses?: string[] } | undefined;
  const shareCard = useShareCard();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {dna && (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Career DNA</h1>
            <p className="text-muted mt-1">Your professional fingerprint across 10 dimensions</p>
          </div>
          <Button variant="secondary" onClick={() => shareCard.mutate({ type: 'career_dna', title: 'My Career DNA', data: dna as Record<string, unknown> })}>
            <Share2 className="w-4 h-4" /> Share DNA Card
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card glow>
            <CardHeader><CardTitle>DNA Radar</CardTitle></CardHeader>
            <CareerRadarChart data={Object.fromEntries(Object.entries(dna).filter(([k]) => k in DIMENSION_INFO)) as Record<string, number>} />
          </Card>
          <Card>
            <CardHeader><CardTitle>Dimension Breakdown</CardTitle></CardHeader>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {Object.entries(dna).filter(([k]) => k in DIMENSION_INFO).sort(([, a], [, b]) => (b as number) - (a as number)).map(([key, score]) => (
                <button key={key} onClick={() => setSelected(selected === key ? null : key)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-left">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-sm font-bold">{score as number}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {selected && DIMENSION_INFO[selected] && (
          <Card glow>
            <CardHeader>
              <CardTitle className="capitalize">{selected.replace(/([A-Z])/g, ' $1')} — Growth Plan</CardTitle>
              <CardDescription>{DIMENSION_INFO[selected].desc}</CardDescription>
            </CardHeader>
            <div className="flex gap-3">
              {DIMENSION_INFO[selected].tips.map((tip) => (
                <div key={tip} className="flex-1 p-4 rounded-xl bg-primary/5 border border-primary/10"><p className="text-sm">{tip}</p></div>
              ))}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="text-emerald-400">Top Strengths</CardTitle></CardHeader>
            {dna.strengths?.map((s: string) => <Badge key={s} variant="success" className="mr-2 mb-2">{s}</Badge>)}
          </Card>
          <Card><CardHeader><CardTitle className="text-amber-400">Growth Areas</CardTitle></CardHeader>
            {dna.weaknesses?.map((s: string) => <Badge key={s} variant="warning" className="mr-2 mb-2">{s}</Badge>)}
          </Card>
        </div>
      </div>
      )}
    </QueryState>
  );
}
