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

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 20;

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: PaymentRepository,

    private readonly queueService: QueueService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto[]) {
    return this.paymentRepository.save(createPaymentDto);
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
