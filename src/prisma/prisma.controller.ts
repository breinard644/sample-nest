import { Controller } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller('prisma')
export class PrismaController extends PrismaClient{
    constructor (){
        super({
            datasources:{
                db: {
                    url : 'postgresql://postgres:root@localhost:5432/mydb?schema=public'
                }
            }
        })
    }
}
