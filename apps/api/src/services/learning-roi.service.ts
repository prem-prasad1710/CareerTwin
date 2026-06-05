import { prisma } from '@careertwin/database';
import { LearningROI } from '@careertwin/shared';

export async function compute(userId: string): Promise<LearningROI[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: { include: { skill: true } },
      profile: true,
    },
  });

  if (!user) throw new Error('User not found');

  const userSkillNames = new Set(user.skills.map((s) => s.skill.name));

  const marketSkills = await prisma.jobMarketSkill.findMany({
    where: { role: { contains: user.profile?.currentRole?.split(' ').pop() || 'Engineer' } },
    include: { skill: true },
    orderBy: { salaryPremium: 'desc' },
    take: 15,
  });

  return marketSkills
    .filter((ms) => !userSkillNames.has(ms.skill.name) || user.skills.find((s) => s.skill.name === ms.skill.name)?.proficiency! < 70)
    .map((ms) => {
      const currentLevel = user.skills.find((s) => s.skill.name === ms.skill.name)?.proficiency || 0;
      const gap = 80 - currentLevel;
      const salaryImpact = Math.round(ms.salaryPremium * (gap / 80));
      const promotionImpact = Math.round(ms.demandScore * 0.25);
      const marketDemand = Math.round(ms.demandScore);
      const totalROI = Math.round(salaryImpact + promotionImpact * 0.5 + marketDemand * 0.3);

      return {
        skill: ms.skill.name,
        salaryImpact,
        promotionImpact,
        marketDemand,
        totalROI,
        estimatedWeeks: Math.ceil(gap / 12) || 4,
      };
    })
    .sort((a, b) => b.totalROI - a.totalROI)
    .slice(0, 10);
}
