import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bullmq';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { BooksModule } from './books/books.module';
import { TaskserviceModule } from './taskservice/taskservice.module';
import { QueueOptions } from 'bullmq';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    ConfigModule.forRoot({ 
      isGlobal: true,
     }), 
     BullModule.forRootAsync({
      useFactory: async () => ({
        connection: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
        },
      }),
    }),
    
    UserModule, 
    CacheModule.register({
    isGlobal: true,
    useFactory: async () => ({
      store: await redisStore({
        url: process.env.REDIS_URL,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      })
    })
  }), 
  BooksModule,
TaskserviceModule],
  controllers: [AppController, BooksController],
  providers: [AppService, BooksService],
})
export class AppModule { }
