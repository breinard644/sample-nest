import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { TaskService } from './taskservice.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/guard';

@ApiBearerAuth('access-token')
@ApiTags()
@UseInterceptors(CacheInterceptor)
@UseGuards(jwtGuard)
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
