import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PaymentModule } from './payment/payment.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    PaymentModule,
    BullModule.forRoot({
      redis: {
        host: process.env.QUEUE_HOST,
        port: Number(process.env.QUEUE_PORT),
        password: process.env.QUEUE_PASSWORD,
      },
    }),
    QueueModule,
    AuditModule,
  ],
})
export class AppModule {}
