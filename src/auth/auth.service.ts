import { Post, Param, Res, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

  async storeRefreshToken(userId: number, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
    const isValid = await argon.verify(user.refreshToken, rt);
    if (!isValid) throw new ForbiddenException('Invalid Refresh Token');

    const tokens = await this.signToken(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refresh_token);
    return { access_token: tokens.access_token , refresh_token: tokens.refresh_token,};
  }

  async signup(dto: AuthDto) {

    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name,
        },
      });
      const tokens = await this.signToken(user.id, user.email);
      await this.storeRefreshToken(user.id, tokens.refresh_token);
      return { access_token: tokens.access_token };

      // return this.signToken(user.id,user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials Taken',
          );
        }
      }
      throw error;
    }

  }

  async signin(email: string, password: string, name: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    if (!user) throw new ForbiddenException('User not found');
  
    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('Incorrect Password');
  
    const tokens = await this.signToken(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refresh_token);
  
    return tokens;
  }
  

  async signToken(userId: number, email: string): Promise<{ access_token: string, refresh_token: string; }> {

    const payload = {
      sub: userId,
      email
    }

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRE,
      secret: secret,
    })

    const refresh_secret = this.config.get('REFRESH_JWT_SECRET');

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: process.env.REFRESH_JWT_EXPIRE,
      secret: refresh_secret,
    })

    return {
      access_token: token,
      refresh_token: refreshToken,
    }
  }

}
