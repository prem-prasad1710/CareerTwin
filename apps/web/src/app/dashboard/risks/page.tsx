'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { useRisks } from '@/hooks/use-career-api';
import { Shield, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

const RISK_META = {
  burnout:     { icon: '🔥', label: 'Burnout Risk',        desc: 'Workload, stress, and energy depletion signals' },
  stagnation:  { icon: '📉', label: 'Stagnation Risk',     desc: 'Career growth plateau and skill velocity' },
  layoff:      { icon: '⚠️', label: 'Layoff Vulnerability', desc: 'Market demand and role replacement likelihood' },
  obsolescence:{ icon: '🔄', label: 'Skill Obsolescence',  desc: 'Technology deprecation and learning lag' },
};

export default function RisksPage() {
  const { data: risks, isLoading, isError, error } = useRisks();

  const riskItems = risks ? [
    { ...RISK_META.burnout, value: risks.burnoutRisk },
    { ...RISK_META.stagnation, value: risks.stagnationRisk },
    { ...RISK_META.layoff, value: risks.layoffVulnerability },
    { ...RISK_META.obsolescence, value: risks.skillObsolescenceRisk },
  ] : [];

  const overallRisk = riskItems.length ? Math.round(riskItems.reduce((s, r) => s + r.value, 0) / riskItems.length) : 0;
  const riskLevel = overallRisk >= 60 ? 'High' : overallRisk >= 40 ? 'Moderate' : 'Low';
  const riskColor = overallRisk >= 60 ? 'text-red-400' : overallRisk >= 40 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Career Risk Detector
          </h1>
          <p className="text-muted mt-1">Proactive alerts for burnout, stagnation, and skill obsolescence</p>
        </div>

        {/* Overall risk score */}
        {risks && (
          <Card className="gradient-border glow-warning">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={overallRisk >= 60 ? '#ef4444' : overallRisk >= 40 ? '#f59e0b' : '#10b981'}
                    strokeWidth="10"
                    strokeDasharray={`${(overallRisk / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold ${riskColor}`}>{overallRisk}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Overall Risk: <span className={riskColor}>{riskLevel}</span></h2>
                <p className="text-muted text-sm mt-1">
                  {riskLevel === 'Low' && 'Your career is on a healthy trajectory with manageable risks.'}
                  {riskLevel === 'Moderate' && 'Some risk factors detected. Address recommendations below.'}
                  {riskLevel === 'High' && 'Multiple elevated risks require immediate attention.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Risk cards — 2 cols on mobile too */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {riskItems.map((risk) => {
            const isHigh = risk.value >= 60;
            const isMed = risk.value >= 40;
            return (
              <Card key={risk.label} className={`card-hover ${isHigh ? 'border-red-500/20' : isMed ? 'border-amber-500/20' : 'border-white/5'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{risk.icon}</span>
                  <div>
                    <h3 className="font-semibold">{risk.label}</h3>
                    <p className="text-xs text-muted">{risk.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span
                    className="text-4xl font-bold number-ticker"
                    style={{ color: isHigh ? '#ef4444' : isMed ? '#f59e0b' : '#10b981' }}
                  >
                    {risk.value}%
                  </span>
                  <div className="flex-1">
                    <Progress
                      value={risk.value}
                      color={isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}
                    />
                    <p className={`text-xs mt-1 ${isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {isHigh ? 'Action required' : isMed ? 'Monitor closely' : 'On track'}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recommendations */}
        {risks?.recommendations && risks.recommendations.length > 0 && (
          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" /> Mitigation Recommendations
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {risks.recommendations.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-emerald-400">{i + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Trend placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-indigo-400" /> Risk Trend (30 days)
            </CardTitle>
          </CardHeader>
          <div className="h-20 flex items-end gap-1.5 px-2">
            {Array.from({ length: 30 }, (_, i) => {
              const h = 30 + Math.sin(i * 0.5) * 20 + Math.random() * 15;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-indigo-500/20 hover:bg-indigo-500/40 transition-colors"
                  style={{ height: `${h}%` }}
                  title={`Day ${i + 1}`}
                />
              );
            })}
          </div>
          <p className="text-xs text-muted mt-2 text-center">Risk level variation over the past 30 days</p>
        </Card>
      </div>
    </QueryState>
  );
}
