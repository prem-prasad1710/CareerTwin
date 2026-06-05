import { prisma } from '@careertwin/database';
import * as careerDna from './career-dna.service';
import * as careerScore from './career-score.service';
import * as marketValue from './market-value.service';
import * as health from './health.service';
import * as learningRoi from './learning-roi.service';
import * as risk from './risk.service';

export async function getOverview(userId: string) {
  const [user, dna, score, market, healthMetrics, roi, risks] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        careerGoals: { where: { status: 'ACTIVE' }, take: 3 },
        aiRecommendations: { where: { isDismissed: false }, orderBy: { createdAt: 'desc' }, take: 5 },
        learningActivities: { orderBy: { updatedAt: 'desc' }, take: 3 },
      },
    }),
    careerDna.compute(userId),
    careerScore.compute(userId),
    marketValue.compute(userId),
    health.compute(userId),
    learningRoi.compute(userId),
    risk.detect(userId),
  ]);

  return {
    user: {
      id: user?.id,
      name: `${user?.firstName} ${user?.lastName}`,
      role: user?.profile?.currentRole,
      company: user?.profile?.currentCompany,
      avatar: user?.avatarUrl,
    },
    careerScore: score,
    careerDna: dna,
    marketValue: market,
    health: healthMetrics,
    topLearningROI: roi.slice(0, 5),
    risks,
    goals: user?.careerGoals,
    recommendations: user?.aiRecommendations,
    recentLearning: user?.learningActivities,
  };
}
