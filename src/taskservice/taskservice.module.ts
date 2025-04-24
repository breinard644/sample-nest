import { forwardRef, Module } from '@nestjs/common';
import { TaskserviceController } from './taskservice.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './taskservice.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TaskserviceController],
  providers: [TaskService],
  imports:[ScheduleModule.forRoot(),forwardRef(() => AuthModule)]
})
export class TaskserviceModule {}
