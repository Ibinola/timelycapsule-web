import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  type!: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  message?: string;

  @Column({ type: 'json', nullable: true })
  data?: any;

  @Column({ default: false })
  read!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
