import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'database';
import { UsersService } from '../users/users.service';
import { HashingService } from './hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const isPasswordCorrect = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordCorrect) return null;

    return user;
  }

  async login(user: User): Promise<string> {
    const now = await this.prismaService.getDatabaseNow();
    const payload = { sub: user.id, iat: Math.floor(now.getTime() / 1000) };
    return this.jwtService.sign(payload);
  }
}
