'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QueryState } from '@/components/ui/query-state';
import { useLearningRoi, useSkillGap } from '@/hooks/use-career-api';
import { formatPercent } from '@/lib/utils';
import { GraduationCap, TrendingUp } from 'lucide-react';

const TARGET_ROLES = ['Senior Frontend Engineer', 'Senior Software Engineer', 'Staff Engineer', 'Product Manager'];

export default function LearningPage() {
  const { data: roi, isLoading, isError, error } = useLearningRoi();
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');
  const { data: skillGap } = useSkillGap(targetRole);

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><GraduationCap className="w-8 h-8 text-primary" /> Learning Center</h1>
          <p className="text-muted mt-1">Skills ranked by return on learning investment</p>
        </div>
        <Card glow>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Learning ROI Rankings</CardTitle></CardHeader>
          <div className="space-y-3">
            {(roi as Array<{ skill: string; totalROI: number; salaryImpact: number; promotionImpact: number; marketDemand: number; estimatedWeeks: number }>)?.map((item, i) => (
              <div key={item.skill} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">#{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1"><p className="font-semibold">{item.skill}</p><Badge variant="accent">ROI {item.totalROI}</Badge></div>
                  <div className="flex gap-4 text-xs text-muted">
                    <span className="text-emerald-400">{formatPercent(item.salaryImpact)} salary</span>
                    <span className="text-indigo-400">{formatPercent(item.promotionImpact)} promotion</span>
                    <span>{item.estimatedWeeks} weeks</span>
                  </div>
                  <Progress value={item.totalROI} max={70} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skill Gap Analysis</CardTitle><CardDescription>Compare against target role: {targetRole}</CardDescription></CardHeader>
          <div className="flex gap-2 mb-4 flex-wrap">
            {TARGET_ROLES.map((role) => (
              <button key={role} onClick={() => setTargetRole(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium ${targetRole === role ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-muted border border-white/5'}`}>
                {role}
              </button>
            ))}
          </div>
          {skillGap ? (
            <>
              <p className="text-sm text-muted mb-4">Readiness: <span className="text-primary font-bold">{(skillGap as { readinessScore: number }).readinessScore}%</span> · Est. {(skillGap as { estimatedCompletionWeeks: number }).estimatedCompletionWeeks} weeks</p>
              <div className="grid grid-cols-2 gap-3">
                {(skillGap as { gaps: Array<{ skill: string; currentLevel: number; requiredLevel: number; estimatedWeeks: number }> }).gaps?.map((gap) => (
                  <div key={gap.skill} className="p-3 rounded-xl bg-white/[0.02]">
                    <div className="flex justify-between text-sm mb-2"><span className="font-medium">{gap.skill}</span><span className="text-muted">{gap.currentLevel}/{gap.requiredLevel}</span></div>
                    <Progress value={gap.currentLevel} max={gap.requiredLevel} color="bg-amber-500" />
                    <p className="text-xs text-muted mt-1">{gap.estimatedWeeks} weeks to close</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </Card>
      </div>
    </QueryState>
  );
}
