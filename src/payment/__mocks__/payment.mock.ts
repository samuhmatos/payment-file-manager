import { uploadMock } from '../../upload/__mocks__/upload.mocks';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { Payment } from '../entities/payment.entity';

export const paymentMock: Payment = {
  id: 1,
  name: 'Kathryne Lockma',
  age: 51,
  address: '845 Fahey Summit East Dillon',
  cpf: '11626761422',
  total: 76382,
  birth_date: '20230321',
  upload_id: uploadMock.id,
  created_at: new Date(),
  updated_at: new Date(),
};

export const createPaymentMock: CreatePaymentDto[] = [
  {
    name: paymentMock.name,
    age: paymentMock.age,
    address: paymentMock.address,
    cpf: paymentMock.cpf,
    total: paymentMock.total,
    upload_id: paymentMock.upload_id,
    birth_date: paymentMock.birth_date,
  },
];
