import { prisma } from '@careertwin/database';
import { SkillGapAnalysis } from '@careertwin/shared';

const ROLE_REQUIREMENTS: Record<string, { skill: string; level: number }[]> = {
  'Senior Frontend Engineer': [
    { skill: 'React', level: 90 }, { skill: 'TypeScript', level: 85 },
    { skill: 'System Design', level: 60 }, { skill: 'Next.js', level: 80 },
    { skill: 'Communication', level: 75 }, { skill: 'Leadership', level: 50 },
  ],
  'Senior Software Engineer': [
    { skill: 'System Design', level: 80 }, { skill: 'Data Structures', level: 85 },
    { skill: 'Algorithms', level: 80 }, { skill: 'TypeScript', level: 75 },
    { skill: 'AWS', level: 65 }, { skill: 'Leadership', level: 60 },
  ],
  'Staff Engineer': [
    { skill: 'System Design', level: 95 }, { skill: 'Architecture', level: 90 },
    { skill: 'Leadership', level: 85 }, { skill: 'Communication', level: 80 },
    { skill: 'Microservices', level: 85 }, { skill: 'AWS', level: 80 },
  ],
  'Product Manager': [
    { skill: 'Product Management', level: 85 }, { skill: 'Communication', level: 90 },
    { skill: 'Leadership', level: 75 }, { skill: 'Data', level: 60 },
  ],
};

export async function analyze(userId: string, targetRole: string): Promise<SkillGapAnalysis> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { skills: { include: { skill: true } } },
  });

  if (!user) throw new Error('User not found');

  const requirements = ROLE_REQUIREMENTS[targetRole] || ROLE_REQUIREMENTS['Senior Software Engineer'];
  const userSkillMap = new Map<string, number>(
    user.skills.map((s) => [s.skill.name, s.proficiency]),
  );

  const gaps = requirements
    .map((req) => {
      const current = userSkillMap.get(req.skill) || 0;
      const gap = req.level - current;
      if (gap <= 0) return null;
      return {
        skill: req.skill,
        currentLevel: current,
        requiredLevel: req.level,
        priority: Math.round(gap * 1.5),
        estimatedWeeks: Math.ceil(gap / 10),
        salaryImpact: Math.round(gap * 0.5),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b!.priority - a!.priority) as SkillGapAnalysis['gaps'];

  const totalWeeks = gaps.reduce((s, g) => s + g.estimatedWeeks, 0);
  const readinessScore = Math.round(
    requirements.reduce((s, r) => {
      const current = userSkillMap.get(r.skill) || 0;
      return s + Math.min(100, (current / r.level) * 100);
    }, 0) / requirements.length,
  );

  const roadmap = [
    { phase: 'Foundation', skills: gaps.slice(0, 2).map((g) => g.skill), weeks: Math.ceil(totalWeeks * 0.3) },
    { phase: 'Intermediate', skills: gaps.slice(2, 4).map((g) => g.skill), weeks: Math.ceil(totalWeeks * 0.4) },
    { phase: 'Advanced', skills: gaps.slice(4).map((g) => g.skill), weeks: Math.ceil(totalWeeks * 0.3) },
  ].filter((p) => p.skills.length > 0);

  return {
    targetRole,
    gaps,
    roadmap,
    estimatedCompletionWeeks: totalWeeks,
    readinessScore,
  };
}
