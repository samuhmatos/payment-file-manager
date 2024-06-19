import { Test, TestingModule } from '@nestjs/testing';
import { AuditProcessor } from '../audit.processor';
import { createUploadProcessor } from '../__mocks__/audit-processor.mock';
import { PaymentService } from '../../payment/payment.service';

describe('AuditProcessor', () => {
  let processor: AuditProcessor;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditProcessor,
        {
          provide: PaymentService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get<AuditProcessor>(AuditProcessor);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('handleFileUpload', () => {
    it('should process the file and call paymentService.create', async () => {
      await processor.handleFileUpload(createUploadProcessor);

      expect(paymentService.create).toHaveBeenCalledWith(
        createUploadProcessor.data,
      );
    });
  });
});
