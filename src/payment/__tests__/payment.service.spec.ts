import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_PER_PAGE, PaymentService } from '../payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment, PaymentRepository } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { createPaymentMock, paymentMock } from '../__mocks__/payment.mock';
import { QueueService } from '../../queue/queue.service';
import { BadRequestException } from '@nestjs/common';
import {
  invalidPaginatePaymentMock,
  paginateFindAndCountMock,
  paginatePaymentMock,
  paginateResultMock,
} from '../__mocks__/paginate.mock';
import { uploadMock } from '../../upload/__mocks__/upload.mocks';
import { emptyJobsMock, jobsMock } from '../../queue/__mocks__/queue.mocks';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            save: jest.fn().mockResolvedValue([paymentMock]),
            findAndCount: jest.fn().mockResolvedValue(paginateFindAndCountMock),
          },
        },
        {
          provide: QueueService,
          useValue: {
            getJobStatus: jest.fn().mockResolvedValue(jobsMock),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<PaymentRepository>(
      getRepositoryToken(Payment),
    );
    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
    expect(queueService).toBeDefined();
  });

  it('should save the payments to the repository', async () => {
    const result = await service.create(createPaymentMock);

    expect(paymentRepository.save).toHaveBeenCalledWith(createPaymentMock);
    expect(result).toEqual([paymentMock]);
  });

  describe('paginate', () => {
    it('should throw BadRequestException if upload_id is not provided', async () => {
      await expect(
        service.paginate(invalidPaginatePaymentMock),
      ).rejects.toThrow(new BadRequestException('upload_id é obrigatório'));
    });

    it('should throw BadRequestException if there are active or waiting jobs with the same upload_id', async () => {
      await expect(service.paginate(paginatePaymentMock)).rejects.toThrow(
        new BadRequestException(
          'Os dados enviados ainda estão sendo processados!',
        ),
      );
    });

    it('should return paginated payments if no active or waiting jobs', async () => {
      jest.spyOn(queueService, 'getJobStatus').mockResolvedValue(emptyJobsMock);

      const result = await service.paginate(paginatePaymentMock);

      expect(result).toEqual(paginateResultMock);
      expect(paymentRepository.findAndCount).toHaveBeenCalledWith({
        take: DEFAULT_PER_PAGE,
        skip: 0,
        where: { upload_id: uploadMock.id },
      });
    });
  });
});
