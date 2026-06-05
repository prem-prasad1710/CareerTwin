import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LinkedinService {
  constructor(private prisma: PrismaService) {}

  async analyze(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        workExperiences: true,
        linkedinProfile: true,
        skills: true,
        achievements: true,
      },
    });

    if (!user) throw new Error('User not found');

    const hasProfile = !!user.profile?.linkedinUrl;
    const experienceCount = user.workExperiences.length;
    const skillCount = user.skills.length;
    const achievementCount = user.achievements.length;
    const hasHeadline = !!user.profile?.headline;
    const hasBio = !!user.profile?.bio;

    const personalBrandScore = Math.min(100,
      (hasHeadline ? 25 : 0) +
      (hasBio ? 20 : 0) +
      (experienceCount * 8) +
      (achievementCount * 5) +
      (hasProfile ? 15 : 0),
    );

    const networkingScore = Math.min(100,
      (hasProfile ? 30 : 10) +
      experienceCount * 10 +
      skillCount * 2,
    );

    const visibilityScore = Math.min(100,
      personalBrandScore * 0.4 +
      networkingScore * 0.3 +
      (achievementCount * 8) +
      (hasBio ? 15 : 0),
    );

    return this.prisma.linkedinProfile.upsert({
      where: { userId },
      update: {
        profileUrl: user.profile?.linkedinUrl,
        personalBrandScore: Math.round(personalBrandScore),
        networkingScore: Math.round(networkingScore),
        visibilityScore: Math.round(visibilityScore),
        lastSynced: new Date(),
      },
      create: {
        userId,
        profileUrl: user.profile?.linkedinUrl,
        personalBrandScore: Math.round(personalBrandScore),
        networkingScore: Math.round(networkingScore),
        visibilityScore: Math.round(visibilityScore),
        lastSynced: new Date(),
      },
    });
  }
}
