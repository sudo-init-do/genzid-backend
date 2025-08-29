import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser() user: any) {
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@GetUser() user: any, @Body() dto: UpdateUserDto) {
    return this.users.updateCurrent(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet/balance')
  async balance(@GetUser() user: any) {
    const balance = await this.users.getWalletBalance(user.id);
    return { balance };
  }
}
