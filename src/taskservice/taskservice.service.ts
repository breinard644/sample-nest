import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  private isActive = false; 

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    if (!this.isActive) return;

    this.logger.log('Running scheduled task...');
    // Your real logic goes here
  }

  startTask() {
    if (this.isActive) return 'Task is already running.';
    this.isActive = true;
    return 'Task started.';
  }

  stopTask() {
    if (!this.isActive) return 'Task is already stopped.';
    this.isActive = false;
    return 'Task stopped.';
  }
}
