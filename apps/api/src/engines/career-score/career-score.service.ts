import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CareerScoreBreakdown } from '@careertwin/shared';

@Injectable()
export class CareerScoreService {
  constructor(private prisma: PrismaService) {}

  async compute(userId: string): Promise<CareerScoreBreakdown> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: true,
        projects: true,
        interviewHistory: true,
        learningActivities: true,
        githubProfile: true,
      },
    });

    if (!user) throw new Error('User not found');

    const experience = Math.min(100, (user.profile?.yearsExperience || 0) * 12);
    const skills = user.skills.length > 0
      ? Math.min(100, Math.round(user.skills.reduce((s, sk) => s + sk.proficiency, 0) / user.skills.length))
      : 30;
    const projectQuality = user.projects.length > 0
      ? Math.min(100, Math.round(user.projects.reduce((s, p) => s + p.qualityScore, 0) / user.projects.length) || 60)
      : 40;
    const githubActivity = user.githubProfile
      ? Math.min(100, (user.githubProfile.contributions / 10) + user.githubProfile.engineeringScore * 0.5)
      : 25;
    const interviewPerformance = user.interviewHistory.length > 0
      ? Math.min(100, Math.round(
          (user.interviewHistory.filter((i) => i.outcome === 'PASSED').length / user.interviewHistory.length) * 100,
        ))
      : 50;
    const learningConsistency = user.learningActivities.length > 0
      ? Math.min(100, user.learningActivities.length * 8 + 20)
      : 30;

    const overall = Math.round(
      experience * 0.2 +
      skills * 0.25 +
      projectQuality * 0.15 +
      githubActivity * 0.1 +
      interviewPerformance * 0.15 +
      learningConsistency * 0.15,
    );

    const peerPercentile = Math.min(99, Math.round(overall * 0.85 + Math.random() * 15));

    await this.prisma.profile.upsert({
      where: { userId },
      update: { careerScore: overall },
      create: { userId, careerScore: overall },
    });

    return {
      overall,
      experience: Math.round(experience),
      skills: Math.round(skills),
      projectQuality: Math.round(projectQuality),
      githubActivity: Math.round(githubActivity),
      interviewPerformance: Math.round(interviewPerformance),
      learningConsistency: Math.round(learningConsistency),
      peerPercentile,
    };
  }
}
