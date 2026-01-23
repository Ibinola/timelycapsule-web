import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('capsule_payments')
export class CapsulePayment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  capsuleId!: string;

  @Column()
  paymentAddress!: string;

  @Column()
  memo!: string;

  @Column({ nullable: true })
  transactionHash?: string;

  @Column({ default: false })
  verified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
