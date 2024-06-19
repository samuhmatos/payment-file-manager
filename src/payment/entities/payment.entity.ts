import { Audit } from '../../audit/entities/audit.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

export type PaymentRepository = Repository<Payment>;

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: '15', type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'int' })
  age: number;

  @Column({ nullable: false, length: '34', type: 'varchar' })
  address: string;

  @Column({ nullable: false, type: 'varchar', length: '14' })
  cpf: string;

  @Column({ nullable: false, type: 'float' })
  total: number;

  @Column({ nullable: false, type: 'date' })
  birth_date: Date;

  @Column({ nullable: false, type: 'int' })
  audit_id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @ManyToOne(() => Audit, (audit) => audit.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audit_id', referencedColumnName: 'id' })
  audit?: Audit;
}
