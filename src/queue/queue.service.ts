import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QueueEnum } from './enums/queue.enum';
import { Job, Queue } from 'bull';
import { UploadJobData } from '../audit/audit.processor';

export type JobStatus = {
  activeJobs: Job<UploadJobData>[];
  waitingJobs: Job<UploadJobData>[];
};

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueEnum.FILE_UPLOAD)
    private readonly fileUploadQueue: Queue<UploadJobData>,
  ) {}

  async add(payload: UploadJobData) {
    return this.fileUploadQueue.add(payload);
  }

  async getJobStatus(): Promise<JobStatus> {
    const activeJobs = await this.fileUploadQueue.getJobs(['active']);
    const waitingJobs = await this.fileUploadQueue.getJobs(['waiting']);

    return {
      activeJobs,
      waitingJobs,
    };
  }
}
