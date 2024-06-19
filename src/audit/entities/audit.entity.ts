import { Payment } from '../../payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

export type AuditRepository = Repository<Audit>;

@Entity({ name: 'audits' })
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'confirmed', nullable: false, default: false })
  confirmed: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updated_at: Date;

  @OneToMany(() => Payment, (payment) => payment.audit)
  payments?: Payment[];
}
