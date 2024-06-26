import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../payment.controller';
import { PaymentService } from '../payment.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  paginateResultMock,
  queryPaginateMock,
} from '../__mocks__/paginate.mock';
import { paymentMock, updatePaymentMock } from '../__mocks__/payment.mock';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';

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
            update: jest.fn().mockResolvedValue(paymentMock),
            remove: jest.fn().mockResolvedValue(returnDeleteMock),
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
        queryPaginateMock.audit_id,
        queryPaginateMock.page,
      );

      expect(result).toEqual(paginateResultMock);
      expect(paymentService.paginate).toHaveBeenCalledWith(queryPaginateMock);
    });

    it('should throw BadRequestException if audit_id is not provided', async () => {
      jest
        .spyOn(paymentService, 'paginate')
        .mockRejectedValue(new BadRequestException('audit_id é obrigatório'));

      await expect(controller.paginate(undefined, 1)).rejects.toThrow(
        new BadRequestException('audit_id é obrigatório'),
      );
    });
  });

  describe('update', () => {
    it('should update', async () => {
      const payment = await controller.update(
        paymentMock.id,
        updatePaymentMock,
      );

      expect(payment).toEqual(paymentMock);
    });

    it('should throw exception if id not found', async () => {
      jest
        .spyOn(paymentService, 'update')
        .mockRejectedValue(new NotFoundException());

      expect(
        controller.update(paymentMock.id, updatePaymentMock),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove', async () => {
      const deletedResult = await controller.remove(paymentMock.id);

      expect(deletedResult).toEqual({ message: 'Apagado com sucesso' });
    });

    it('should throw exception if id not found', () => {
      jest
        .spyOn(paymentService, 'remove')
        .mockRejectedValue(new NotFoundException());

      expect(controller.remove(paymentMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
