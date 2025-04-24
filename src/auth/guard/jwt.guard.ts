import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service'; // Adjust path if necessary
import { ExecutionContext } from '@nestjs/common';
import { error } from 'console';

@Injectable()
export class jwtGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService
  ) {
    super();
  }

  // Ignore the TS signature
  override handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        const refreshToken = req.cookies?.['refresh_token'];
        if (!refreshToken) throw new UnauthorizedException('Refresh token missing1');

        return this.refreshTokenService.refresh(refreshToken).then((newTokens) => {
          const newPayload = this.jwtService.verify(newTokens.access_token, {
            secret: process.env.JWT_SECRET,
          });

          res.cookie('refresh_token', newTokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          req.user = newPayload;
          return newPayload;
        }).catch(() => {
          console.error('❌ Failed to refresh token:', error);
          throw new UnauthorizedException('Could not refresh token');
        });
      }

      throw err || new UnauthorizedException();
    }

    return user;
  }
}
