import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../queue.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEnum } from '../enums/queue.enum';
import { createQueueMock, jobsMock } from '../__mocks__/queue.mocks';
import { UploadJobData } from '../../audit/audit.processor';

describe('QueueService', () => {
  let service: QueueService;
  let queueMock: Queue<UploadJobData>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getQueueToken(QueueEnum.FILE_UPLOAD),
          useValue: {
            add: jest.fn(),
            getJobs: jest.fn().mockResolvedValue(jobsMock),
          },
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    queueMock = module.get<Queue<UploadJobData>>(
      getQueueToken(QueueEnum.FILE_UPLOAD),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(queueMock).toBeDefined();
  });

  it('should add a job to the queue', async () => {
    await service.add(createQueueMock);

    expect(queueMock.add).toHaveBeenCalledWith(createQueueMock);
  });

  it('should get active or waiting jobs from the queue', async () => {
    const jobStatus = await service.getJobStatus();

    expect(jobStatus.activeJobs).toEqual(jobsMock);
  });
});
