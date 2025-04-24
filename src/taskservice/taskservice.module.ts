import { Module } from '@nestjs/common';
import { TaskserviceController } from './taskservice.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './taskservice.service';

@Module({
  controllers: [TaskserviceController],
  providers: [TaskService],
  imports:[ScheduleModule.forRoot()]
})
export class TaskserviceModule {}
