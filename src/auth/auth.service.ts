import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {

        try {
            const hash = await argon.hash(dto.password); // don't forget await
    
            const user = await this.prisma.user.create({
              data: {
                email: dto.email,
                password: hash,
                name: dto.name, 
              },
            });
        
            return user;  
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

    signin(){
        return {msg : "sign in"}
    }
}
