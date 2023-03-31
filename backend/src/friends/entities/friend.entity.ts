import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FRIEND_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REMOVED = 'removed',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

@Entity({ name: 'friends' })
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  public sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  public recipient: User;

  @Column({ nullable: true })
  public accepted_date: Date;

  @Column({ default: FRIEND_STATUS.PENDING })
  public status: FRIEND_STATUS;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
