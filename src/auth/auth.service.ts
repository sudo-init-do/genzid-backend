import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async signup(email: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.users.create({ email, passwordHash });
    const token = await this.signToken(user.id, user.email, user.role);
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.signToken(user.id, user.email, user.role);
    return { token, user };
  }

  private async signToken(userId: string, email: string, role?: string) {
    return this.jwt.signAsync({ sub: userId, email, role });
  }
}
