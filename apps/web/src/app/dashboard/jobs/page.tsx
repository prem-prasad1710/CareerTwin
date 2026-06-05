'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { demoJobMatches } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { Briefcase, MapPin, ExternalLink } from 'lucide-react';

export default function JobsPage() {
  const jobs = demoJobMatches;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" /> Job Match Engine
        </h1>
        <p className="text-muted mt-1">AI-matched opportunities ranked by fit, success probability, and salary alignment</p>
      </div>

      <div className="space-y-4">
        {jobs.map((job, i) => (
          <Card key={job.company} className={i === 0 ? 'glow' : ''}>
            <div className="flex items-start gap-6">
              <div className="text-center w-20 flex-shrink-0">
                <div className="text-3xl font-bold" style={{
                  color: job.matchScore >= 80 ? '#10b981' : job.matchScore >= 60 ? '#6366f1' : '#f59e0b',
                }}>
                  {job.matchScore}
                </div>
                <p className="text-[10px] text-muted">match score</p>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.role}</h3>
                    <p className="text-sm text-muted flex items-center gap-1 mt-0.5">
                      {job.company} · <MapPin className="w-3 h-3" /> {job.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(job.salary.min)} – {formatCurrency(job.salary.max)}</p>
                    <Badge variant={job.successProbability >= 70 ? 'success' : 'accent'}>
                      {job.successProbability}% success
                    </Badge>
                  </div>
                </div>
                <Progress value={job.matchScore} className="mt-3" color={
                  job.matchScore >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'
                } />
                <div className="flex gap-4 mt-3">
                  {job.strengths.length > 0 && (
                    <div>
                      <p className="text-xs text-emerald-400 mb-1">Strengths</p>
                      {job.strengths.map((s) => <Badge key={s} variant="success" className="mr-1">{s}</Badge>)}
                    </div>
                  )}
                  {job.missingSkills.length > 0 && (
                    <div>
                      <p className="text-xs text-amber-400 mb-1">Missing</p>
                      {job.missingSkills.map((s) => <Badge key={s} variant="warning" className="mr-1">{s}</Badge>)}
                    </div>
                  )}
                </div>
              </div>
              <Button variant="secondary" size="sm"><ExternalLink className="w-3 h-3" /> Apply</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
