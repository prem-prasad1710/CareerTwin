import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
import { ChatMessage, AI_AGENTS } from '@careertwin/shared';

@Injectable()
export class CoachService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async chat(
    userId: string,
    messages: ChatMessage[],
    agentType: string = 'CAREER_COACH',
  ): Promise<{ response: string; agent: string }> {
    const context = await this.buildContext(userId);
    const agent = AI_AGENTS.find((a) => a.type === agentType) || AI_AGENTS[0];

    const systemPrompt = `${agent.systemPrompt}

You have complete access to this user's Career Twin:

${context}

Provide specific, actionable advice based on their actual data. Be encouraging but honest. Use numbers and specifics from their profile.`;

    const response = await this.ai.complete(messages, {
      systemPrompt,
      temperature: 0.7,
      maxTokens: 1500,
    });

    await this.prisma.aIRecommendation.create({
      data: {
        userId,
        agent: agentType as any,
        type: 'chat_response',
        title: `Chat with ${agent.name}`,
        content: response,
        priority: 1,
      },
    });

    return { response, agent: agent.name };
  }

  async getAgents() {
    return AI_AGENTS;
  }

  private async buildContext(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { include: { skill: true }, take: 15 },
        workExperiences: { take: 5 },
        projects: { take: 5 },
        careerGoals: { where: { status: 'ACTIVE' } },
        interviewHistory: { take: 5, orderBy: { date: 'desc' } },
        learningActivities: { take: 5, orderBy: { updatedAt: 'desc' } },
        achievements: { take: 5 },
      },
    });

    if (!user) return 'No profile data available.';

    const lines = [
      `Name: ${user.firstName} ${user.lastName}`,
      `Role: ${user.profile?.currentRole || 'Not set'} at ${user.profile?.currentCompany || 'Not set'}`,
      `Experience: ${user.profile?.yearsExperience || 0} years`,
      `Career Score: ${user.profile?.careerScore || 0}/100`,
      `Market Value: $${user.profile?.marketValue?.toLocaleString() || 'Not calculated'}`,
      `Target Role: ${user.profile?.targetRole || 'Not set'}`,
      `Top Skills: ${user.skills.map((s) => `${s.skill.name}(${s.proficiency})`).join(', ')}`,
      `Active Goals: ${user.careerGoals.map((g) => g.title).join(', ') || 'None'}`,
      `Recent Interviews: ${user.interviewHistory.map((i) => `${i.company}(${i.outcome})`).join(', ') || 'None'}`,
      `Learning: ${user.learningActivities.map((l) => l.title).join(', ') || 'None'}`,
    ];

    return lines.join('\n');
  }
}
