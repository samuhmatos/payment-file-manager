import { auditMock } from '../../audit/__mocks__/audit.mock';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/update-payment.dto';
import { Payment } from '../entities/payment.entity';

export const paymentMock: Payment = {
  id: 1,
  name: 'Kathryne Lockma',
  age: 51,
  address: '845 Fahey Summit East Dillon',
  cpf: '11626761422',
  total: 76382,
  birth_date: '20230321',
  audit_id: auditMock.id,
  created_at: new Date(),
  updated_at: new Date(),
};

export const paymentWithUploadMock: Payment = {
  ...paymentMock,
  audit: auditMock,
};

export const createPaymentMock: CreatePaymentDto[] = [
  {
    name: paymentMock.name,
    age: paymentMock.age,
    address: paymentMock.address,
    cpf: paymentMock.cpf,
    total: paymentMock.total,
    audit_id: paymentMock.audit_id,
    birth_date: paymentMock.birth_date,
  },
];

export const updatePaymentMock: UpdatePaymentDto = {
  name: paymentMock.name,
  address: paymentMock.address,
  age: paymentMock.age,
  birth_date: paymentMock.birth_date,
  cpf: paymentMock.cpf,
  total: paymentMock.total,
};
