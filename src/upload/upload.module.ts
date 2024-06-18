import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { UploadController } from './upload.controller';
import { PaymentModule } from '../payment/payment.module';
import { UploadProcessor } from './upload.processor';
import { QueueModule } from '../queue/queue.module';

@Module({
  providers: [UploadService, UploadProcessor],
  imports: [TypeOrmModule.forFeature([Upload]), PaymentModule, QueueModule],
  controllers: [UploadController],
})
export class UploadModule {}
