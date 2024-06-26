import { Injectable, NotFoundException } from '@nestjs/common';
import { Audit, AuditRepository } from './entities/audit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditDto } from './dtos/create-audit.dto';
import { QueueService } from '../queue/queue.service';
import { ReturnPaymentDto } from '../payment/dtos/return-payment.dto';
import { json2csv } from 'json-2-csv';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepository: AuditRepository,

    private readonly queueService: QueueService,
  ) {}

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
