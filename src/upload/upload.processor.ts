import { Process, Processor } from '@nestjs/bull';
import { PaymentService } from '../payment/payment.service';
import { Job } from 'bull';
import { CreatePaymentDto } from '../payment/dtos/create-payment.dto';
import { QueueEnum } from '../queue/enums/queue.enum';

export type UploadJobData = { fileContent: string; upload_id: number };

@Processor(QueueEnum.FILE_UPLOAD)
export class UploadProcessor {
  constructor(private readonly paymentService: PaymentService) {}

  @Process()
  async handleFileUpload(job: Job<UploadJobData>) {
    const { fileContent, upload_id } = job.data;

    const lines = fileContent.split('\r\n');

    let paymentPayload: CreatePaymentDto[] = [];
    const LIMIT = 4400;

    console.time();

    try {
      for (const line of lines) {
        if (line.trim()) {
          const name = line.slice(0, 15).trimStart().trimEnd();
          const age = Number(line.slice(15, 19));
          const address = line.slice(19, 53).trimStart().trimEnd();
          const cpf = line.slice(53, 64);
          const total = Number(line.slice(64, 80));
          const birth_date = line.slice(80, 88).trimStart().trimEnd();

          paymentPayload.push({
            name,
            age,
            address,
            cpf,
            total,
            birth_date,
            upload_id,
          });

          if (paymentPayload.length === LIMIT) {
            await this.paymentService.create(paymentPayload);
            paymentPayload = [];
          }
        }
      }

      if (paymentPayload.length > 0) {
        await this.paymentService.create(paymentPayload);
      }
    } catch (error) {
      console.error('Error processing file upload: ', error);
      throw error;
    } finally {
      console.timeEnd();
    }
  }
}
