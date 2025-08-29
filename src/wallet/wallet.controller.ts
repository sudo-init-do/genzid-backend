import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UsersService } from '../users/users.service';
import { IsInt, Min } from 'class-validator';

class MockTopupDto {
  @IsInt()
  @Min(1)
  amount!: number;
}

@Controller('wallet')
export class WalletController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('topup/mock')
  async mockTopup(@GetUser() user: any, @Body() dto: MockTopupDto) {
    await this.users.mockTopup(user.id, dto.amount);
    const balance = await this.users.getWalletBalance(user.id);
    return { ok: true, balance };
  }
}
