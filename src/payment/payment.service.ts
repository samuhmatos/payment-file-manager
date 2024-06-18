import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentRepository } from './entities/payment.entity';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async create(createPaymentDto: CreatePaymentDto[]) {
    return this.paymentRepository.save(createPaymentDto);
  }
}
