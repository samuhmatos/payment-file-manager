import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../upload.controller';
import { UploadService } from '../upload.service';
import { uploadFileMock } from '../__mocks__/upload.mocks';

describe('UploadController', () => {
  let uploadService: UploadService;
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue({
              message: 'Os dados estão sendo processados!',
            }),
          },
        },
      ],
    }).compile();

    uploadService = module.get<UploadService>(UploadService);
    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(uploadService).toBeDefined();
  });

  it('should upload a file and return a success message', async () => {
    const uploaded = await controller.uploadFile(uploadFileMock.file);

    expect(uploaded).toEqual({
      message: 'Os dados estão sendo processados!',
    });

    expect(uploadService.uploadFile).toHaveBeenCalledWith({
      file: uploadFileMock.file,
    });
  });
});
