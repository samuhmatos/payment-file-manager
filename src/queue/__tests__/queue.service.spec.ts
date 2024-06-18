import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../queue.service';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueEnum } from '../enums/queue.enum';
import { UploadJobData } from '../../upload/upload.processor';
import { createQueueMock } from '../__mocks__/queue.mocks';

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
            getJobs: jest.fn(),
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
});
