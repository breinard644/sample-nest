import { Module } from '@nestjs/common';
import { TaskserviceController } from './taskservice.controller';
import { TaskserviceService } from './taskservice.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [TaskserviceController],
  providers: [TaskserviceService],
  imports:[ScheduleModule.forRoot()]
})
export class TaskserviceModule {}
