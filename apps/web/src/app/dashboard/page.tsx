'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CareerRadarChart } from '@/components/charts/radar-chart';
import { ScoreRing } from '@/components/charts/score-ring';
import { QueryState } from '@/components/ui/query-state';
import { useDashboard } from '@/hooks/use-career-api';
import { useCareerUser } from '@/hooks/use-career-user';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, DollarSign, Target, Brain, ArrowRight, AlertTriangle, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { name } = useCareerUser();
  const { data, isLoading, isError, error } = useDashboard();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error} isEmpty={!data}>
      <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, <span className="gradient-text">{data.user?.name?.split(' ')[0] || name?.split(' ')[0] || 'there'}</span>
              </h1>
              <p className="text-muted mt-1">
                {data.user?.role} {data.user?.company ? `at ${data.user.company}` : ''} — Your Career Twin overview
              </p>
            </div>
            <Link href="/dashboard/simulator"><Button><Zap className="w-4 h-4" /> Simulate Decision</Button></Link>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Career Score" value={data.careerScore.overall} subtitle={`Top ${100 - data.careerScore.peerPercentile}% of peers`} icon={Target} />
            <StatCard title="Market Value" value={formatCurrency(data.marketValue.current.median, data.marketValue.currency)} subtitle={`Potential: ${formatCurrency(data.marketValue.potential.median, data.marketValue.currency)}`} icon={DollarSign} />
            <StatCard title="Career Health" value={data.health.careerHealth} subtitle="Overall wellness" icon={TrendingUp} />
            <StatCard title="Promotion Ready" value={`${data.health.promotionReadiness}%`} subtitle="Readiness score" icon={Brain} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-1 flex flex-col items-center justify-center py-8">
              <CardHeader className="w-full"><CardTitle>Career Score</CardTitle></CardHeader>
              <ScoreRing score={data.careerScore.overall} label="/ 100" />
              <div className="w-full mt-6 space-y-3 px-2">
                {[
                  { label: 'Skills', value: data.careerScore.skills },
                  { label: 'Experience', value: data.careerScore.experience },
                  { label: 'Projects', value: data.careerScore.projectQuality },
                  { label: 'Learning', value: data.careerScore.learningConsistency },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted w-20">{item.label}</span>
                    <Progress value={item.value} className="flex-1" />
                    <span className="text-xs font-medium w-8">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Career DNA</CardTitle>
                <CardDescription>Your professional fingerprint</CardDescription>
              </CardHeader>
              <CareerRadarChart data={Object.fromEntries(
                Object.entries(data.careerDna).filter(([k]) => !['strengths', 'weaknesses'].includes(k))
              ) as Record<string, number>} />
              <div className="flex gap-4 mt-2">
                <div className="flex-1">
                  <p className="text-xs text-emerald-400 font-medium mb-1">Strengths</p>
                  {data.careerDna.strengths?.map((s: string) => <Badge key={s} variant="success" className="mr-1 mb-1">{s}</Badge>)}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-amber-400 font-medium mb-1">Growth Areas</p>
                  {data.careerDna.weaknesses?.map((s: string) => <Badge key={s} variant="warning" className="mr-1 mb-1">{s}</Badge>)}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Top Learning ROI</CardTitle>
                <Link href="/dashboard/learning"><Button variant="ghost" size="sm">View All <ArrowRight className="w-3 h-3" /></Button></Link>
              </CardHeader>
              <div className="space-y-3">
                {data.topLearningROI?.map((item: { skill: string; totalROI: number; salaryImpact: number; estimatedWeeks: number }, i: number) => (
                  <div key={item.skill} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-lg font-bold text-primary w-6">{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.skill}</p>
                      <p className="text-xs text-muted">+{item.salaryImpact}% salary · {item.estimatedWeeks} weeks</p>
                    </div>
                    <Badge variant="accent">ROI {item.totalROI}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /> Career Risks</CardTitle>
                <Link href="/dashboard/risks"><Button variant="ghost" size="sm">Details <ArrowRight className="w-3 h-3" /></Button></Link>
              </CardHeader>
              <div className="space-y-4">
                {[
                  { label: 'Burnout Risk', value: data.risks.burnoutRisk, color: 'bg-amber-500' },
                  { label: 'Stagnation Risk', value: data.risks.stagnationRisk, color: 'bg-orange-500' },
                  { label: 'Skill Obsolescence', value: data.risks.skillObsolescenceRisk, color: 'bg-red-500' },
                  { label: 'Layoff Vulnerability', value: data.risks.layoffVulnerability, color: 'bg-rose-500' },
                ].map((risk) => (
                  <div key={risk.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">{risk.label}</span>
                      <span className="font-medium">{risk.value}%</span>
                    </div>
                    <Progress value={risk.value} color={risk.color} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {data.goals?.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Active Goals</CardTitle></CardHeader>
              <div className="grid grid-cols-2 gap-4">
                {data.goals.map((goal: { id: string; title: string; targetRole: string; progress: number }) => (
                  <div key={goal.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between mb-2">
                      <div><p className="font-medium">{goal.title}</p><p className="text-xs text-muted">{goal.targetRole}</p></div>
                      <span className="text-sm font-bold text-primary">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
    </QueryState>
  );
}
