'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { QueryState } from '@/components/ui/query-state';
import { useMarketValue } from '@/hooks/use-career-api';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, MapPin, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function MarketValuePage() {
  const { data: mv, isLoading, isError, error } = useMarketValue();

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {mv ? (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Market Value Engine</h1>
            <p className="text-muted mt-1">Real-time salary estimation based on your profile and market data</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Current Value" value={formatCurrency(mv.current.median, mv.currency)} subtitle={`${formatCurrency(mv.current.min, mv.currency)} – ${formatCurrency(mv.current.max, mv.currency)}`} icon={DollarSign} />
            <StatCard title="12-Month Potential" value={formatCurrency(mv.potential.median, mv.currency)} icon={TrendingUp} trend={{ value: 32, label: 'growth potential' }} />
            <StatCard title="Currency" value={mv.currency} icon={MapPin} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Top Paying Cities</CardTitle></CardHeader>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mv.topCities.map((c: { city: string; median: number }) => ({ name: c.city, salary: c.median }))} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={(v) => formatCurrency(v, mv.currency)} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} width={100} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} formatter={(v) => [formatCurrency(Number(v), mv.currency), 'Median']} />
                  <Bar dataKey="salary" radius={[0, 6, 6, 0]}>
                    {mv.topCities.map((_: unknown, i: number) => <Cell key={i} fill={i === 0 ? '#6366f1' : 'rgba(99,102,241,0.4)'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> Top Industries</CardTitle></CardHeader>
              <div className="space-y-3">
                {mv.topIndustries.map((ind: { industry: string; median: number }, i: number) => (
                  <div key={ind.industry} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-lg font-bold text-primary w-6">{i + 1}</span>
                    <div className="flex-1"><p className="font-medium text-sm">{ind.industry}</p></div>
                    <span className="text-sm font-medium">{formatCurrency(ind.median, mv.currency)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </QueryState>
  );
}
