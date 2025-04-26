import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { TaskService } from './taskservice.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags()
@UseInterceptors(CacheInterceptor)
@Controller('taskservice')
export class TaskserviceController {
  constructor(private taskService: TaskService) {}
  @Get('start')
  start() {
    return this.taskService.startTask();
  }

  @Get('stop')
  stop() {
    return this.taskService.stopTask();
  }
}
