import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { ReturnDeleteResultDto } from '../dtos/return-delete-result.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async paginate(
    @Query('audit_id') audit_id?: number,
    @Query('page') page?: number,
  ) {
    return this.paymentService.paginate({
      audit_id,
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

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const deletedResult = await this.paymentService.remove(id);

    return new ReturnDeleteResultDto(deletedResult);
  }
}
