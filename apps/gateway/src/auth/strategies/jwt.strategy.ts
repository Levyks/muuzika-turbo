import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const id = payload.sub;
    const iat = payload.iat;

    if (!id || typeof id !== 'string' || !iat || typeof iat !== 'number')
      throw new UnauthorizedException('Invalid token');

    const user = await this.usersService.findById(id);

    if (!user) throw new UnauthorizedException('Invalid token');

    if (user.lastTokenInvalidation.getTime() > iat * 1000)
      throw new UnauthorizedException('Invalid token');

    return user;
  }
}
