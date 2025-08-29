import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { AssignBadgeDto } from './dto/assign-badge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badges: BadgesService) {}

  @Get()
  list() {
    return this.badges.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateBadgeDto) {
    return this.badges.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':slug/assign')
  assign(@Param('slug') slug: string, @Body() dto: AssignBadgeDto) {
    return this.badges.assignBySlug(slug, dto.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  myBadges(@GetUser() user: any) {
    return this.badges.listForUser(user.id);
  }
}
