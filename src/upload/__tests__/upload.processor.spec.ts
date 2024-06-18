import { Test, TestingModule } from '@nestjs/testing';
import { UploadProcessor } from '../upload.processor';
import { PaymentService } from '../../payment/payment.service';
import {
  createPaymentMock,
  paymentMock,
} from '../../payment/__mocks__/payment.mock';
import { createUploadProcessor } from '../__mocks__/upload-processor.mock';

describe('UploadProcessor', () => {
  let processor: UploadProcessor;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadProcessor,
        {
          provide: PaymentService,
          useValue: {
            create: jest.fn().mockResolvedValue([paymentMock]),
          },
        },
      ],
    }).compile();

    processor = module.get<UploadProcessor>(UploadProcessor);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('handleFileUpload', () => {
    it('should process the file and call paymentService.create', async () => {
      await processor.handleFileUpload(createUploadProcessor);

      expect(paymentService.create).toHaveBeenCalledWith(createPaymentMock);
    });
  });
});
