import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CareerDnaService } from '../engines/career-dna/career-dna.service';
import { CareerScoreService } from '../engines/career-score/career-score.service';
import { MarketValueService } from '../engines/market-value/market-value.service';
import { HealthService } from '../engines/health/health.service';
import { LearningRoiService } from '../engines/learning-roi/learning-roi.service';
import { RiskService } from '../engines/risk/risk.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private careerDna: CareerDnaService,
    private careerScore: CareerScoreService,
    private marketValue: MarketValueService,
    private health: HealthService,
    private learningRoi: LearningRoiService,
    private risk: RiskService,
  ) {}

  async getOverview(userId: string) {
    const [user, dna, score, market, healthMetrics, roi, risks] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          careerGoals: { where: { status: 'ACTIVE' }, take: 3 },
          aiRecommendations: { where: { isDismissed: false }, orderBy: { createdAt: 'desc' }, take: 5 },
          learningActivities: { orderBy: { updatedAt: 'desc' }, take: 3 },
        },
      }),
      this.careerDna.compute(userId),
      this.careerScore.compute(userId),
      this.marketValue.compute(userId),
      this.health.compute(userId),
      this.learningRoi.compute(userId),
      this.risk.detect(userId),
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
}
