import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../audit.service';
import { QueueService } from '../../queue/queue.service';
import {
  fileContentMock,
  uploadFileMock,
  uploadInvalidFileContentMock,
} from '../__mocks__/audit.mock';
import { auditMock } from '../../audit/__mocks__/audit.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Audit, AuditRepository } from '../entities/audit.entity';
import { PaymentService } from '../../payment/payment.service';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { NotFoundException } from '@nestjs/common';

describe('AuditService', () => {
  let service: AuditService;
  let queueService: QueueService;
  let auditRepository: AuditRepository;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PaymentService,
          useValue: {
            create: jest.fn().mockResolvedValue([paymentMock]),
          },
        },
        {
          provide: QueueService,
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Audit),
          useValue: {
            save: jest.fn().mockResolvedValue(auditMock),
            findOne: jest.fn().mockResolvedValue(auditMock),
          },
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    auditRepository = module.get<AuditRepository>(getRepositoryToken(Audit));
    queueService = module.get<QueueService>(QueueService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(queueService).toBeDefined();
    expect(auditRepository).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('create', () => {
    it('should create audit and add a job to the queue', async () => {
      const createdUpload = await service.create(uploadFileMock);

      expect(queueService.add).toHaveBeenCalledWith({
        fileContent: fileContentMock,
        audit_id: auditMock.id,
      });
      expect(createdUpload).toEqual({
        message: 'Os dados estão sendo processados!',
      });
    });

    it('should remove invalid characters from the file content', async () => {
      const createdUpload = await service.create(uploadInvalidFileContentMock);

      expect(queueService.add).toHaveBeenCalledWith({
        fileContent: fileContentMock,
        audit_id: auditMock.id,
      });
      expect(createdUpload).toEqual({
        message: 'Os dados estão sendo processados!',
      });
    });
  });

  describe('findById', () => {
    it('should return audit', async () => {
      const audit = await service.findById(auditMock.id);

      expect(audit).toEqual(auditMock);
    });

    it('should throw exception if audit id not found', async () => {
      jest.spyOn(auditRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findById(auditMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('confirme', () => {
    it('should confirm the audit', async () => {
      const audit = await service.confirm(auditMock.id);

      expect(audit).toEqual(auditMock);
    });

    it('should throw exception if audit id not found', async () => {
      jest.spyOn(auditRepository, 'findOne').mockResolvedValue(undefined);

      expect(service.findById(auditMock.id)).rejects.toThrow(NotFoundException);
    });
  });
});
