import { Injectable, NotFoundException } from '@nestjs/common';
import { Audit, AuditRepository } from './entities/audit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditDto } from './dtos/create-audit.dto';
import { QueueService } from '../queue/queue.service';
import { UploadJobData } from './audit.processor';
import { CreatePaymentDto } from '../payment/dtos/create-payment.dto';
import { PaymentService } from '../payment/payment.service';
import { ReturnPaymentDto } from 'src/payment/dtos/return-payment.dto';
import { json2csv } from 'json-2-csv';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: AuditRepository,

    private readonly queueService: QueueService,
    private readonly paymentService: PaymentService,
  ) {}

  async uploadFile({ audit_id, fileContent }: UploadJobData) {
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
            audit_id,
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

  async create({ file }: CreateAuditDto) {
    const fileContent = file.buffer
      .toString('utf-8')
      .replace(/[\uFFFD\u0000]/g, '');

    const audit = await this.auditRepository.save({});

    await this.queueService.add({
      fileContent,
      audit_id: audit.id,
    });

    return { message: 'Os dados estão sendo processados!' };
  }

  async confirm(id: number) {
    const audit = await this.findById(id);
    return this.auditRepository.save({
      ...audit,
      confirmed: true,
    });
  }

  async findById(id: number, isRelation = false) {
    const audit = await this.auditRepository.findOne({
      where: { id },
      relations: {
        payments: isRelation,
      },
    });

    if (!audit) {
      throw new NotFoundException('Auditoria não encontrada');
    }

    return audit;
  }

  async exportToCsv(id: number) {
    const audit = await this.findById(id, true);

    const payments = audit.payments.map(
      (payment) => new ReturnPaymentDto(payment),
    );

    const csv = json2csv(payments);

    return csv;
  }
}
