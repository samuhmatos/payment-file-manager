import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async paginate(
    @Query('upload_id') upload_id?: number,
    @Query('page') page?: number,
  ) {
    return this.paymentService.paginate({
      upload_id,
      page,
    });
  }
}
