import { Request } from '@/typings/request';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyReply } from 'fastify';
import { UserDto, zodLoginDto, zodUserDto } from 'muuzika-zod';
import { ZodGuard } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(new ZodGuard('body', zodLoginDto), LocalAuthGuard)
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const accessToken = await this.authService.login(req.user);

    res.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });

    return { accessToken, user: req.user };
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  whoami(@Req() req: Request): UserDto {
    return zodUserDto.parse(req.user);
  }
}
