import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('channels')
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channelName: string;

  @Column({default: 0} )
  channelType: number;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true} )
  channelOwner: string;

  @Column("text", {array: true, nullable: true})
  channelAdmins: string[];

}
