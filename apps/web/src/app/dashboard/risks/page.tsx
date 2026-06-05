'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { demoDashboard } from '@/lib/demo-data';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function RisksPage() {
  const risks = demoDashboard.health.risks;

  const riskItems = [
    { label: 'Burnout Risk', value: risks.burnoutRisk, desc: 'Based on learning gaps, tenure, and interview stress', icon: '🔥' },
    { label: 'Stagnation Risk', value: risks.stagnationRisk, desc: 'Time in role, skill growth, and promotion velocity', icon: '📉' },
    { label: 'Layoff Vulnerability', value: risks.layoffVulnerability, desc: 'Company stability, skill relevance, and market position', icon: '⚠️' },
    { label: 'Skill Obsolescence', value: risks.skillObsolescenceRisk, desc: 'Outdated skills and lack of emerging tech adoption', icon: '🔄' },
  ];

  const getRiskLevel = (v: number) => {
    if (v >= 60) return { label: 'High', variant: 'danger' as const };
    if (v >= 40) return { label: 'Medium', variant: 'warning' as const };
    return { label: 'Low', variant: 'success' as const };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" /> Career Risk Detector
        </h1>
        <p className="text-muted mt-1">Proactive alerts for burnout, stagnation, layoffs, and skill obsolescence</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {riskItems.map((risk) => {
          const level = getRiskLevel(risk.value);
          return (
            <Card key={risk.label} className={risk.value >= 60 ? 'border-red-500/20' : ''}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{risk.icon}</span>
                    <h3 className="font-semibold">{risk.label}</h3>
                  </div>
                  <p className="text-xs text-muted mt-1">{risk.desc}</p>
                </div>
                <Badge variant={level.variant}>{level.label}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold" style={{
                  color: risk.value >= 60 ? '#ef4444' : risk.value >= 40 ? '#f59e0b' : '#10b981',
                }}>
                  {risk.value}%
                </span>
                <Progress
                  value={risk.value}
                  className="flex-1"
                  color={risk.value >= 60 ? 'bg-red-500' : risk.value >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <Card glow>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Recommendations
          </CardTitle>
          <CardDescription>Actionable steps to mitigate identified risks</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {risks.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <AlertTriangle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
