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

export enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished',
  ABORTED = 'aborted',
}

@Entity({ name: 'game' })
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true, cascade: true })
  @JoinColumn({ name: 'player_one_id', referencedColumnName: 'id' })
  public playerOne: User;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'player_two_id', referencedColumnName: 'id' })
  public playerTwo: User;

  @Column({ name: 'player_one_score', default: 0 })
  public playerOneScore: number;

  @Column({ name: 'player_two_score', default: 0 })
  public playerTwoScore: number;

  @Column({ name: 'status', default: GameStatus.WAITING })
  public status: GameStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;
}
