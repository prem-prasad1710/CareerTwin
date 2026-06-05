import { prisma } from '@careertwin/database';
import { CareerHealth } from '@careertwin/shared';
import * as riskService from './risk.service';

export async function compute(userId: string): Promise<CareerHealth> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      skills: true,
      learningActivities: true,
      interviewHistory: true,
      salaryHistory: { orderBy: { recordedAt: 'desc' }, take: 2 },
      workExperiences: true,
    },
  });

  if (!user) throw new Error('User not found');

  const careerHealth = user.profile?.careerScore || 50;
  const marketDemand = Math.min(100, user.skills.length * 6 + 30);
  const salaryGrowth = user.salaryHistory.length >= 2
    ? Math.min(100, Math.round(
        ((user.salaryHistory[0].amount - user.salaryHistory[1].amount) / user.salaryHistory[1].amount) * 100 + 50,
      ))
    : 55;
  const interviewReadiness = user.interviewHistory.length > 0
    ? Math.round((user.interviewHistory.filter((i) => i.outcome === 'PASSED').length / user.interviewHistory.length) * 100)
    : 50;
  const learningVelocity = Math.min(100, user.learningActivities.length * 10 + 20);
  const promotionReadiness = Math.min(100,
    (user.profile?.yearsExperience || 0) * 15 +
    (user.skills.filter((s) => s.proficiency >= 70).length * 5) +
    (user.workExperiences.length * 8),
  );

  const risks = await riskService.detect(userId);

  const result: CareerHealth = {
    careerHealth,
    marketDemand,
    salaryGrowth,
    interviewReadiness,
    learningVelocity,
    promotionReadiness,
    risks,
  };

  await prisma.careerHealthMetric.create({
    data: {
      userId,
      careerHealth,
      marketDemand,
      salaryGrowth,
      interviewReadiness,
      learningVelocity,
      promotionReadiness,
      burnoutRisk: risks.burnoutRisk,
      stagnationRisk: risks.stagnationRisk,
      layoffVulnerability: risks.layoffVulnerability,
      skillObsolescenceRisk: risks.skillObsolescenceRisk,
    },
  });

  return result;
}
