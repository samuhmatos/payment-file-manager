import { Audit } from '../../audit/entities/audit.entity';
import { Payment } from '../entities/payment.entity';

export class ReturnPaymentDto {
  id: number;
  name: string;
  age: number;
  address: string;
  cpf: string;
  total: number;
  birth_date: string;

  audit?: Audit;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.name = payment.name;
    this.age = payment.age;
    this.address = payment.address;
    this.cpf = payment.cpf;
    this.total = payment.total;
    this.birth_date = payment.birth_date;

    if (payment.audit) this.audit = payment.audit;
  }
}
