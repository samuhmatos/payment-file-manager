import { PaginatePaymentDto } from '../dtos/paginate-payment.dto';
import { paymentMock } from './payment.mock';
import { Pagination } from '../dtos/return-paginate-payment.dto';
import { DEFAULT_PER_PAGE } from '../payment.service';
import { ReturnPaymentDto } from '../dtos/return-payment.dto';
import { auditMock } from '../../audit/__mocks__/audit.mock';

export const paginatePaymentMock: PaginatePaymentDto = {
  page: 1,
  audit_id: auditMock.id,
};

export const invalidPaginatePaymentMock: PaginatePaymentDto = {
  page: 1,
};

export const paginateFindAndCountMock = [[paymentMock], 1];

export const paginateResultMock: Pagination = {
  data: [new ReturnPaymentDto(paymentMock)],
  meta: {
    currentPage: 1,
    itemsPerPage: DEFAULT_PER_PAGE,
    totalItems: 1,
    totalPages: Math.ceil(1 / DEFAULT_PER_PAGE),
  },
};

export const queryPaginateMock = { audit_id: auditMock.id, page: 1 };
