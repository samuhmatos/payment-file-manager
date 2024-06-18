import { Payment } from '../../payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';

export type UploadRepository = Repository<Upload>;

@Entity({ name: 'uploads' })
export class Upload {
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

  @ManyToOne(() => Payment, (payment) => payment.upload)
  payments?: Payment[];
}
