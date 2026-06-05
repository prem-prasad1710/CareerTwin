'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { useJobMatches } from '@/hooks/use-career-api';
import { formatCurrency } from '@/lib/utils';
import { Briefcase, MapPin, ExternalLink } from 'lucide-react';

export default function JobsPage() {
  const { data: jobs, isLoading, isError, error } = useJobMatches();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Briefcase className="w-8 h-8 text-primary" /> Job Match Engine</h1>
          <p className="text-muted mt-1">AI-matched opportunities ranked by fit and success probability</p>
        </div>
        <div className="space-y-4">
          {(jobs as Array<{ company: string; role: string; location: string; salary: { min: number; max: number }; matchScore: number; missingSkills: string[]; strengths: string[]; successProbability: number }>)?.map((job, i) => (
            <Card key={job.company + job.role} className={i === 0 ? 'glow' : ''}>
              <div className="flex items-start gap-6">
                <div className="text-center w-20 flex-shrink-0">
                  <div className="text-3xl font-bold text-primary">{job.matchScore}</div>
                  <p className="text-[10px] text-muted">match</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div><h3 className="text-lg font-semibold">{job.role}</h3><p className="text-sm text-muted">{job.company} · <MapPin className="w-3 h-3 inline" /> {job.location}</p></div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(job.salary.min)} – {formatCurrency(job.salary.max)}</p>
                      <Badge variant="accent">{job.successProbability}% success</Badge>
                    </div>
                  </div>
                  <Progress value={job.matchScore} className="mt-3" />
                  <div className="flex gap-4 mt-3">
                    {job.strengths?.map((s) => <Badge key={s} variant="success">{s}</Badge>)}
                    {job.missingSkills?.map((s) => <Badge key={s} variant="warning">{s}</Badge>)}
                  </div>
                </div>
                <Button variant="secondary" size="sm"><ExternalLink className="w-3 h-3" /> Apply</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </QueryState>
  );
}
