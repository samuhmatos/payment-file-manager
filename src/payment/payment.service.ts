import {
  BadRequestException,
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

  async paginate({ page, upload_id }: PaginatePaymentDto): Promise<Pagination> {
    if (!upload_id) {
      throw new BadRequestException('upload_id é obrigatório');
    }

    if (!page || Number.isNaN(page)) page = DEFAULT_PAGE;

    const skip = (page - 1) * DEFAULT_PER_PAGE;
    const { activeJobs, waitingJobs } = await this.queueService.getJobStatus();

    if (activeJobs.length > 0 || waitingJobs.length > 0) {
      const jobsWithSameUploadId = activeJobs
        .filter((job) => job.data.upload_id === upload_id)
        .concat(waitingJobs.filter((job) => job.data.upload_id === upload_id));

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
        upload_id,
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
    const payment = await this.paymentRepository.findOneBy({ id });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }

  async update(params: UpdatePaymentDto, id: number) {
    const payment = await this.findById(id);

    return this.paymentRepository.save({
      ...payment,
      ...params,
    });
  }

  async remove(id: number) {
    await this.findById(id);

    return this.paymentRepository.delete({
      id,
    });
  }
}
