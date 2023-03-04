import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  mfa_enabled?: boolean;

  @Column({ type: 'bytea', nullable: true })
  picture?: Uint8Array;

  @Column({ nullable: true })
  refreshToken?: string
}