import { Exclude, Transform } from 'class-transformer';
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

  @Column({ default: false })
  mfaEnabled?: boolean;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Exclude()
  @Column({ nullable: true })
  mfaSecret?: string;

  @Transform(({ obj }) => `${process.env.BACKEND_URL}/users/${obj.id}/avatar`)
  @Column({ type: 'bytea', nullable: true })
  picture?: Uint8Array;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;
}
