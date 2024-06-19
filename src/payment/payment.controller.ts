import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

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

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(updatePaymentDto, id);
  }
}
