import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CareerRisk } from '@careertwin/shared';

@Injectable()
export class RiskService {
  constructor(private prisma: PrismaService) {}

  async detect(userId: string): Promise<CareerRisk> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        learningActivities: { orderBy: { updatedAt: 'desc' }, take: 10 },
        workExperiences: true,
        interviewHistory: true,
      },
    });

    if (!user) throw new Error('User not found');

    const monthsSinceLearning = user.learningActivities.length > 0
      ? (Date.now() - new Date(user.learningActivities[0].updatedAt).getTime()) / (1000 * 60 * 60 * 24 * 30)
      : 12;

    const yearsInRole = user.workExperiences.find((w) => w.isCurrent);
    const tenureYears = yearsInRole
      ? (Date.now() - new Date(yearsInRole.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
      : 1;

    const outdatedSkills = user.skills.filter((s) =>
      ['COBOL', 'jQuery', 'PHP'].includes(s.skill.name) ||
      (s.lastUsed && (Date.now() - new Date(s.lastUsed).getTime()) > 1000 * 60 * 60 * 24 * 365 * 2),
    ).length;

    const burnoutRisk = Math.min(100, Math.round(
      (monthsSinceLearning > 3 ? 30 : 10) +
      (tenureYears > 4 ? 25 : 0) +
      (user.interviewHistory.filter((i) => i.outcome === 'FAILED').length > 3 ? 20 : 0),
    ));

    const stagnationRisk = Math.min(100, Math.round(
      (tenureYears > 3 ? 35 : 10) +
      (monthsSinceLearning > 6 ? 30 : 0) +
      (user.skills.length < 5 ? 20 : 0),
    ));

    const layoffVulnerability = Math.min(100, Math.round(
      (user.profile?.currentCompany ? 20 : 40) +
      (user.skills.filter((s) => s.skill.category === 'AI_ML').length === 0 ? 15 : 0) +
      (stagnationRisk * 0.3),
    ));

    const skillObsolescenceRisk = Math.min(100, Math.round(
      outdatedSkills * 20 +
      (user.skills.filter((s) => s.proficiency < 40).length * 8) +
      (monthsSinceLearning > 4 ? 25 : 0),
    ));

    const recommendations: string[] = [];
    if (burnoutRisk > 50) recommendations.push('Take on a challenging side project to reignite passion');
    if (stagnationRisk > 50) recommendations.push('Seek a role change or promotion within 6 months');
    if (layoffVulnerability > 50) recommendations.push('Build emergency fund and diversify skill portfolio');
    if (skillObsolescenceRisk > 50) recommendations.push('Invest in AI/ML and cloud-native technologies immediately');
    if (recommendations.length === 0) recommendations.push('Career trajectory looks healthy. Maintain learning momentum.');

    const result: CareerRisk = {
      burnoutRisk,
      stagnationRisk,
      layoffVulnerability,
      skillObsolescenceRisk,
      recommendations,
    };

    await this.prisma.profile.upsert({
      where: { userId },
      update: { riskProfile: result as any },
      create: { userId, riskProfile: result as any },
    });

    return result;
  }
}
