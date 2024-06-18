import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { PaymentModule } from './payment/payment.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UploadModule,
    PaymentModule,
    BullModule.forRoot({
      redis: {
        host: process.env.QUEUE_HOST,
        port: Number(process.env.QUEUE_PORT),
        password: process.env.QUEUE_PASSWORD,
      },
    }),
    QueueModule,
  ],
})
export class AppModule {}
