'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CareerRadarChart } from '@/components/charts/radar-chart';
import { ScoreRing } from '@/components/charts/score-ring';
import { QueryState } from '@/components/ui/query-state';
import { useDashboard } from '@/hooks/use-career-api';
import { useCareerUser } from '@/hooks/use-career-user';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp, DollarSign, Target, Brain, ArrowRight, AlertTriangle,
  BookOpen, Zap, Shield, Award, Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { name } = useCareerUser();
  const { data, isLoading, isError, error } = useDashboard();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {data && (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, <span className="gradient-text">{data.user?.name?.split(' ')[0] || name?.split(' ')[0] || 'there'}</span> 👋
              </h1>
              <p className="text-muted mt-1 text-sm">
                {data.user?.role}{data.user?.company ? ` · ${data.user.company}` : ''} — Career Twin overview
              </p>
            </div>
            <Link href="/dashboard/simulator">
              <Button className="flex items-center gap-2 self-start">
                <Zap className="w-4 h-4" /> Simulate Decision
              </Button>
            </Link>
          </div>

          {/* Stats grid — 2 cols on mobile, 4 on md */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              title="Career Score"
              value={String(data.careerScore.overall)}
              subtitle={`Top ${100 - data.careerScore.peerPercentile}% of peers`}
              icon={Target}
              gradient="from-indigo-500 to-purple-600"
            />
            <StatCard
              title="Market Value"
              value={formatCurrency(data.marketValue.current.median, data.marketValue.currency)}
              subtitle={`Potential: ${formatCurrency(data.marketValue.potential.median, data.marketValue.currency)}`}
              icon={DollarSign}
              gradient="from-emerald-500 to-teal-600"
            />
            <StatCard
              title="Career Health"
              value={String(data.health.careerHealth)}
              subtitle="Overall wellness"
              icon={Activity}
              gradient="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Promo Ready"
              value={`${data.health.promotionReadiness}%`}
              subtitle="Readiness score"
              icon={Award}
              gradient="from-amber-500 to-orange-600"
            />
          </div>

          {/* Score + DNA — stacked on mobile, side-by-side on md */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="md:col-span-1 flex flex-col items-center py-6">
              <CardHeader className="w-full pb-4"><CardTitle className="flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Career Score</CardTitle></CardHeader>
              <ScoreRing score={data.careerScore.overall} label="/ 100" />
              <div className="w-full mt-5 space-y-2.5 px-2">
                {[
                  { label: 'Skills', value: data.careerScore.skills },
                  { label: 'Experience', value: data.careerScore.experience },
                  { label: 'Projects', value: data.careerScore.projectQuality },
                  { label: 'Learning', value: data.careerScore.learningConsistency },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted w-20 flex-shrink-0">{item.label}</span>
                    <Progress value={item.value} className="flex-1" />
                    <span className="text-xs font-medium w-6 text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Brain className="w-4 h-4 text-primary" />Career DNA</CardTitle>
                <CardDescription>Your professional fingerprint</CardDescription>
              </CardHeader>
              <CareerRadarChart data={Object.fromEntries(
                Object.entries(data.careerDna).filter(([k]) => !['strengths', 'weaknesses'].includes(k))
              ) as Record<string, number>} />
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-emerald-400 font-semibold mb-2 uppercase tracking-wider">Strengths</p>
                  <div className="flex flex-wrap gap-1">
                    {data.careerDna.strengths?.map((s: string) => <Badge key={s} variant="success" className="text-[10px]">{s}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-amber-400 font-semibold mb-2 uppercase tracking-wider">Growth Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {data.careerDna.weaknesses?.map((s: string) => <Badge key={s} variant="warning" className="text-[10px]">{s}</Badge>)}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Learning ROI + Career Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Top Learning ROI
                </CardTitle>
                <Link href="/dashboard/learning">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Button>
                </Link>
              </CardHeader>
              <div className="space-y-2">
                {data.topLearningROI?.slice(0, 4).map((item: { skill: string; totalROI: number; salaryImpact: number; estimatedWeeks: number }, i: number) => (
                  <div key={item.skill} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <span className="text-base font-bold gradient-text w-5 text-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.skill}</p>
                      <p className="text-xs text-muted">+{item.salaryImpact}% salary · {item.estimatedWeeks}w</p>
                    </div>
                    <Badge variant="accent" className="text-[10px] flex-shrink-0">ROI {item.totalROI}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Career Risks
                </CardTitle>
                <Link href="/dashboard/risks">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">Details <ArrowRight className="w-3 h-3" /></Button>
                </Link>
              </CardHeader>
              <div className="space-y-3">
                {[
                  { label: 'Burnout Risk', value: data.risks.burnoutRisk, icon: '🔥' },
                  { label: 'Stagnation Risk', value: data.risks.stagnationRisk, icon: '📉' },
                  { label: 'Skill Obsolescence', value: data.risks.skillObsolescenceRisk, icon: '🔄' },
                  { label: 'Layoff Vulnerability', value: data.risks.layoffVulnerability, icon: '⚠️' },
                ].map((risk) => (
                  <div key={risk.label}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted flex items-center gap-1.5"><span>{risk.icon}</span>{risk.label}</span>
                      <span className={`font-semibold text-xs ${risk.value >= 60 ? 'text-red-400' : risk.value >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {risk.value}%
                      </span>
                    </div>
                    <Progress
                      value={risk.value}
                      color={risk.value >= 60 ? 'bg-red-500' : risk.value >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Active Goals */}
          {data.goals?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" />Active Goals</CardTitle>
                <Link href="/dashboard/goals">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">Manage <ArrowRight className="w-3 h-3" /></Button>
                </Link>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.goals.map((goal: { id: string; title: string; targetRole: string; progress: number }) => (
                  <div key={goal.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-sm truncate">{goal.title}</p>
                        {goal.targetRole && <p className="text-xs text-muted">→ {goal.targetRole}</p>}
                      </div>
                      <span className="text-sm font-bold gradient-text flex-shrink-0">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} color={goal.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: '/dashboard/coach', label: 'Talk to AI Coach', icon: '🤖', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/20' },
              { href: '/dashboard/timeline', label: 'View Career Path', icon: '🗺️', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' },
              { href: '/dashboard/jobs', label: 'Browse Job Matches', icon: '💼', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20' },
              { href: '/dashboard/learning', label: 'Learn & Upskill', icon: '📚', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/20' },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} border glass-hover cursor-pointer transition-all hover:scale-[1.02] text-center`}>
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-xs font-medium">{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </QueryState>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, gradient }: {
  title: string; value: string; subtitle: string; icon: typeof Target; gradient: string;
}) {
  return (
    <Card className="card-hover gradient-border">
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-xl md:text-2xl font-bold number-ticker">{value}</p>
      <p className="text-xs text-muted mt-0.5">{title}</p>
      <p className="text-[10px] text-muted/70 mt-1 truncate">{subtitle}</p>
    </Card>
  );
}
