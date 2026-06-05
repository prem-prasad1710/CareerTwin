import { prisma } from '@careertwin/database';
import { SimulationInput, SimulationResult } from '@careertwin/shared';

const SCENARIO_IMPACTS: Record<string, Partial<SimulationResult>> = {
  'learn ai': { salaryImpact: 25, promotionProbability: 15, interviewSuccessProbability: 20, careerGrowthImpact: 30 },
  'learn system design': { salaryImpact: 21, promotionProbability: 25, interviewSuccessProbability: 30, careerGrowthImpact: 22 },
  'switch to backend': { salaryImpact: 10, promotionProbability: 5, interviewSuccessProbability: -10, careerGrowthImpact: 15 },
  'move to bangalore': { salaryImpact: -15, promotionProbability: 10, interviewSuccessProbability: 5, careerGrowthImpact: 20 },
  'open source': { salaryImpact: 8, promotionProbability: 12, interviewSuccessProbability: 15, careerGrowthImpact: 18 },
  'leadership': { salaryImpact: 18, promotionProbability: 30, interviewSuccessProbability: 10, careerGrowthImpact: 25 },
};

export async function simulate(userId: string, input: SimulationInput): Promise<SimulationResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true, salaryHistory: { orderBy: { recordedAt: 'desc' }, take: 1 } },
  });

  if (!user) throw new Error('User not found');

  const scenarioKey = input.scenario.toLowerCase();
  const matchedImpact = Object.entries(SCENARIO_IMPACTS).find(([key]) =>
    scenarioKey.includes(key),
  );

  const base = matchedImpact?.[1] || {
    salaryImpact: 12,
    promotionProbability: 10,
    interviewSuccessProbability: 8,
    careerGrowthImpact: 15,
  };

  const durationMonths = parseInt(input.duration || '6') || 6;
  const currentSalary = user.profile?.marketValue || user.salaryHistory[0]?.amount || 120000;

  const result: SimulationResult = {
    scenario: input.scenario,
    salaryImpact: base.salaryImpact!,
    promotionProbability: base.promotionProbability!,
    interviewSuccessProbability: base.interviewSuccessProbability!,
    careerGrowthImpact: base.careerGrowthImpact!,
    timeline: Array.from({ length: Math.min(durationMonths, 12) }, (_, i) => ({
      month: i + 1,
      role: user.profile?.currentRole || 'Software Engineer',
      salary: Math.round(currentSalary * (1 + (base.salaryImpact! / 100) * ((i + 1) / durationMonths))),
    })),
    insights: [
      `Completing "${input.scenario}" over ${durationMonths} months could increase salary by ${base.salaryImpact}%`,
      `Promotion probability improves by ${base.promotionProbability} percentage points`,
      `Interview success rate projected to increase by ${base.interviewSuccessProbability}%`,
      input.location ? `Relocation to ${input.location} may shift market dynamics` : 'Current location market remains favorable',
    ],
  };

  await prisma.careerSimulation.create({
    data: {
      userId,
      scenario: input.scenario,
      description: input.duration ? `Duration: ${input.duration}` : undefined,
      inputs: input as any,
      results: result as any,
      salaryImpact: result.salaryImpact,
      promotionProbability: result.promotionProbability,
      interviewSuccessProbability: result.interviewSuccessProbability,
      careerGrowthImpact: result.careerGrowthImpact,
    },
  });

  return result;
}

export async function getHistory(userId: string) {
  return prisma.careerSimulation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
}
