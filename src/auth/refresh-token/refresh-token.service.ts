// src/auth/refresh-token/refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenService {
  constructor(private jwtService: JwtService) {}

  async refresh(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_JWT_SECRET,
    });

    // you can also verify user existence here if needed

    
    const access_token = await this.jwtService.signAsync(
        { userId: payload.userId },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRE || '15m',
        }
      );
      
    const new_refresh_token = await this.jwtService.signAsync(
        { userId: payload.userId },
        {
          secret: process.env.REFRESH_JWT_SECRET,
          expiresIn: process.env.REFRESH_JWT_EXPIRE || '7d',
        }
      );
      
    return { access_token,
        refresh_token: new_refresh_token, };
  }
}

