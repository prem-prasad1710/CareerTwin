'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { useRisks } from '@/hooks/use-career-api';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RisksPage() {
  const { data: risks, isLoading, isError, error } = useRisks();

  const riskItems = risks ? [
    { label: 'Burnout Risk', value: risks.burnoutRisk, icon: '🔥' },
    { label: 'Stagnation Risk', value: risks.stagnationRisk, icon: '📉' },
    { label: 'Layoff Vulnerability', value: risks.layoffVulnerability, icon: '⚠️' },
    { label: 'Skill Obsolescence', value: risks.skillObsolescenceRisk, icon: '🔄' },
  ] : [];

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Shield className="w-8 h-8 text-primary" /> Career Risk Detector</h1>
          <p className="text-muted mt-1">Proactive alerts for burnout, stagnation, and skill obsolescence</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {riskItems.map((risk) => (
            <Card key={risk.label}>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{risk.icon}</span>
                <h3 className="font-semibold">{risk.label}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold" style={{ color: risk.value >= 60 ? '#ef4444' : risk.value >= 40 ? '#f59e0b' : '#10b981' }}>{risk.value}%</span>
                <Progress value={risk.value} className="flex-1" color={risk.value >= 60 ? 'bg-red-500' : risk.value >= 40 ? 'bg-amber-500' : 'bg-emerald-500'} />
              </div>
            </Card>
          ))}
        </div>
        {risks?.recommendations && (
          <Card glow>
            <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Recommendations</CardTitle></CardHeader>
            <div className="space-y-3">
              {risks.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <AlertTriangle className="w-4 h-4 text-emerald-400 mt-0.5" /><p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </QueryState>
  );
}
