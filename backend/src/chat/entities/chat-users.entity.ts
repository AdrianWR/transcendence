import {
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

export enum Status {
  ACTIVE = 'active',
  MUTED = 'muted',
  BANNED = 'banned',
  BLOCKED = 'blocked',
}

export enum Role {
  MEMBER = 'member',
  ADMIN = 'admin',
  OWNER = 'owner',
}

// Create a table callad chat_users wich tracks the many to many
// relationship between Chat and User entities

@Entity('chat_users')
export class ChatUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.users)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chats)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

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
