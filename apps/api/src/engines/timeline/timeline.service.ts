import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimelineEntry } from '@careertwin/shared';

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async predict(userId: string): Promise<{ primary: TimelineEntry[]; alternate: TimelineEntry[] }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, skills: true },
    });

    if (!user) throw new Error('User not found');

    const years = user.profile?.yearsExperience || 2;
    const currentYear = new Date().getFullYear();
    const currentRole = user.profile?.currentRole || 'Software Engineer';
    const salary = user.profile?.marketValue || 120000;

    const roleProgression = this.getRoleProgression(currentRole, years);

    const primary: TimelineEntry[] = roleProgression.map((entry, i) => ({
      year: currentYear + entry.yearsFromNow,
      role: entry.role,
      salary: Math.round(salary * Math.pow(1.12, entry.yearsFromNow)),
      confidence: Math.max(40, 90 - i * 12),
      isAlternate: false,
      scenario: 'primary',
    }));

    const alternate: TimelineEntry[] = [
      {
        year: currentYear + 2,
        role: 'Senior Engineer (Startup)',
        company: 'High-growth Startup',
        salary: Math.round(salary * 1.3),
        confidence: 65,
        isAlternate: true,
        scenario: 'startup_fast_track',
      },
      {
        year: currentYear + 4,
        role: 'Engineering Manager',
        company: 'Mid-size Tech Co',
        salary: Math.round(salary * 1.6),
        confidence: 55,
        isAlternate: true,
        scenario: 'management_track',
      },
      {
        year: currentYear + 6,
        role: 'Principal Engineer',
        company: 'FAANG',
        salary: Math.round(salary * 2.2),
        confidence: 40,
        isAlternate: true,
        scenario: 'ic_expert_track',
      },
    ];

    for (const entry of [...primary, ...alternate]) {
      await this.prisma.careerTimeline.upsert({
        where: { id: `${userId}-${entry.year}-${entry.scenario}` },
        update: entry as any,
        create: { userId, ...entry } as any,
      }).catch(() => {
        this.prisma.careerTimeline.create({ data: { userId, ...entry } as any });
      });
    }

    return { primary, alternate };
  }

  private getRoleProgression(currentRole: string, years: number) {
    const isJunior = currentRole.toLowerCase().includes('junior') || years < 2;
    const isMid = !isJunior && (years < 5 || currentRole.toLowerCase().includes('software engineer'));
    const isSenior = years >= 5 || currentRole.toLowerCase().includes('senior');

    if (isJunior) {
      return [
        { yearsFromNow: 0, role: 'SDE-1' },
        { yearsFromNow: 2, role: 'SDE-2' },
        { yearsFromNow: 4, role: 'Senior Engineer' },
        { yearsFromNow: 7, role: 'Staff Engineer' },
      ];
    }
    if (isMid) {
      return [
        { yearsFromNow: 0, role: 'SDE-2' },
        { yearsFromNow: 2, role: 'Senior Engineer' },
        { yearsFromNow: 5, role: 'Staff Engineer' },
        { yearsFromNow: 8, role: 'Principal Engineer' },
      ];
    }
    return [
      { yearsFromNow: 0, role: 'Senior Engineer' },
      { yearsFromNow: 3, role: 'Staff Engineer' },
      { yearsFromNow: 6, role: 'Principal Engineer' },
      { yearsFromNow: 10, role: 'Distinguished Engineer' },
    ];
  }
}
