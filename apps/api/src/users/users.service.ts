import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../engines/github/github.service';

export interface SyncUserDto {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  provider?: string;
  accessToken?: string;
  githubUsername?: string;
  githubUrl?: string;
  bio?: string;
  company?: string;
  location?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
  ) {}

  async syncUser(data: SyncUserDto) {
    let user = await this.prisma.user.findUnique({
      where: { clerkId: data.clerkId },
      include: { profile: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          clerkId: data.clerkId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: data.avatarUrl,
          profile: {
            create: {
              bio: data.bio,
              location: data.location,
              currentCompany: data.company,
              githubUrl: data.githubUrl,
              headline: data.bio?.slice(0, 120),
            },
          },
        },
        include: { profile: true },
      });
      await this.seedInitialData(user.id);
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: data.firstName || user.firstName,
          lastName: data.lastName || user.lastName,
          avatarUrl: data.avatarUrl || user.avatarUrl,
          profile: {
            update: {
              bio: data.bio || undefined,
              location: data.location || undefined,
              currentCompany: data.company || undefined,
              githubUrl: data.githubUrl || undefined,
            },
          },
        },
        include: { profile: true },
      });
    }

    if (data.githubUsername) {
      await this.importGitHubData(user.id, data.githubUsername, data.accessToken);
    }

    if (data.provider === 'google' && !data.githubUsername) {
      await this.importGoogleProfile(user.id, data);
    }

    return user;
  }

  async findOrCreate(clerkId: string, email: string, firstName?: string, lastName?: string) {
    return this.syncUser({ clerkId, email, firstName, lastName });
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        workExperiences: true,
        projects: true,
        education: true,
        careerGoals: true,
        githubProfile: true,
        linkedinProfile: true,
      },
    });
  }

  async updateProfile(userId: string, data: Record<string, unknown>) {
    return this.prisma.profile.update({
      where: { userId },
      data: data as any,
    });
  }

  private async importGitHubData(userId: string, username: string, accessToken?: string) {
    try {
      await this.githubService.analyze(userId, username, accessToken);
      const gh = await this.prisma.gitHubProfile.findUnique({ where: { userId } });
      if (gh?.languages) {
        const langs = gh.languages as Record<string, number>;
        const skills = await this.prisma.skill.findMany();
        for (const [lang, count] of Object.entries(langs)) {
          const match = skills.find((s) => s.name.toLowerCase() === lang.toLowerCase());
          if (match) {
            await this.prisma.userSkill.upsert({
              where: { userId_skillId: { userId, skillId: match.id } },
              update: { proficiency: Math.min(100, 50 + count * 5), source: 'github', verified: true },
              create: {
                userId,
                skillId: match.id,
                proficiency: Math.min(100, 50 + count * 5),
                source: 'github',
                verified: true,
              },
            });
          }
        }
      }
      await this.prisma.profile.update({
        where: { userId },
        data: { githubUrl: `https://github.com/${username}` },
      });
    } catch {
      // GitHub import is best-effort
    }
  }

  private async importGoogleProfile(userId: string, data: SyncUserDto) {
    await this.prisma.profile.update({
      where: { userId },
      data: {
        headline: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : undefined,
        location: data.location,
      },
    });
  }

  private async seedInitialData(userId: string) {
    const skills = await this.prisma.skill.findMany({ take: 8 });
    for (const skill of skills) {
      await this.prisma.userSkill.create({
        data: {
          userId,
          skillId: skill.id,
          proficiency: Math.floor(Math.random() * 30) + 40,
          yearsUsed: Math.random() * 2 + 0.5,
          source: 'onboarding',
        },
      });
    }

    await this.prisma.profile.update({
      where: { userId },
      data: {
        currentRole: 'Software Engineer',
        yearsExperience: 2,
        targetRole: 'Senior Software Engineer',
      },
    });

    await this.prisma.careerMemory.createMany({
      data: [
        {
          userId,
          type: 'LESSON',
          title: 'Welcome to CareerTwin',
          content: 'Your Career Twin is being built from your profile. Connect GitHub for richer insights.',
          tags: ['onboarding'],
          occurredAt: new Date(),
        },
      ],
    });
  }
}
