import { Payment } from '../entities/payment.entity';
import { ReturnPaymentDto } from './return-payment.dto';

export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export class Pagination {
  meta: PaginationMeta;
  data: ReturnPaymentDto[];

  constructor(paginationMega: PaginationMeta, data: Payment[]) {
    this.meta = paginationMega;
    this.data = data.map((payment) => new ReturnPaymentDto(payment));
  }
}
