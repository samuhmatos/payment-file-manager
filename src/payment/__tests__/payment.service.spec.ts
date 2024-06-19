import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_PER_PAGE, PaymentService } from '../payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment, PaymentRepository } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import {
  createPaymentMock,
  paymentMock,
  updatePaymentMock,
} from '../__mocks__/payment.mock';
import { QueueService } from '../../queue/queue.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  invalidPaginatePaymentMock,
  paginateFindAndCountMock,
  paginatePaymentMock,
  paginateResultMock,
} from '../__mocks__/paginate.mock';
import { uploadMock } from '../../upload/__mocks__/upload.mocks';
import { emptyJobsMock, jobsMock } from '../../queue/__mocks__/queue.mocks';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';

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
            findOneBy: jest.fn().mockResolvedValue(paymentMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
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

  describe('findById', () => {
    it('should return payment', async () => {
      const payment = await service.findById(paymentMock.id);

      expect(payment).toEqual(paymentMock);
    });

    it('should return exception if payment id is not found', async () => {
      jest.spyOn(paymentRepository, 'findOneBy').mockResolvedValue(undefined);

      expect(service.findById(paymentMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update the payment', async () => {
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(paymentMock);

      const payment = await service.update(
        updatePaymentMock,
        paymentMock.upload_id,
      );

      expect(payment).toEqual(paymentMock);
    });

    it('should throw exception if payment id not found', async () => {
      jest.spyOn(paymentRepository, 'findOneBy').mockResolvedValue(undefined);

      expect(
        service.update(updatePaymentMock, paymentMock.upload_id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove', async () => {
      const deleted = await service.remove(paymentMock.id);

      expect(deleted).toEqual(returnDeleteMock);
    });

    it('should throw exception if payment id not found', async () => {
      jest.spyOn(paymentRepository, 'findOneBy').mockResolvedValue(undefined);

      expect(service.remove(paymentMock.upload_id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
