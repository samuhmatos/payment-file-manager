import { Test, TestingModule } from '@nestjs/testing';
import { AuditProcessor } from '../audit.processor';
import { createUploadProcessor } from '../__mocks__/audit-processor.mock';
import { AuditService } from '../audit.service';

describe('AuditProcessor', () => {
  let processor: AuditProcessor;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditProcessor,
        {
          provide: AuditService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get<AuditProcessor>(AuditProcessor);
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
    expect(auditService).toBeDefined();
  });

  describe('handleFileUpload', () => {
    it('should process the file and call paymentService.create', async () => {
      await processor.handleFileUpload(createUploadProcessor);

      expect(auditService.uploadFile).toHaveBeenCalledWith(
        createUploadProcessor.data,
      );
    });
  });
});
