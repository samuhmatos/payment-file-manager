import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueEnum } from '../queue/enums/queue.enum';
import { PaymentService } from '../payment/payment.service';

export type UploadJobData = {
  fileContent: string;
  audit_id: number;
};

@Processor(QueueEnum.FILE_UPLOAD)
export class AuditProcessor {
  constructor(private readonly paymentService: PaymentService) {}

  @Process()
  async handleFileUpload(job: Job<UploadJobData>) {
    return await this.paymentService.create(job.data);
  }
}
