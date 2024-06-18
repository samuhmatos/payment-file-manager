import { uploadMock } from '../../upload/__mocks__/upload.mocks';
import { PaginatePaymentDto } from '../dtos/paginate-payment.dto';
import { paymentMock } from './payment.mock';
import { Pagination } from '../dtos/return-paginate-payment.dto';
import { DEFAULT_PER_PAGE } from '../payment.service';
import { ReturnPaymentDto } from '../dtos/return-payment.dto';

export const paginatePaymentMock: PaginatePaymentDto = {
  page: 1,
  upload_id: uploadMock.id,
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

export const queryPaginateMock = { upload_id: uploadMock.id, page: 1 };
