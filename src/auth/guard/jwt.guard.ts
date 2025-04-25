import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensProvider } from '../provider/refresh-tokens.provider';

@Injectable()
export class jwtGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private refreshTokensProvider: RefreshTokensProvider,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    try {
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (err) {
      const info = err?.response;

      if (err?.name === 'TokenExpiredError') {
        const refreshToken = req.cookies?.['refresh_token'];
        if (!refreshToken) {
          throw new UnauthorizedException('Refresh token missing');
        }

        try {
          const newTokens = await this.refreshTokensProvider.refresh(refreshToken);

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
          return true;
        } catch (refreshErr) {
          console.error('❌ Failed to refresh token:', refreshErr);
          throw new UnauthorizedException('Could not refresh token');
        }
      }

      throw new UnauthorizedException();
    }
  }

  handleRequest(err: any, user: any) {
    // We won't do anything here since we handle everything in canActivate
    if (err || !user) throw err || new UnauthorizedException();
    return user;
  }
}
