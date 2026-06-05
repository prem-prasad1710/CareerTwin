import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JobMatch } from '@careertwin/shared';

const SAMPLE_JOBS = [
  { company: 'Google', role: 'Senior Software Engineer', location: 'Mountain View, CA', salary: { min: 200000, max: 350000 }, requiredSkills: ['Algorithms', 'System Design', 'TypeScript'] },
  { company: 'Stripe', role: 'Full Stack Engineer', location: 'San Francisco, CA', salary: { min: 180000, max: 280000 }, requiredSkills: ['React', 'Node.js', 'PostgreSQL'] },
  { company: 'Razorpay', role: 'Senior Backend Engineer', location: 'Bangalore, India', salary: { min: 3500000, max: 5500000 }, requiredSkills: ['Node.js', 'System Design', 'PostgreSQL'] },
  { company: 'Vercel', role: 'Frontend Engineer', location: 'Remote', salary: { min: 150000, max: 220000 }, requiredSkills: ['React', 'Next.js', 'TypeScript'] },
  { company: 'OpenAI', role: 'ML Engineer', location: 'San Francisco, CA', salary: { min: 250000, max: 400000 }, requiredSkills: ['Machine Learning', 'Python', 'System Design'] },
  { company: 'Paytm', role: 'Software Engineer', location: 'Noida, India', salary: { min: 2000000, max: 3500000 }, requiredSkills: ['React', 'Node.js', 'PostgreSQL'] },
];

@Injectable()
export class JobMatchService {
  constructor(private prisma: PrismaService) {}

  async match(userId: string): Promise<JobMatch[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
      },
    });

    if (!user) throw new Error('User not found');

    const skillMap = new Map(user.skills.map((s) => [s.skill.name, s.proficiency]));
    const marketValue = user.profile?.marketValue || 120000;

    return SAMPLE_JOBS.map((job) => {
      const matched = job.requiredSkills.filter((s) => (skillMap.get(s) || 0) >= 50);
      const missing = job.requiredSkills.filter((s) => (skillMap.get(s) || 0) < 50);
      const skillScore = (matched.length / job.requiredSkills.length) * 60;
      const salaryFit = marketValue >= job.salary.min && marketValue <= job.salary.max * 1.2 ? 25 : 10;
      const experienceBonus = Math.min(15, (user.profile?.yearsExperience || 0) * 3);

      const matchScore = Math.round(skillScore + salaryFit + experienceBonus);
      const successProbability = Math.round(matchScore * 0.85);

      return {
        company: job.company,
        role: job.role,
        location: job.location,
        salary: job.salary,
        matchScore: Math.min(100, matchScore),
        missingSkills: missing,
        strengths: matched,
        successProbability: Math.min(95, successProbability),
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
}
