import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokensProvider {
    constructor(private jwtService: JwtService) { }

    async refresh(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
        
        // const payload = await this.jwtService.verifyAsync(refreshToken, {
        //   secret: process.env.REFRESH_JWT_SECRET,
        // });


        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESH_JWT_SECRET,
            });

            // you can also verify user existence here if needed

            const access_token = await this.jwtService.signAsync(
                { userId: payload.sub },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: process.env.JWT_EXPIRE || '60',
                }
            );

            const new_refresh_token = await this.jwtService.signAsync(
                { userId: payload.sub },
                {
                    secret: process.env.REFRESH_JWT_SECRET,
                    expiresIn: process.env.REFRESH_JWT_EXPIRE || '86400',
                }
            );

            return {
                access_token,
                refresh_token: new_refresh_token,
            };
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Refresh token has expired');
            }
            throw new UnauthorizedException('Invalid refresh token');
        }


    }
}
