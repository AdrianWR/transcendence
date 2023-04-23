import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatUsers } from './chat-users.entity';

export enum CHAT_TYPE {
  PRIVATE = 'private',
  PUBLIC = 'public',
  PROTECTED = 'protected',
  DIRECT = 'direct',
}

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ default: CHAT_TYPE.DIRECT })
  type: CHAT_TYPE;

  @OneToMany(() => ChatUsers, (chatUsers) => chatUsers.chat, {
    eager: true,
    cascade: true,
  })
  users: ChatUsers[];

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ name: 'last_message', nullable: true })
  lastMessage: string;

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
