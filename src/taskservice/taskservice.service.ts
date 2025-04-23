import { Injectable, Logger } from '@nestjs/common';
import { Cron,CronExpression  } from '@nestjs/schedule';

@Injectable()
export class TaskserviceService {
    private readonly logger = new Logger(TaskserviceService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    // this.logger.debug('Called when the current second is 0');
    console.log('reminder for every 5 sec');
    
  }
}
