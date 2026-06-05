import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InterviewPrediction } from '@careertwin/shared';

const COMPANY_REQUIREMENTS: Record<string, { minScore: number; keySkills: string[]; tier: number }> = {
  Google: { minScore: 85, keySkills: ['Algorithms', 'System Design', 'Data Structures'], tier: 1 },
  Microsoft: { minScore: 75, keySkills: ['System Design', 'TypeScript', 'Algorithms'], tier: 1 },
  Amazon: { minScore: 70, keySkills: ['System Design', 'Data Structures', 'Leadership'], tier: 1 },
  Paytm: { minScore: 55, keySkills: ['React', 'Node.js', 'System Design'], tier: 2 },
  Razorpay: { minScore: 60, keySkills: ['System Design', 'Node.js', 'PostgreSQL'], tier: 2 },
};

@Injectable()
export class InterviewService {
  constructor(private prisma: PrismaService) {}

  async predict(userId: string): Promise<InterviewPrediction[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true } },
        interviewHistory: true,
        githubProfile: true,
      },
    });

    if (!user) throw new Error('User not found');

    const careerScore = user.profile?.careerScore || 50;
    const skillMap = new Map<string, number>(
      user.skills.map((s) => [s.skill.name, s.proficiency]),
    );
    const passedRate = user.interviewHistory.length > 0
      ? user.interviewHistory.filter((i) => i.outcome === 'PASSED').length / user.interviewHistory.length
      : 0.5;

    return Object.entries(COMPANY_REQUIREMENTS).map(([company, req]) => {
      const matchedSkills = req.keySkills.filter((s) => (skillMap.get(s) || 0) >= 60);
      const missingSkills = req.keySkills.filter((s) => (skillMap.get(s) || 0) < 60);
      const skillMatch = matchedSkills.length / req.keySkills.length;

      let probability = Math.round(
        (careerScore / 100) * 40 +
        skillMatch * 35 +
        passedRate * 25,
      );

      if (req.tier === 1) probability = Math.round(probability * 0.7);
      probability = Math.min(95, Math.max(5, probability));

      return {
        company,
        probability,
        reasoning: this.generateReasoning(company, probability, matchedSkills, missingSkills),
        missingSkills,
        strengths: matchedSkills,
      };
    }).sort((a, b) => b.probability - a.probability);
  }

  private generateReasoning(
    company: string,
    probability: number,
    strengths: string[],
    gaps: string[],
  ): string {
    if (probability >= 70) {
      return `Strong match for ${company}. Your skills in ${strengths.join(', ')} align well with their requirements.`;
    }
    if (probability >= 40) {
      return `Moderate chance at ${company}. Strengthen ${gaps.join(', ')} to significantly improve odds.`;
    }
    return `Challenging but achievable at ${company}. Focus on ${gaps.join(', ')} and build 2-3 months of targeted preparation.`;
  }
}
