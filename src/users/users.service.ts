import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({ data });
    await this.prisma.wallet.create({ data: { userId: user.id } });
    return user;
  }

  async updateCurrent(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async getWalletBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    return wallet?.balance ?? 0;
  }

  async mockTopup(userId: string, amount: number) {
    return this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });
  }

  // Admin helper (optional usage)
  async grantAdmin(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { role: Role.ADMIN } });
  }
}
