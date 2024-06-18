import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { QueueModule } from '../queue/queue.module';
import { PaymentController } from './payment.controller';

@Module({
  providers: [PaymentService],
  exports: [PaymentService],
  imports: [TypeOrmModule.forFeature([Payment]), QueueModule],
  controllers: [PaymentController],
})
export class PaymentModule {}
