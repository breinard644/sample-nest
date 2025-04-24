import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaConfig } from 'prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService, private prisma:PrismaService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
        passReqToCallback: true,
      });
      
  }


  validate(req: Request, payload: any) {
    const refreshToken = req.headers['authorization']?.replace('Bearer ', '').trim();
    return { ...payload, refreshToken };
  }
  // async validate(payload: any) {

  //   const user =await this.prisma.user.findUnique({
  //       where:{
  //           id:payload.sub,
  //       }
  //   })
  //   return user;
  // }


}
