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
import { Chat } from './chat.entity';

@Entity({
  name: 'messages',
})
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @Column({ default: false })
  public see: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  public sender: User;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chat_id' })
  public chat: Chat;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
