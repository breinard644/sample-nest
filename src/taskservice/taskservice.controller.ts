import { Controller, Get } from '@nestjs/common';
import { TaskService } from './taskservice.service';

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
