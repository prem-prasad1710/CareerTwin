import { prisma } from '@careertwin/database';

export async function create(userId: string, type: string, title: string, data: Record<string, unknown>) {
  return prisma.shareCard.create({
    data: { userId, type, title, data: data as any },
  });
}

export async function get(shareUrl: string) {
  const card = await prisma.shareCard.findUnique({
    where: { shareUrl },
    include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
  });

  if (!card) throw new Error('Share card not found');

  await prisma.shareCard.update({
    where: { shareUrl },
    data: { views: { increment: 1 } },
  });

  return card;
}

export async function list(userId: string) {
  return prisma.shareCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
