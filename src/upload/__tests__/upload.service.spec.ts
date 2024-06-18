import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from '../upload.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Upload } from '../entities/upload.entity';
import { Repository } from 'typeorm';
import { QueueService } from '../../queue/queue.service';
import {
  fileContentMock,
  uploadFileMock,
  uploadInvalidFileContentMock,
  uploadMock,
} from '../__mocks__/upload.mocks';

describe('UploadService', () => {
  let service: UploadService;
  let uploadRepository: Repository<Upload>;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getRepositoryToken(Upload),
          useValue: {
            save: jest.fn().mockResolvedValue(uploadMock),
          },
        },
        {
          provide: QueueService,
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    uploadRepository = module.get<Repository<Upload>>(
      getRepositoryToken(Upload),
    );
    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(uploadRepository).toBeDefined();
    expect(queueService).toBeDefined();
  });

  it('should save the upload entity and add a job to the queue', async () => {
    const createdUpload = await service.uploadFile(uploadFileMock);

    expect(uploadRepository.save).toHaveBeenCalled();
    expect(queueService.add).toHaveBeenCalledWith({
      fileContent: fileContentMock,
      upload_id: uploadMock.id,
    });
    expect(createdUpload).toEqual({
      message: 'Os dados estão sendo processados!',
    });
  });

  it('should remove invalid characters from the file content', async () => {
    await service.uploadFile(uploadInvalidFileContentMock);

    expect(queueService.add).toHaveBeenCalledWith({
      fileContent: fileContentMock,
      upload_id: uploadMock.id,
    });
  });
});
