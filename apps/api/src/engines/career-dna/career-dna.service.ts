import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CareerDna } from '@careertwin/shared';

@Injectable()
export class CareerDnaService {
  constructor(private prisma: PrismaService) {}

  async compute(userId: string): Promise<CareerDna & { strengths: string[]; weaknesses: string[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        projects: true,
        workExperiences: true,
        githubProfile: true,
        learningActivities: true,
      },
    });

    if (!user) throw new Error('User not found');

    const dna = this.calculateDna(user);
    const entries = Object.entries(dna) as [string, number][];
    const sorted = [...entries].sort((a, b) => b[1] - a[1]);

    const strengths = sorted.slice(0, 3).map(([k, v]) => `${this.formatDimension(k)}: ${v}`);
    const weaknesses = sorted.slice(-3).map(([k, v]) => `${this.formatDimension(k)}: ${v}`);

    await this.prisma.profile.upsert({
      where: { userId },
      update: { careerDna: dna as object },
      create: { userId, careerDna: dna as object },
    });

    return { ...dna, strengths, weaknesses };
  }

  private calculateDna(user: any): CareerDna {
    const skills = user.skills || [];
    const projects = user.projects || [];
    const experience = user.workExperiences || [];
    const github = user.githubProfile;
    const learning = user.learningActivities || [];
    const years = user.profile?.yearsExperience || 0;

    const getSkillScore = (categories: string[]) => {
      const relevant = skills.filter((s: any) =>
        categories.some((c) => s.skill.category.toLowerCase().includes(c.toLowerCase())),
      );
      if (relevant.length === 0) return 20 + years * 3;
      return Math.min(100, Math.round(
        relevant.reduce((sum: number, s: any) => sum + s.proficiency, 0) / relevant.length,
      ));
    };

    return {
      frontend: getSkillScore(['FRONTEND']),
      backend: getSkillScore(['BACKEND']),
      ai: getSkillScore(['AI_ML']),
      cloud: getSkillScore(['CLOUD']),
      devops: getSkillScore(['DEVOPS']),
      leadership: Math.min(100, 15 + years * 8 + (experience.length > 2 ? 15 : 0)),
      communication: Math.min(100, 40 + years * 5),
      productThinking: getSkillScore(['PRODUCT']),
      architecture: getSkillScore(['ARCHITECTURE']) + (projects.length > 3 ? 10 : 0),
      data: getSkillScore(['DATA']) + (github?.technicalDepthScore ? github.technicalDepthScore * 0.2 : 0),
    };
  }

  private formatDimension(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }
}
