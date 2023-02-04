import { Req } from '@/typings/request';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UserDto, zodLoginDto, zodUserDto } from 'muuzika-zod';
import { ZodGuard } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(new ZodGuard('body', zodLoginDto), LocalAuthGuard)
  async login(@Request() req: Req) {
    return this.authService.login(req.user);
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoami(@Request() req: Req): UserDto {
    return zodUserDto.parse(req.user);
  }
}
