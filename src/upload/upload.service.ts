import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload, UploadRepository } from './entities/upload.entity';
import { UploadFileDto } from './dtos/upload-file.dto';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: UploadRepository,

    private readonly queueService: QueueService,
  ) {}

  async uploadFile({ file }: UploadFileDto) {
    const fileContent = file.buffer
      .toString('utf-8')
      .replace(/[\uFFFD\u0000]/g, '');

    const uploaded = await this.uploadRepository.save({});

    await this.queueService.add({
      fileContent,
      upload_id: uploaded.id,
    });

    return { message: 'Os dados estão sendo processados!' };
  }
}
