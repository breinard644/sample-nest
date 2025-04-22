import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService ,private jwt: JwtService ,private config :ConfigService) {}
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
        
            return this.signToken(user.id,user.email);
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials Taken',
                    );
                }
            }
            throw error;
        }
        
      }

      async signin(email: string, password: string, name: string) {
        const user = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
      
        if (!user) {
          throw new ForbiddenException('Credentials Incorrect');
        }
      
        const pwMatches = await argon.verify(user.password, password);
      
        if (!pwMatches) {
          throw new ForbiddenException('Incorrect Credentials');
        }
      
        // Optional: check name match if needed
        // if (user.name !== name) {
        //   throw new ForbiddenException('Name does not match');
        // }
      
        return this.signToken(user.id, user.email);
      }
      

    async signToken(userId:number ,email:string): Promise<{access_token :string}>{
        
        const payload ={
            sub : userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload,{
            expiresIn : '15m',
            secret : secret,
        })

        return {
            access_token : token,    
        }
    }
}
