import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueEnum } from './enums/queue.enum';
import { Queue } from 'bull';
import { UploadJobData } from '../upload/upload.processor';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueEnum.FILE_UPLOAD)
    private readonly fileUploadQueue: Queue<UploadJobData>,
  ) {}

  async add(payload: UploadJobData) {
    return this.fileUploadQueue.add(payload);
  }
}
