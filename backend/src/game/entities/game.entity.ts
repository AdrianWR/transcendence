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

@Entity({ name: 'game' })
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'player_one_id' })
  public playerOne: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'player_two_id' })
  public playerTwo: User;

  @Column({ name: 'player_one_score', default: 0 })
  public playerOneScore: number;

  @Column({ name: 'player_two_score', default: 0 })
  public playerTwoScore: number;

  @Column({ name: 'is_finished', default: false })
  public isFinished: boolean;

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
