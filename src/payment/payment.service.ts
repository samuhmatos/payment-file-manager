import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentRepository } from './entities/payment.entity';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaginatePaymentDto } from './dtos/paginate-payment.dto';
import { Pagination } from './dtos/return-paginate-payment.dto';
import { QueueService } from '../queue/queue.service';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { UploadJobData } from '../audit/audit.processor';
import { cpfUtil } from '../utils/cpf.util';
import { dateUtil } from '../utils/date.util';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 20;

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: PaymentRepository,

    private readonly queueService: QueueService,
  ) {}

  async create({ audit_id, fileContent }: UploadJobData) {
    const lines = fileContent.split('\r\n');

    let paymentPayload: CreatePaymentDto[] = [];
    const LIMIT = 4400;

    try {
      for (const line of lines) {
        if (line.trim()) {
          const name = line.slice(0, 15).trimStart().trimEnd();
          const age = Number(line.slice(15, 19));
          const address = line.slice(19, 53).trimStart().trimEnd();
          const cpf = cpfUtil.formatCpf(line.slice(53, 64));
          const total = Number(line.slice(64, 80));
          const birth_date = dateUtil.toDBFormat(line.slice(80, 88));

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
            await this.paymentRepository.save(paymentPayload);
            paymentPayload = [];
          }
        }
      }

      if (paymentPayload.length > 0) {
        await this.paymentRepository.save(paymentPayload);
      }
    } catch (error) {
      console.error('Error processing file upload: ', error);
      throw new BadRequestException(
        'Ocorreu um erro ao processar o arquivo. Verifique os dados e tente novamente.',
      );
    }
  }

  async paginate({ page, audit_id }: PaginatePaymentDto): Promise<Pagination> {
    if (!audit_id) {
      throw new BadRequestException('audit_id é obrigatório');
    }

    if (!page || Number.isNaN(page)) page = DEFAULT_PAGE;

    const skip = (page - 1) * DEFAULT_PER_PAGE;
    const { activeJobs, waitingJobs } = await this.queueService.getJobStatus();

    if (activeJobs.length > 0 || waitingJobs.length > 0) {
      const jobsWithSameUploadId = activeJobs
        .filter((job) => job.data.audit_id === audit_id)
        .concat(waitingJobs.filter((job) => job.data.audit_id === audit_id));

      if (jobsWithSameUploadId.length > 0) {
        throw new BadRequestException(
          'Os dados enviados ainda estão sendo processados!',
        );
      }
    }

    const [payments, count] = await this.paymentRepository.findAndCount({
      take: DEFAULT_PER_PAGE,
      skip,
      where: {
        audit_id,
      },
    });

    return new Pagination(
      {
        currentPage: page,
        itemsPerPage: DEFAULT_PER_PAGE,
        totalItems: count,
        totalPages: Math.ceil(count / DEFAULT_PER_PAGE),
      },
      payments,
    );
  }

  async findById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: { audit: true },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }

  async update(params: UpdatePaymentDto, id: number) {
    const payment = await this.findById(id);

    if (payment.audit.confirmed) {
      throw new ForbiddenException(
        'O pagamento não tem autorização para ser alterado!',
      );
    }

    return this.paymentRepository.save({
      ...payment,
      ...params,
    });
  }

  async remove(id: number) {
    const payment = await this.findById(id);

    if (payment.audit.confirmed) {
      throw new ForbiddenException(
        'O pagamento não tem autorização para ser alterado!',
      );
    }

    return this.paymentRepository.delete({
      id,
    });
  }
}
