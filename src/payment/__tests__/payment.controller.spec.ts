import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../payment.controller';
import { PaymentService } from '../payment.service';
import { BadRequestException } from '@nestjs/common';
import {
  paginateResultMock,
  queryPaginateMock,
} from '../__mocks__/paginate.mock';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            paginate: jest.fn().mockResolvedValue(paginateResultMock),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(paymentService).toBeDefined();
  });

  describe('paginate', () => {
    it('should call PaymentService.paginate with correct parameters', async () => {
      const result = await controller.paginate(
        queryPaginateMock.upload_id,
        queryPaginateMock.page,
      );

      expect(result).toEqual(paginateResultMock);
      expect(paymentService.paginate).toHaveBeenCalledWith(queryPaginateMock);
    });

    it('should throw BadRequestException if upload_id is not provided', async () => {
      jest
        .spyOn(paymentService, 'paginate')
        .mockRejectedValue(new BadRequestException('upload_id é obrigatório'));

      await expect(controller.paginate(undefined, 1)).rejects.toThrow(
        new BadRequestException('upload_id é obrigatório'),
      );
    });
  });
});
