import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audit } from './entities/audit.entity';
import { AuditController } from './audit.controller';
import { QueueModule } from '../queue/queue.module';
import { PaymentModule } from '../payment/payment.module';
import { AuditProcessor } from './audit.processor';

@Module({
  providers: [AuditService, AuditProcessor],
  exports: [AuditService],
  imports: [TypeOrmModule.forFeature([Audit]), QueueModule, PaymentModule],
  controllers: [AuditController],
})
export class AuditModule {}
