import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../../ai/ai.service';
import { MemoryType } from '@careertwin/database';

@Injectable()
export class MemoryService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async create(userId: string, data: {
    type: MemoryType;
    title: string;
    content: string;
    tags?: string[];
    occurredAt: Date;
    metadata?: Record<string, unknown>;
  }) {
    const embedding = await this.ai.generateEmbedding(`${data.title} ${data.content}`);

    return this.prisma.careerMemory.create({
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

  async search(userId: string, query: string) {
    const memories = await this.prisma.careerMemory.findMany({
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
      const all = await this.prisma.careerMemory.findMany({
        where: { userId },
        orderBy: { occurredAt: 'desc' },
        take: 10,
      });
      return { results: all, query, total: all.length };
    }

    return { results: memories, query, total: memories.length };
  }

  async getTimeline(userId: string) {
    return this.prisma.careerMemory.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
    });
  }
}
