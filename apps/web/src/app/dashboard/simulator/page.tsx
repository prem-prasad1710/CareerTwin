'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { useCareerUserId } from '@/hooks/use-career-user';
import { api } from '@/lib/api';
import { formatPercent } from '@/lib/utils';
import { FlaskConical, Zap, TrendingUp, Target, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PRESETS = [
  { label: 'Learn AI for 6 months', scenario: 'If I learn AI for 6 months', duration: '6' },
  { label: 'Learn System Design', scenario: 'If I learn System Design for 4 months', duration: '4' },
  { label: 'Switch to Backend', scenario: 'If I switch to backend development', duration: '6' },
  { label: 'Move to Bangalore', scenario: 'If I move to Bangalore', duration: '3' },
  { label: 'Open Source', scenario: 'If I contribute to open source', duration: '6' },
  { label: 'Leadership Track', scenario: 'If I focus on leadership skills', duration: '12' },
];

interface SimResult {
  scenario: string;
  salaryImpact: number;
  promotionProbability: number;
  interviewSuccessProbability: number;
  careerGrowthImpact: number;
  timeline: { month: number; role: string; salary: number }[];
  insights: string[];
}

export default function SimulatorPage() {
  const userId = useCareerUserId();
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [custom, setCustom] = useState('');

  const runSimulation = async (scenario: string, duration?: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.simulate(userId, { scenario, duration });
      setResult(res as SimResult);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const chartData = result?.timeline.map((t) => ({ month: `M${t.month}`, salary: t.salary })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><FlaskConical className="w-8 h-8 text-primary" /> Career Simulator</h1>
        <p className="text-muted mt-1">Simulate career decisions and see predicted outcomes</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Scenarios</CardTitle></CardHeader>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => runSimulation(p.scenario, p.duration)} disabled={loading || !userId}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
              <Zap className="w-4 h-4 text-primary mb-2" /><p className="text-sm font-medium">{p.label}</p>
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom scenario..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50" />
          <Button onClick={() => custom && runSimulation(custom)} disabled={loading || !userId}>{loading ? 'Simulating...' : 'Simulate'}</Button>
        </div>
      </Card>

      {result && (
        <>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Salary Impact', value: result.salaryImpact, icon: TrendingUp, color: 'text-emerald-400' },
              { label: 'Promotion Probability', value: result.promotionProbability, icon: Target, color: 'text-indigo-400' },
              { label: 'Interview Success', value: result.interviewSuccessProbability, icon: Briefcase, color: 'text-purple-400' },
              { label: 'Career Growth', value: result.careerGrowthImpact, icon: Zap, color: 'text-amber-400' },
            ].map((m) => (
              <Card key={m.label} glow>
                <div className="flex items-center gap-3">
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                  <div><p className="text-xs text-muted">{m.label}</p><p className={`text-2xl font-bold ${m.color}`}>{formatPercent(m.value)}</p></div>
                </div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Salary Trajectory</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} />
                  <Bar dataKey="salary" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <CardHeader><CardTitle>Impact Breakdown</CardTitle></CardHeader>
              <div className="space-y-4">
                {[
                  { label: 'Salary Impact', value: result.salaryImpact },
                  { label: 'Promotion Probability', value: result.promotionProbability },
                  { label: 'Interview Success', value: result.interviewSuccessProbability },
                  { label: 'Career Growth', value: result.careerGrowthImpact },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-muted">{m.label}</span><span className="font-medium text-emerald-400">{formatPercent(m.value)}</span></div>
                    <Progress value={Math.abs(m.value)} color="bg-emerald-500" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card glow>
            <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
            <div className="space-y-3">
              {result.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-primary/5">
                  <Badge variant="accent">{i + 1}</Badge><p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
