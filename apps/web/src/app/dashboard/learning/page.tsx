'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { demoDashboard } from '@/lib/demo-data';
import { formatPercent } from '@/lib/utils';
import { GraduationCap, TrendingUp } from 'lucide-react';

const TARGET_ROLES = [
  'Senior Frontend Engineer',
  'Senior Software Engineer',
  'Staff Engineer',
  'Product Manager',
];

export default function LearningPage() {
  const roi = demoDashboard.topLearningROI;
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-primary" /> Learning Center
        </h1>
        <p className="text-muted mt-1">Skills ranked by return on learning investment</p>
      </div>

      <Card glow>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Learning ROI Rankings
          </CardTitle>
          <CardDescription>Highest impact skills to learn next</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {roi.map((item, i) => (
            <div key={item.skill} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                #{i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold">{item.skill}</p>
                  <Badge variant="accent">ROI Score: {item.totalROI}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted">
                  <span className="text-emerald-400">{formatPercent(item.salaryImpact)} salary</span>
                  <span className="text-indigo-400">{formatPercent(item.promotionImpact)} promotion</span>
                  <span className="text-purple-400">{item.marketDemand}% demand</span>
                  <span>{item.estimatedWeeks} weeks</span>
                </div>
                <Progress value={item.totalROI} max={70} className="mt-2" color="bg-primary" />
              </div>
              <Button variant="secondary" size="sm">Start Learning</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Gap Analysis</CardTitle>
          <CardDescription>Compare your profile against a target role</CardDescription>
        </CardHeader>
        <div className="flex gap-2 mb-4">
          {TARGET_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setTargetRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                targetRole === role
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/5 text-muted border border-white/5'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { skill: 'System Design', current: 54, required: 80, weeks: 8 },
            { skill: 'Leadership', current: 30, required: 60, weeks: 10 },
            { skill: 'AWS', current: 62, required: 65, weeks: 3 },
            { skill: 'Algorithms', current: 70, required: 80, weeks: 5 },
          ].map((gap) => (
            <div key={gap.skill} className="p-3 rounded-xl bg-white/[0.02]">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{gap.skill}</span>
                <span className="text-muted">{gap.current}/{gap.required}</span>
              </div>
              <Progress value={gap.current} max={gap.required} color="bg-amber-500" />
              <p className="text-xs text-muted mt-1">{gap.weeks} weeks to close gap</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
