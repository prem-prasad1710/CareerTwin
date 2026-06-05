import { prisma } from '@careertwin/database';
import { generateEmbedding } from '../lib/ai';

type MemoryType =
  | 'PROJECT' | 'PROMOTION' | 'INTERVIEW' | 'ACHIEVEMENT'
  | 'CERTIFICATION' | 'FAILURE' | 'LESSON' | 'MILESTONE' | 'FEEDBACK';

export async function create(userId: string, data: {
  type: MemoryType;
  title: string;
  content: string;
  tags?: string[];
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}) {
  await generateEmbedding(`${data.title} ${data.content}`);

  return prisma.careerMemory.create({
    data: {
      userId,
      type: data.type,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      occurredAt: data.occurredAt,
      metadata: data.metadata as any,
    },
  });
}

export async function search(userId: string, query: string) {
  const memories = await prisma.careerMemory.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: query.split(' ') } },
      ],
    },
    orderBy: { occurredAt: 'desc' },
    take: 20,
  });

  if (memories.length === 0) {
    const all = await prisma.careerMemory.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: 10,
    });
    return { results: all, query, total: all.length };
  }

  return { results: memories, query, total: memories.length };
}

export async function getTimeline(userId: string) {
  return prisma.careerMemory.findMany({
    where: { userId },
    orderBy: { occurredAt: 'desc' },
  });
}
