import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { QueueEnum } from './enums/queue.enum';

@Module({
  providers: [QueueService],
  exports: [QueueService],
  imports: [
    BullModule.registerQueue({
      name: QueueEnum.FILE_UPLOAD,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    }),
  ],
})
export class QueueModule {}
