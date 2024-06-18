import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { createPaymentMock, paymentMock } from '../__mocks__/payment.mock';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            save: jest.fn().mockResolvedValue([paymentMock]),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  it('should save the payments to the repository', async () => {
    const result = await service.create(createPaymentMock);

    expect(paymentRepository.save).toHaveBeenCalledWith(createPaymentMock);
    expect(result).toEqual([paymentMock]);
  });
});
