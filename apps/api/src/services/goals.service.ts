import { prisma } from '@careertwin/database';

export async function getGoals(userId: string) {
  return prisma.careerGoal.findMany({
    where: { userId },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createGoal(userId: string, data: {
  title: string;
  targetRole?: string;
  targetDate?: string;
  description?: string;
  progress?: number;
}) {
  return prisma.careerGoal.create({
    data: {
      userId,
      title: data.title,
      targetRole: data.targetRole || 'Not specified',
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      description: data.description,
      progress: data.progress ?? 0,
      status: 'ACTIVE',
    },
  });
}

export async function updateGoal(goalId: string, userId: string, data: {
  title?: string;
  targetRole?: string;
  targetDate?: string;
  description?: string;
  progress?: number;
  status?: string;
}) {
  return prisma.careerGoal.update({
    where: { id: goalId, userId },
    data: {
      title: data.title,
      targetRole: data.targetRole,
      description: data.description,
      progress: data.progress,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      status: data.status as any,
    },
  });
}

export async function deleteGoal(goalId: string, userId: string) {
  return prisma.careerGoal.delete({ where: { id: goalId, userId } });
}
