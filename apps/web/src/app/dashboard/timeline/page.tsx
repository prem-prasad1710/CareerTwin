'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { demoTimeline } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { Clock, GitBranch } from 'lucide-react';

export default function TimelinePage() {
  const { primary, alternate } = demoTimeline;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Clock className="w-8 h-8 text-primary" /> Career Timeline Predictor
        </h1>
        <p className="text-muted mt-1">AI-generated career roadmap with confidence scores and alternate paths</p>
      </div>

      <Card glow>
        <CardHeader>
          <CardTitle>Primary Timeline</CardTitle>
          <CardDescription>Most likely career trajectory based on your profile</CardDescription>
        </CardHeader>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent" />
          <div className="space-y-6">
            {primary.map((entry, i) => (
              <div key={entry.year} className="flex items-start gap-6 pl-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0 z-10">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{entry.role}</p>
                      <p className="text-xs text-muted">{entry.year}</p>
                    </div>
                    <div className="text-right">
                      {entry.salary && <p className="font-bold text-primary">{formatCurrency(entry.salary)}</p>}
                      <Badge variant={entry.confidence >= 70 ? 'success' : entry.confidence >= 50 ? 'accent' : 'warning'}>
                        {entry.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-accent" /> Alternate Timelines
          </CardTitle>
          <CardDescription>Other possible career paths based on different decisions</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-3 gap-4">
          {alternate.map((entry) => (
            <div key={entry.scenario} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-accent/30 transition-colors">
              <Badge variant="accent" className="mb-3">{entry.scenario?.replace(/_/g, ' ')}</Badge>
              <p className="font-semibold">{entry.role}</p>
              {entry.company && <p className="text-sm text-muted">{entry.company}</p>}
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted">{entry.year}</span>
                {entry.salary && <span className="text-sm font-bold">{formatCurrency(entry.salary)}</span>}
              </div>
              <div className="mt-2">
                <Badge variant={entry.confidence >= 60 ? 'success' : 'warning'}>{entry.confidence}% likely</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
