import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ShareService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, type: string, title: string, data: Record<string, unknown>) {
    return this.prisma.shareCard.create({
      data: { userId, type, title, data: data as any },
    });
  }

  async get(shareUrl: string) {
    const card = await this.prisma.shareCard.findUnique({
      where: { shareUrl },
      include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
    });

    if (!card) throw new Error('Share card not found');

    await this.prisma.shareCard.update({
      where: { shareUrl },
      data: { views: { increment: 1 } },
    });

    return card;
  }

  async list(userId: string) {
    return this.prisma.shareCard.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
