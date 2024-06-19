import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from '../audit.controller';
import { AuditService } from '../audit.service';
import { uploadFileMock } from '../__mocks__/audit.mock';

describe('AuditController', () => {
  let auditService: AuditService;
  let controller: AuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              message: 'Os dados estão sendo processados!',
            }),
          },
        },
      ],
    }).compile();

    auditService = module.get<AuditService>(AuditService);
    controller = module.get<AuditController>(AuditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(auditService).toBeDefined();
  });

  it('should upload a file and return a success message', async () => {
    const uploaded = await controller.create(uploadFileMock.file);

    expect(uploaded).toEqual({
      message: 'Os dados estão sendo processados!',
    });

    expect(auditService.create).toHaveBeenCalledWith({
      file: uploadFileMock.file,
    });
  });
});
