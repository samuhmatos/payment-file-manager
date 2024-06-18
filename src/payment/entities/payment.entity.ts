import { Upload } from '../../upload/entities/upload.entity';
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

  @Column({ nullable: false, type: 'varchar', length: '11' })
  cpf: string;

  @Column({ nullable: false, type: 'float' })
  total: number;

  @Column({ nullable: false, length: '8', type: 'varchar' })
  birth_date: string;

  @Column({ nullable: false, type: 'int' })
  upload_id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @ManyToOne(() => Upload, (upload) => upload.payments)
  @JoinColumn({ name: 'upload_id', referencedColumnName: 'id' })
  upload?: Upload;
}
