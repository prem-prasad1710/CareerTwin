import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MarketValue } from '@careertwin/shared';

@Injectable()
export class MarketValueService {
  constructor(private prisma: PrismaService) {}

  async compute(userId: string): Promise<MarketValue> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        salaryHistory: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });

    if (!user) throw new Error('User not found');

    const role = user.profile?.currentRole || 'Software Engineer';
    const location = user.profile?.location || 'San Francisco';
    const years = user.profile?.yearsExperience || 2;

    const marketData = await this.prisma.marketData.findMany({
      where: { role: { contains: role.split(' ').pop() || 'Engineer' } },
      orderBy: { demandIndex: 'desc' },
      take: 10,
    });

    const baseMedian = marketData.find((m) => m.location === location)?.medianSalary
      || marketData[0]?.medianSalary
      || 120000;

    const skillPremium = user.skills.reduce(
      (sum, s) => sum + (s.skill.salaryImpact || 0) * (s.proficiency / 100),
      0,
    );
    const experienceMultiplier = 1 + years * 0.08;

    const currentMedian = Math.round(baseMedian * experienceMultiplier * (1 + skillPremium / 100));
    const potentialMedian = Math.round(currentMedian * 1.35);

    const result: MarketValue = {
      current: {
        min: Math.round(currentMedian * 0.85),
        max: Math.round(currentMedian * 1.15),
        median: currentMedian,
      },
      potential: {
        min: Math.round(potentialMedian * 0.85),
        max: Math.round(potentialMedian * 1.2),
        median: potentialMedian,
      },
      currency: location.includes('Bangalore') || location.includes('India') ? 'INR' : 'USD',
      topCities: marketData.slice(0, 5).map((m) => ({
        city: m.location,
        median: m.medianSalary,
      })),
      topIndustries: [
        { industry: 'Technology', median: currentMedian },
        { industry: 'Fintech', median: Math.round(currentMedian * 1.1) },
        { industry: 'Healthcare Tech', median: Math.round(currentMedian * 1.05) },
        { industry: 'E-commerce', median: Math.round(currentMedian * 0.95) },
        { industry: 'AI/ML', median: Math.round(currentMedian * 1.25) },
      ],
    };

    await this.prisma.profile.upsert({
      where: { userId },
      update: { marketValue: currentMedian },
      create: { userId, marketValue: currentMedian },
    });

    return result;
  }
}
