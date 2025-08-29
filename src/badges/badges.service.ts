import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.badge.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateBadgeDto) {
    try {
      return await this.prisma.badge.create({
        data: { name: dto.name, slug: dto.slug.toLowerCase(), description: dto.description },
      });
    } catch {
      throw new BadRequestException('Badge slug already exists');
    }
  }

  async assignBySlug(slug: string, userId: string) {
    const badge = await this.prisma.badge.findUnique({ where: { slug: slug.toLowerCase() } });
    if (!badge) throw new NotFoundException('Badge not found');

    await this.prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      create: { userId, badgeId: badge.id },
      update: {},
    });

    return { ok: true, badge: { id: badge.id, slug: badge.slug, name: badge.name} };
  }

  async listForUser(userId: string) {
    const links = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' },
    });
    return links.map(l => l.badge);
  }
}
