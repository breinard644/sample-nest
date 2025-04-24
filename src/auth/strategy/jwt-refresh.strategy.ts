// jwt-refresh.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.['refresh_token'],
      ]),
      secretOrKey: process.env.REFRESH_JWT_SECRET || 'default_refresh_secret', // 👈 fallback
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    return payload; // Must contain `sub`, etc.
  }
}
