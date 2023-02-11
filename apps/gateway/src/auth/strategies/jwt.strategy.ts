import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: FastifyRequest) => {
        const tokenFromBearer = ExtractJwt.fromAuthHeaderAsBearerToken()(
          req as any,
        );
        if (tokenFromBearer) return tokenFromBearer;
        return req.cookies['accessToken'];
      },
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
